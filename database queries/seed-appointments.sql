INSERT INTO appointments (
    customer_id,
    service_id,
    appointment_date,
    appointment_time,
    status,
    notes
)
VALUES
    (
        1,
        1,
        CURDATE(),
        '09:00:00',
        'Scheduled',
        'Customer prefers a low fade.'
    ),
    (
        2,
        3,
        CURDATE(),
        '11:00:00',
        'In Progress',
        'Haircut and beard should be neatly shaped.'
    ),
    (
        3,
        2,
        DATE_SUB(CURDATE(), INTERVAL 1 DAY),
        '14:00:00',
        'Completed',
        NULL
    ),
    (
        4,
        4,
        DATE_ADD(CURDATE(), INTERVAL 1 DAY),
        '10:30:00',
        'Scheduled',
        'Appointment for a twelve-year-old child.'
    ),
    (
        5,
        5,
        DATE_SUB(CURDATE(), INTERVAL 2 DAY),
        '16:00:00',
        'Cancelled',
        'Customer cancelled before arrival.'
    );