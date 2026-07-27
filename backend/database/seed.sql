USE trimtrack_db;

-- Development-only sample data. Run this on a new local database before adding
-- real records. Fixed primary keys make repeated runs update the same samples.
-- Administrators are seeded separately with `pnpm db:seed:admin` so a
-- plain-text password never appears in this SQL file.

INSERT INTO services (
  service_id,
  service_name,
  description,
  price,
  duration_minutes
)
VALUES
  (1, 'Standard Haircut', 'A clean and professional regular haircut.', 30.00, 30),
  (2, 'Beard Trim', 'Beard shaping and trimming service.', 20.00, 20),
  (3, 'Haircut and Beard Trim', 'Complete haircut and beard grooming package.', 45.00, 45),
  (4, 'Children Haircut', 'Haircut service for children.', 25.00, 30),
  (5, 'Hairline Shaping', 'Clean shaping of the front and side hairline.', 15.00, 15),
  (6, 'Hair Dye', 'Professional hair colouring service.', 80.00, 60)
ON DUPLICATE KEY UPDATE
  service_name = VALUES(service_name),
  description = VALUES(description),
  price = VALUES(price),
  duration_minutes = VALUES(duration_minutes);

INSERT INTO customers (
  customer_id,
  full_name,
  phone_number,
  email,
  gender
)
VALUES
  (1, 'Daniel Mensah', '0241112233', 'daniel.mensah@example.com', 'Male'),
  (2, 'Akua Owusu', '0552223344', 'akua.owusu@example.com', 'Female'),
  (3, 'Kwame Asare', '0203334455', 'kwame.asare@example.com', 'Male'),
  (4, 'Michael Boateng', '0544445566', NULL, 'Male'),
  (5, 'Nana Yeboah', '0595556677', 'nana.yeboah@example.com', 'Other')
ON DUPLICATE KEY UPDATE
  full_name = VALUES(full_name),
  phone_number = VALUES(phone_number),
  email = VALUES(email),
  gender = VALUES(gender);

INSERT INTO appointments (
  appointment_id,
  customer_id,
  service_id,
  appointment_date,
  appointment_time,
  status,
  notes
)
VALUES
  (1, 1, 1, CURRENT_DATE(), '09:00:00', 'Scheduled', 'Customer prefers a low fade.'),
  (2, 2, 3, CURRENT_DATE(), '11:00:00', 'In Progress', 'Haircut and beard should be neatly shaped.'),
  (3, 3, 2, DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), '14:00:00', 'Completed', NULL),
  (4, 4, 4, DATE_ADD(CURRENT_DATE(), INTERVAL 1 DAY), '10:30:00', 'Scheduled', 'Appointment for a twelve-year-old child.'),
  (5, 5, 5, DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY), '16:00:00', 'Cancelled', 'Customer cancelled before arrival.')
ON DUPLICATE KEY UPDATE
  customer_id = VALUES(customer_id),
  service_id = VALUES(service_id),
  appointment_date = VALUES(appointment_date),
  appointment_time = VALUES(appointment_time),
  status = VALUES(status),
  notes = VALUES(notes);
