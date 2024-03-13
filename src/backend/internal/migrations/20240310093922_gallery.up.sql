CREATE TABLE galleries(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    photographer_id uuid NOT NULL REFERENCES photographers(id) ON DELETE CASCADE,
    name varchar(255) NOT NULL,
    price integer NOT NULL
);

CREATE TYPE booking_status AS enum(
    'USER_PAID',
    'CANCELLED',
    'C_REQ_CANCEL',
    'P_REQ_CANCEL',
    'COMPLETED',
    'PAID_OUT'
);

CREATE TABLE bookings(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    gallery_id uuid NOT NULL REFERENCES galleries(id),
    start_time timestamptz NOT NULL,
    end_time timestamptz NOT NULL,
    status booking_status NOT NULL DEFAULT 'USER_PAID',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE photos(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    gallery_id uuid NOT NULL REFERENCES galleries(id),
    photo_key varchar(2000) NOT NULL
);

