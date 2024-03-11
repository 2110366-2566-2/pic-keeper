CREATE TABLE packages(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    photographer_id uuid NOT NULL REFERENCES photographers(id) ON DELETE CASCADE,
    name varchar(255) NOT NULL,
    price integer NOT NULL
);

CREATE TYPE booking_status AS enum(
    'PENDING',
    'CONFIRMED',
    'CANCELLED',
    'C_REQ_CANCEL',
    'P_REQ_CANCEL'
);

CREATE TABLE bookings(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    package_id uuid NOT NULL REFERENCES packages(id),
    start_time timestamptz NOT NULL,
    end_time timestamptz NOT NULL,
    status booking_status NOT NULL DEFAULT 'PENDING',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

