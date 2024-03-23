CREATE TYPE issue_status AS enum('OPEN', 'CLOSED');


CREATE TABLE issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
  reporter_id UUID REFERENCES user(id) ON UPDATE cascade ON DELETE SET NULL,
  status issue_status NOT NULL DEFAULT 'OPEN',
  due_date timestamptz NOT NULL DEFAULT now(),
  description varchar(2000),
  created_at timestamptz NOT NULL DEFAULT now()
);
