/*
    Initial database structure. Using PostgreSQL
        [User Data]
            accounts
            friends
            games
            game_players
*/

-------------------------------- Database Setup --------------------------------

CREATE DATABASE rpg;

CREATE ROLE rpg WITH LOGIN PASSWORD 'fake-fire-emblem';

REVOKE CONNECT ON DATABASE rpg FROM PUBLIC;
GRANT ALL PRIVILEGES ON DATABASE rpg TO rpg;

\c rpg;
SET ROLE rpg;

---------------------------------- User Data -----------------------------------

-- Personal data not used in game
CREATE TABLE accounts (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(512) UNIQUE NOT NULL,
    password VARCHAR(512) NOT NULL,
    salt VARCHAR(512) NOT NULL,
    email VARCHAR(512) UNIQUE NOT NULL,
    join_date TIMESTAMP NOT NULL DEFAULT (NOW()::TIMESTAMP),
    active_date TIMESTAMP
);
CREATE INDEX accounts_user_index ON accounts (user_id);
CREATE INDEX accounts_username_index ON accounts (username);

-- Connect friends to be notified of their online status
CREATE TABLE friends (
    user_a INT NOT NULL REFERENCES accounts (user_id) ON DELETE CASCADE,
    user_b INT NOT NULL REFERENCES accounts (user_id) ON DELETE CASCADE,
    CONSTRAINT cannot_befriend_yourself CHECK (user_a <> user_b) -- No self-friending
);
CREATE INDEX friends_user_a_index ON friends (user_a);
CREATE INDEX friends_user_b_index ON friends (user_b);

-- Game data
CREATE TABLE games (
    game_id SERIAL PRIMARY KEY,
    game_data JSON NOT NULL
);
CREATE INDEX games_user_index ON games (game_id);

-- Link accounts to games
CREATE TABLE game_players (
    user_a INT NOT NULL REFERENCES accounts (user_id) ON DELETE CASCADE,
    user_b INT NOT NULL REFERENCES accounts (user_id) ON DELETE CASCADE,
    game_id INT UNIQUE NOT NULL REFERENCES games (game_id) ON DELETE CASCADE,
    CONSTRAINT cannot_play_against_yourself CHECK (user_a <> user_b) -- No playing against yourself
);
CREATE INDEX game_player_user_a_index ON friends (user_a);
CREATE INDEX game_player_user_b_index ON friends (user_b);