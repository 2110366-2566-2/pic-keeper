CREATE TABLE users(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(255) NOT NULL,
    email varchar(2000) UNIQUE NOT NULL,
    provider varchar(255),
    password varchar(2000),
    logged_out boolean NOT NULL,
    profile_picture varchar(255)
);

CREATE TABLE photographers(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    is_verified boolean NOT NULL
);