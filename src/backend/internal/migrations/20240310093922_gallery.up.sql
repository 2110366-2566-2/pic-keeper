CREATE TABLE galleries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
  photographer_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  name varchar(255) NOT NULL,
  price integer NOT NULL,
  location varchar(255) NOT NULL
);


CREATE TYPE booking_status AS enum(
  'DRAFT',
  'USER_PAID',
  'CANCELLED',
  'C_REQ_CANCEL',
  'P_REQ_CANCEL',
  'COMPLETED',
  'PAID_OUT'
);


CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
  customer_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  gallery_id UUID NOT NULL REFERENCES galleries (id),
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  status booking_status NOT NULL DEFAULT 'USER_PAID',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);


CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
  gallery_id UUID NOT NULL REFERENCES galleries (id),
  photo_key varchar(2000) NOT NULL
);
