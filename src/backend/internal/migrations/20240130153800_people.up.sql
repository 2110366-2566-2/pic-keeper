CREATE TYPE photographer_status AS enum('NOT_VERIFIED', 'PENDING', 'VERIFIED', 'REJECTED');


CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
  username varchar(255) UNIQUE NOT NULL,
  email varchar(2000) UNIQUE NOT NULL,
  provider varchar(255),
  password varchar(2000),
  logged_out boolean NOT NULL,
  profile_picture_key varchar(2000),
  firstname varchar(255) NOT NULL,
  lastname varchar(255) NOT NULL,
  verification_status photographer_status NOT NULL DEFAULT 'NOT_VERIFIED',
  is_admin boolean NOT NULL DEFAULT FALSE
);


CREATE TABLE verification_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
  user_id UUID NOT NULL REFERENCES users (id) ON DELETE cascade,
  id_card_number varchar(15) NOT NULL,
  id_card_picture_key varchar(2000) NOT NULL,
  additional_desc varchar(2000)
);
