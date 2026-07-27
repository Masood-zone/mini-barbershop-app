import { type FormEvent, useState } from "react"
import { Eye, EyeOff, LockKeyhole, LogIn, Mail } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { Brand } from "@/components/shared/brand"
import { Field } from "@/components/shared/field"
import { InlineNotice } from "@/components/shared/inline-notice"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useLogin } from "@/services/api/auth/auth.queries"
import { getErrorMessage } from "@/utils/api-error"

export function Component() {
  const navigate = useNavigate()
  const login = useLogin()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [validationMessage, setValidationMessage] = useState("")

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setValidationMessage("")

    if (!email.trim() || !password) {
      setValidationMessage("Enter your email address and password.")
      return
    }

    login.mutate(
      { email: email.trim(), password },
      {
        onSuccess: () => navigate("/dashboard", { replace: true }),
      }
    )
  }

  return (
    <main className="relative grid min-h-svh place-items-center overflow-hidden bg-muted/35 px-4 py-10">
      <div className="absolute top-5 right-5">
        <ThemeToggle />
      </div>
      <div
        aria-hidden="true"
        className="absolute -top-20 -left-20 size-80 rounded-full bg-primary/5 blur-3xl"
      />
      <Card className="relative w-full max-w-xl p-6 sm:p-10">
        <div className="flex justify-center">
          <Brand />
        </div>
        <div className="mt-9">
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
            Enter your details to access the administrator dashboard.
          </p>
        </div>
        <form className="mt-8 grid gap-5" onSubmit={handleSubmit} noValidate>
          {validationMessage || login.error ? (
            <InlineNotice tone="error">
              {validationMessage ||
                getErrorMessage(login.error, "Login was unsuccessful.")}
            </InlineNotice>
          ) : null}
          <Field id="email" label="Email address" required>
            <div className="relative">
              <Mail
                aria-hidden="true"
                className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="admin@trimtrack.com"
                className="pl-11"
                value={email}
                disabled={login.isPending}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </Field>
          <Field id="password" label="Password" required>
            <div className="relative">
              <LockKeyhole
                aria-hidden="true"
                className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                className="px-11"
                value={password}
                disabled={login.isPending}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                type="button"
                className="absolute top-1/2 right-1 grid size-10 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </Field>
          <Button
            type="submit"
            size="lg"
            className="mt-2 w-full"
            disabled={login.isPending}
          >
            {login.isPending ? "Logging in…" : "Login to dashboard"}
            <LogIn aria-hidden="true" />
          </Button>
        </form>
      </Card>
      <p className="relative mt-6 text-center text-xs text-muted-foreground">
        Secure administrator access · TrimTrack
      </p>
    </main>
  )
}
