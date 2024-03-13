CREATE TABLE users(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(255) NOT NULL,
    email varchar(2000) UNIQUE NOT NULL,
    provider varchar(255),
    password varchar(2000),
    logged_out boolean NOT NULL,
    profile_picture_key varchar(2000)
);

CREATE TYPE photographer_status AS enum(
    'NOT_VERIFIED',
    'PENDING',
    'VERIFIED'
);

CREATE TABLE photographers(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    is_verified photographer_status NOT NULL DEFAULT 'NOT_VERIFIED'
);

CREATE TABLE administrators(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email varchar(2000) UNIQUE NOT NULL,
    password varchar(2000) NOT NULL,
    logged_out boolean NOT NULL
);

