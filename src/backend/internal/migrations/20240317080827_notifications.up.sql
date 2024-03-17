CREATE TABLE notifications(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    room_id uuid NOT NULL REFERENCES rooms(id) ON UPDATE CASCADE ON DELETE SET NULL,
    noticed boolean NOT NULL DEFAULT FALSE
);

