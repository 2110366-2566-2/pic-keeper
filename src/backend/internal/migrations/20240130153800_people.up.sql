CREATE TABLE users(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(255) NOT NULL,
    email varchar(2000) NOT NULL,
    password varchar(2000) NOT NULL,
    logged_out boolean NOT NULL
);

CREATE TABLE photographers(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    is_verified boolean NOT NULL
);

