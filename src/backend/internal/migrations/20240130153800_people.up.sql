CREATE TABLE photographers(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    is_verified boolean NOT NULL
);

CREATE TABLE users(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(255) NOT NULL,
    email varchar(2000) NOT NULL,
    password varchar(2000) NOT NULL,
    photographer_id uuid REFERENCES photographers(id) ON DELETE CASCADE
);

