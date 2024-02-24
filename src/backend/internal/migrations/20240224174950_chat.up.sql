CREATE TABLE rooms(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(255),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now() ON UPDATE now(),
    deleted_at timestamptz
);

CREATE TABLE user_room_lookup(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    room_id uuid REFERENCES rooms(id) ON UPDATE CASCADE ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now() ON UPDATE now(),
    deleted_at timestamptz,
    INDEX user_room_idx(user_id, room_id),
    CONSTRAINT uq_user_id_room_id UNIQUE (user_id, room_id)
);

CREATE TABLE conversations(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    text varchar(2000) NOT NULL,
    user_id uuid REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    room_id uuid REFERENCES rooms(id) ON UPDATE CASCADE ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now() ON UPDATE now(),
    deleted_at timestamptz,
    INDEX room_id_idx(room_id)
);

