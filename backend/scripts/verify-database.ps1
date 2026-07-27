param(
  [switch]$VerifyApi,
  [switch]$VerifyCrudApi
)

$ErrorActionPreference = "Stop"

$mysqlBin = "C:\Program Files\MySQL\MySQL Server 9.4\bin"
$mysqld = Join-Path $mysqlBin "mysqld.exe"
$mysql = Join-Path $mysqlBin "mysql.exe"
$mysqladmin = Join-Path $mysqlBin "mysqladmin.exe"
$backendRoot = Split-Path $PSScriptRoot -Parent
$schemaPath = (
  Resolve-Path -LiteralPath (Join-Path $backendRoot "database\schema.sql")
).Path
$seedPath = (
  Resolve-Path -LiteralPath (Join-Path $backendRoot "database\seed.sql")
).Path
$queriesPath = (
  Resolve-Path -LiteralPath (Join-Path $backendRoot "database\queries.sql")
).Path

foreach ($executable in @($mysqld, $mysql, $mysqladmin)) {
  if (-not (Test-Path -LiteralPath $executable)) {
    throw "Required MySQL executable not found: $executable"
  }
}

$tempBase = [System.IO.Path]::GetFullPath(
  [System.IO.Path]::GetTempPath()
)
$testRoot = Join-Path $tempBase (
  "trimtrack-mysql-verification-" + [guid]::NewGuid().ToString("N")
)
$dataPath = Join-Path $testRoot "data"
New-Item -ItemType Directory -Path $dataPath -Force | Out-Null
$verificationDbPassword = (
  "verify-db-" + [guid]::NewGuid().ToString("N")
)
$verificationAdminPassword = (
  "verify-admin-" + [guid]::NewGuid().ToString("N")
)

$port = 3407
while (Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue) {
  $port++
}

$serverProcess = $null
$apiProcess = $null

function Invoke-MySql {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Sql,
    [string]$Database
  )

  $arguments = @(
    "--protocol=TCP",
    "-h", "127.0.0.1",
    "-P", $port,
    "-u", "root"
  )

  if ($Database) {
    $arguments += $Database
  }

  $arguments += "--execute=$Sql"
  & $mysql @arguments

  if ($LASTEXITCODE -ne 0) {
    throw "MySQL command failed."
  }
}

function Invoke-MySqlFile {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Path
  )

  Get-Content -LiteralPath $Path -Raw |
    & $mysql `
      --protocol=TCP `
      -h 127.0.0.1 `
      -P $port `
      -u root |
    Out-Null

  if ($LASTEXITCODE -ne 0) {
    throw "MySQL file failed: $Path"
  }
}

function Test-RejectedMySqlOperation {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Sql
  )

  $previousErrorActionPreference = $ErrorActionPreference
  $ErrorActionPreference = "Continue"
  try {
    & $mysql `
      --protocol=TCP `
      -h 127.0.0.1 `
      -P $port `
      -u root `
      trimtrack_db `
      "--execute=$Sql" 2>&1 |
      Out-Null

    return $LASTEXITCODE -ne 0
  }
  finally {
    $ErrorActionPreference = $previousErrorActionPreference
  }
}

try {
  & $mysqld `
    --no-defaults `
    --initialize-insecure `
    "--datadir=$dataPath" 2>&1 | Out-Null

  if ($LASTEXITCODE -ne 0) {
    throw "Disposable MySQL initialization failed."
  }

  $stdoutPath = Join-Path $testRoot "mysql-stdout.log"
  $stderrPath = Join-Path $testRoot "mysql-stderr.log"
  $serverProcess = Start-Process `
    -FilePath $mysqld `
    -ArgumentList @(
      "--no-defaults",
      "--datadir=$dataPath",
      "--port=$port",
      "--bind-address=127.0.0.1",
      "--mysqlx=OFF",
      "--console"
    ) `
    -WindowStyle Hidden `
    -RedirectStandardOutput $stdoutPath `
    -RedirectStandardError $stderrPath `
    -PassThru

  $ready = $false
  for ($attempt = 0; $attempt -lt 30; $attempt++) {
    & $mysqladmin `
      --protocol=TCP `
      -h 127.0.0.1 `
      -P $port `
      -u root `
      ping `
      --silent 2>$null

    if ($LASTEXITCODE -eq 0) {
      $ready = $true
      break
    }

    Start-Sleep -Milliseconds 500
  }

  if (-not $ready) {
    throw "Disposable MySQL did not start. See $stderrPath"
  }

  Invoke-MySqlFile -Path $schemaPath
  Invoke-MySqlFile -Path $seedPath
  Invoke-MySqlFile -Path $seedPath
  Invoke-MySqlFile -Path $queriesPath

  Invoke-MySql -Sql (
    "CREATE USER 'trimtrack_verify'@'localhost' " +
    "IDENTIFIED BY '$verificationDbPassword'; " +
    "GRANT SELECT, INSERT, UPDATE, DELETE ON trimtrack_db.* " +
    "TO 'trimtrack_verify'@'localhost';"
  )

  $env:DB_HOST = "127.0.0.1"
  $env:DB_PORT = [string]$port
  $env:DB_NAME = "trimtrack_db"
  $env:DB_USER = "trimtrack_verify"
  $env:DB_PASSWORD = $verificationDbPassword
  $env:ADMIN_FULL_NAME = "Phase Three Administrator"
  $env:ADMIN_EMAIL = "phase-three@example.com"
  $env:ADMIN_PASSWORD = $verificationAdminPassword
  $env:SESSION_SECRET = (
    "verify-session-" + [guid]::NewGuid().ToString("N")
  )

  Push-Location $backendRoot
  try {
    & pnpm.cmd db:seed:admin | Out-Null
    if ($LASTEXITCODE -ne 0) {
      throw "First administrator seed failed."
    }

    & pnpm.cmd db:seed:admin | Out-Null
    if ($LASTEXITCODE -ne 0) {
      throw "Second administrator seed failed."
    }
  }
  finally {
    Pop-Location
  }

  if ($VerifyApi -or $VerifyCrudApi) {
    $apiPort = 3500
    while (
      Get-NetTCPConnection -LocalPort $apiPort -ErrorAction SilentlyContinue
    ) {
      $apiPort++
    }

    $env:PORT = [string]$apiPort
    Push-Location $backendRoot
    try {
      & pnpm.cmd build | Out-Null
      if ($LASTEXITCODE -ne 0) {
        throw "Backend build failed before API verification."
      }
    }
    finally {
      Pop-Location
    }

    $node = (Get-Command node.exe -ErrorAction Stop).Source
    $entrypoint = Join-Path $backendRoot "dist\index.js"
    $apiStdoutPath = Join-Path $testRoot "api-stdout.log"
    $apiStderrPath = Join-Path $testRoot "api-stderr.log"
    $apiProcess = Start-Process `
      -FilePath $node `
      -ArgumentList @($entrypoint) `
      -WorkingDirectory $backendRoot `
      -WindowStyle Hidden `
      -RedirectStandardOutput $apiStdoutPath `
      -RedirectStandardError $apiStderrPath `
      -PassThru

    $healthResponse = $null
    for ($attempt = 0; $attempt -lt 30; $attempt++) {
      try {
        $healthResponse = Invoke-RestMethod `
          -Uri "http://127.0.0.1:$apiPort/api/health" `
          -Method Get `
          -TimeoutSec 2
        break
      }
      catch {
        if ($apiProcess.HasExited) {
          break
        }

        Start-Sleep -Milliseconds 500
      }
    }

    if (
      -not $healthResponse `
        -or $healthResponse.success -ne $true `
        -or $healthResponse.data.status -ne "ok" `
        -or $healthResponse.data.database -ne "connected"
    ) {
      $apiError = if (Test-Path -LiteralPath $apiStderrPath) {
        Get-Content -LiteralPath $apiStderrPath -Raw
      } else {
        "No API error output was captured."
      }

      throw "API readiness verification failed. $apiError"
    }

    Write-Output (
      "API: startup and GET /api/health passed with database=connected"
    )

    if ($VerifyCrudApi) {
      $env:VERIFY_API_ORIGIN = "http://127.0.0.1:$apiPort"

      Push-Location $backendRoot
      try {
        & pnpm.cmd exec tsx src/scripts/verify-phases-5-7.ts
        if ($LASTEXITCODE -ne 0) {
          throw "Phases 5-7 API verification failed."
        }
      }
      finally {
        Pop-Location
      }
    }
  }

  $negativePriceRejected = Test-RejectedMySqlOperation -Sql (
    "INSERT INTO services (service_name, price, duration_minutes) " +
    "VALUES ('Invalid Price', -1.00, 30)"
  )
  $invalidDurationRejected = Test-RejectedMySqlOperation -Sql (
    "INSERT INTO services (service_name, price, duration_minutes) " +
    "VALUES ('Invalid Duration', 10.00, 0)"
  )
  $invalidForeignKeyRejected = Test-RejectedMySqlOperation -Sql (
    "INSERT INTO appointments " +
    "(customer_id, service_id, appointment_date, appointment_time) " +
    "VALUES (999999, 999999, CURRENT_DATE(), '12:00:00')"
  )
  $invalidStatusRejected = Test-RejectedMySqlOperation -Sql (
    "INSERT INTO appointments " +
    "(customer_id, service_id, appointment_date, appointment_time, status) " +
    "VALUES (1, 1, CURRENT_DATE(), '12:00:00', 'Confirmed')"
  )
  $referencedCustomerDeleteRejected = Test-RejectedMySqlOperation -Sql (
    "DELETE FROM customers WHERE customer_id = 1"
  )
  $referencedServiceDeleteRejected = Test-RejectedMySqlOperation -Sql (
    "DELETE FROM services WHERE service_id = 1"
  )

  if (
    -not (
      $negativePriceRejected `
        -and $invalidDurationRejected `
        -and $invalidForeignKeyRejected `
        -and $invalidStatusRejected `
        -and $referencedCustomerDeleteRejected `
        -and $referencedServiceDeleteRejected
    )
  ) {
    throw "One or more database constraints accepted invalid data."
  }

  $summarySql = @"
SELECT
  (SELECT COUNT(*) FROM services),
  (SELECT COUNT(*) FROM customers),
  (SELECT COUNT(*) FROM appointments),
  (SELECT COUNT(*) FROM users),
  (SELECT COUNT(*) FROM users WHERE password_hash LIKE '`$2%'),
  (
    SELECT COUNT(*)
    FROM appointments AS appointment
    INNER JOIN customers AS customer
      ON customer.customer_id = appointment.customer_id
    INNER JOIN services AS service
      ON service.service_id = appointment.service_id
  );
"@

  $summary = & $mysql `
    --batch `
    --skip-column-names `
    --protocol=TCP `
    -h 127.0.0.1 `
    -P $port `
    -u root `
    trimtrack_db `
    "--execute=$summarySql"

  if ($LASTEXITCODE -ne 0) {
    throw "Verification summary query failed."
  }

  $parts = [string]$summary -split "`t"
  if (($parts -join ",") -ne "6,5,5,1,1,5") {
    throw "Unexpected verification counts: $summary"
  }

  Write-Output "Disposable MySQL 9.4 verification passed."
  Write-Output (
    "Counts: services=6 customers=5 appointments=5 " +
    "users=1 joined_appointments=5"
  )
  Write-Output (
    "Constraints: price, duration, status, foreign keys, and referenced " +
    "deletions rejected invalid operations"
  )
  Write-Output (
    "Administrator: repeatable bcrypt upsert passed without storing plaintext"
  )
}
finally {
  if ($apiProcess -and -not $apiProcess.HasExited) {
    Stop-Process `
      -Id $apiProcess.Id `
      -Force `
      -ErrorAction SilentlyContinue
    Wait-Process `
      -Id $apiProcess.Id `
      -Timeout 10 `
      -ErrorAction SilentlyContinue
  }

  if ($serverProcess -and -not $serverProcess.HasExited) {
    & $mysqladmin `
      --protocol=TCP `
      -h 127.0.0.1 `
      -P $port `
      -u root `
      shutdown 2>$null | Out-Null

    try {
      Wait-Process -Id $serverProcess.Id -Timeout 10 -ErrorAction Stop
    }
    catch {
      Stop-Process `
        -Id $serverProcess.Id `
        -Force `
        -ErrorAction SilentlyContinue
    }
  }

  $resolvedTestRoot = [System.IO.Path]::GetFullPath($testRoot)
  $isTaskDirectory = (
    $resolvedTestRoot.StartsWith(
      $tempBase,
      [System.StringComparison]::OrdinalIgnoreCase
    ) `
      -and (
        Split-Path -Leaf $resolvedTestRoot
      ).StartsWith("trimtrack-mysql-verification-")
  )

  if ($isTaskDirectory) {
    Remove-Item `
      -LiteralPath $resolvedTestRoot `
      -Recurse `
      -Force `
      -ErrorAction SilentlyContinue
  }
}
