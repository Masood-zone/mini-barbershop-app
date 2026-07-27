USE trimtrack_db;

-- Reference and practice queries for MySQL Workbench. Repository code must
-- translate variable values into mysql2 `execute(sql, values)` placeholders.

-- List customers, newest first.
SELECT
  customer_id,
  full_name,
  phone_number,
  email,
  gender,
  created_at,
  updated_at
FROM customers
ORDER BY created_at DESC, customer_id DESC;

-- Search customers by name or phone number.
SET @customer_search = 'Mensah';
SELECT
  customer_id,
  full_name,
  phone_number,
  email,
  gender
FROM customers
WHERE full_name LIKE CONCAT('%', @customer_search, '%')
   OR phone_number LIKE CONCAT('%', @customer_search, '%')
ORDER BY full_name ASC;

-- Fetch one customer.
SET @customer_id = 1;
SELECT
  customer_id,
  full_name,
  phone_number,
  email,
  gender,
  created_at,
  updated_at
FROM customers
WHERE customer_id = @customer_id;

-- Appointment list with readable customer and service details.
SET @appointment_date = CURRENT_DATE();
SELECT
  appointment.appointment_id,
  appointment.appointment_date,
  appointment.appointment_time,
  appointment.status,
  appointment.notes,
  customer.customer_id,
  customer.full_name AS customer_name,
  customer.phone_number,
  service.service_id,
  service.service_name,
  service.price,
  service.duration_minutes
FROM appointments AS appointment
INNER JOIN customers AS customer
  ON customer.customer_id = appointment.customer_id
INNER JOIN services AS service
  ON service.service_id = appointment.service_id
WHERE appointment.appointment_date = @appointment_date
ORDER BY appointment.appointment_time ASC;

-- Dashboard totals.
SELECT
  (SELECT COUNT(*) FROM customers) AS total_customers,
  (SELECT COUNT(*) FROM services) AS total_services,
  (SELECT COUNT(*) FROM appointments) AS total_appointments,
  (
    SELECT COUNT(*)
    FROM appointments
    WHERE appointment_date = CURRENT_DATE()
  ) AS todays_appointments,
  (
    SELECT COUNT(*)
    FROM appointments
    WHERE status = 'Completed'
  ) AS completed_appointments;

-- Recent appointments.
SELECT
  appointment.appointment_id,
  appointment.appointment_date,
  appointment.appointment_time,
  appointment.status,
  customer.full_name AS customer_name,
  service.service_name
FROM appointments AS appointment
INNER JOIN customers AS customer
  ON customer.customer_id = appointment.customer_id
INNER JOIN services AS service
  ON service.service_id = appointment.service_id
ORDER BY
  appointment.appointment_date DESC,
  appointment.appointment_time DESC
LIMIT 5;

-- Mutation practice. Keep the transaction and ROLLBACK while learning so the
-- sample database is restored after each exercise.
START TRANSACTION;

INSERT INTO customers (full_name, phone_number, email, gender)
VALUES ('Practice Customer', '0000000000', NULL, NULL);

SET @practice_customer_id = LAST_INSERT_ID();

UPDATE customers
SET full_name = 'Updated Practice Customer'
WHERE customer_id = @practice_customer_id;

DELETE FROM customers
WHERE customer_id = @practice_customer_id;

ROLLBACK;

-- Appointment status practice.
START TRANSACTION;

SET @appointment_id = 1;
UPDATE appointments
SET status = 'In Progress'
WHERE appointment_id = @appointment_id;

ROLLBACK;
