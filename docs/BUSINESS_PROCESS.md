# TrimTrack Business Process

## Purpose and user

TrimTrack gives one authenticated administrator or barber a small local system
for managing customers, services, appointments, and the daily dashboard. It
replaces scattered paper notes or spreadsheets with related, searchable
records.

`PLAN.md` remains the source of truth for the complete page list, REST API list,
data rules, and version-one boundaries. This document explains how those pieces
work together.

## Main workflows

### Customers

1. The administrator searches the existing customer list.
2. If the customer is new, the administrator records their name and phone
   number, with optional email and gender.
3. The administrator may view or edit that customer later.
4. A customer may be deleted only when no appointment refers to them.

### Services

1. The administrator records a service name, optional description, price, and
   duration.
2. Services are available when creating or editing appointments.
3. The administrator may edit a service as its price or duration changes.
4. A service may be deleted only when no appointment refers to it.

### Appointments

1. The administrator selects one existing customer and one existing service.
2. The administrator records the date, time, and optional notes.
3. A new appointment starts as `Scheduled` unless an approved status is
   explicitly supplied.
4. The administrator may edit, filter, inspect, delete, or change the status of
   the appointment.
5. The dashboard summarizes stored appointments and shows recent or today's
   work.

Version one accepts exactly four statuses:

- `Scheduled`
- `In Progress`
- `Completed`
- `Cancelled`

There is no additional transition state machine in version one. Validation
ensures that a stored status belongs to the approved set.

## Process flow

```text
Administrator logs in
  -> finds or creates a customer
  -> selects an existing service
  -> creates an appointment
  -> updates appointment details or status as work progresses
  -> reviews dashboard totals and recent/today appointments
  -> logs out
```

## Version-one boundaries

Some exported screens imply a larger product. Their information hierarchy may
guide future layouts, but version one does not add staff or barber management,
public customer booking, service categories or visibility, payments or revenue,
notifications, exports, multi-shop tenancy, or advanced analytics. Unsupported
controls and labels will be removed or replaced with approved data when their
frontend phase is implemented.
