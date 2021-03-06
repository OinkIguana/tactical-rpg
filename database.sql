/*
    Initial database structure. Using PostgreSQL
        [User Data]
            accounts
            friends
            games
            game_players
*/

-- Reset
DROP DATABASE rpg;
DROP ROLE rpg;

-------------------------------- Database Setup --------------------------------

CREATE DATABASE rpg;

CREATE ROLE rpg WITH LOGIN PASSWORD 'fake-fire-emblem';

REVOKE CONNECT ON DATABASE rpg FROM PUBLIC;
GRANT ALL PRIVILEGES ON DATABASE rpg TO rpg;

\c rpg;
SET ROLE rpg;

------------------------------- Helper Functions -------------------------------

-- CREATE FUNCTION random_string(INTEGER) RETURNS TEXT LANGUAGE SQL AS $$
--     SELECT upper(
--         substring(
--             (SELECT string_agg(md5(random()::TEXT), '')
--                 FROM generate_series(1, CEIL($1 / 32.)::INTEGER)), $1));
-- $$;

CREATE OR REPLACE FUNCTION raise_exception(text)
    RETURNS VOID
    LANGUAGE PLPGSQL
    AS $$
    BEGIN
      RAISE EXCEPTION '%', $1;
    END;
$$;

---------------------------------- User Data -----------------------------------


-- Personal data not used in game
CREATE TABLE accounts (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(512) UNIQUE NOT NULL,
    password VARCHAR(512) NOT NULL,
    salt VARCHAR(512) NOT NULL,
    validation_key VARCHAR(512),
    email VARCHAR(512) UNIQUE NOT NULL,
    join_date TIMESTAMP NOT NULL DEFAULT (NOW()::TIMESTAMP),
    active_date TIMESTAMP
);
CREATE INDEX accounts_user_index ON accounts (user_id);
CREATE INDEX accounts_username_index ON accounts (username);

-- Testing account 1
INSERT INTO accounts
    (username, password, salt, email) VALUES
    (':)', 'e56a9225cf72f3f038d95101daab71254d81a35e811043884daae7326aa15ae132bbd16ab68bb3c8e09d71c6f49aa259e9117d8bde800a15e9071617425865e3',
     'salty', 'a@b.c');
-- Testing account 2
INSERT INTO accounts
    (username, password, salt, email) VALUES
    (':|', 'e56a9225cf72f3f038d95101daab71254d81a35e811043884daae7326aa15ae132bbd16ab68bb3c8e09d71c6f49aa259e9117d8bde800a15e9071617425865e3',
     'salty', 'e@f.g');
-- Testing account 3
INSERT INTO accounts
    (username, password, salt, email) VALUES
    (':/', 'e56a9225cf72f3f038d95101daab71254d81a35e811043884daae7326aa15ae132bbd16ab68bb3c8e09d71c6f49aa259e9117d8bde800a15e9071617425865e3',
     'salty', 'h@i.j');

-- Connect friends to be notified of their online status
CREATE TABLE friends (
    user_a INT NOT NULL REFERENCES accounts (user_id) ON DELETE CASCADE,
    user_b INT NOT NULL REFERENCES accounts (user_id) ON DELETE CASCADE,
    request_confirmed BOOLEAN NOT NULL DEFAULT (FALSE),
    CONSTRAINT cannot_befriend_yourself CHECK (user_a <> user_b) -- No self-friending
);
CREATE INDEX friends_user_a_index ON friends (request_confirmed, user_a, user_b);
CREATE INDEX friends_user_b_index ON friends (request_confirmed, user_b, user_a);
CREATE UNIQUE INDEX friends_only_once ON friends (LEAST(user_a, user_b), GREATEST(user_a, user_b));

-- Game data
CREATE TABLE games (
    game_id SERIAL PRIMARY KEY,
    finished BOOLEAN NOT NULL DEFAULT (FALSE),
    game_data JSON NOT NULL
);
CREATE INDEX games_game_index ON games (game_id);

-- Link accounts to games
CREATE TABLE game_players (
    user_a INT NOT NULL REFERENCES accounts (user_id) ON DELETE CASCADE,
    user_b INT NOT NULL REFERENCES accounts (user_id) ON DELETE CASCADE,
    game_id INT UNIQUE NOT NULL REFERENCES games (game_id) ON DELETE CASCADE,
    request_confirmed BOOLEAN NOT NULL DEFAULT (FALSE),
    CONSTRAINT cannot_play_against_yourself CHECK (user_a <> user_b) -- No playing against yourself
);
CREATE INDEX game_player_user_a_index ON game_players (request_confirmed, user_a, user_b);
CREATE INDEX game_player_user_b_index ON game_players (request_confirmed, user_b, user_a);