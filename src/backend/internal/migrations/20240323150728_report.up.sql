CREATE TYPE issue_status AS enum('OPEN', 'CLOSED');


CREATE TYPE issue_subject AS enum('REFUND', 'TECHNICAL');


CREATE TABLE issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
  reporter_id UUID REFERENCES users (id) ON UPDATE cascade ON DELETE SET NULL,
  status issue_status NOT NULL DEFAULT 'OPEN',
  subject issue_subject NOT NULL DEFAULT 'TECHNICAL',
  booking_id UUID REFERENCES bookings (id),
  due_date timestamptz NOT NULL DEFAULT now(),
  description varchar(2000),
  created_at timestamptz NOT NULL DEFAULT now()
);
