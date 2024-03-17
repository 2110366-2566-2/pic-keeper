CREATE TYPE user_gender AS enum('MALE', 'FEMALE', 'OTHER');

ALTER TABLE
    users
ADD
    COLUMN address VARCHAR(255),
ADD
    COLUMN phone_number VARCHAR(255),
ADD
    COLUMN gender user_gender,
ADD
    COLUMN about VARCHAR(2000);