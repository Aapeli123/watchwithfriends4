# Watchwithfriends Server

The server is responsible for handling websocket connections and managing rooms (for example: the amount of users in a room, is the video playing and what video is playing).

This is my first proper rust project of this scale, so the code might be a bit unclean and not follow proper conventions.

## Docs:

Details of the API are found in the /docs folder

## Files:

- main.rs is the main file and starts the server and stat printing thread
- room.rs contains the defination for the room, the room holds users and forwards relevant websocket events for them.
- ws.rs contains the websocket handler that relays the recieved messages to the users room. It also gives the users ID:s and handles state relevant to the user. All different websocket messages are also defined here.
- user.rs is a defination for the very simple User object, which contains a connection and a username. The object represents an user of a room and not an user of the server.
- stats.rs has the stat logging function. The function logs the amount of rooms and the amount of users online every 30 seconds.

## Building

I think that `cargo build` should be enough. For a release build: `cargo build --release`

### Installing:

To install the server as a systemd daemon, run `make install` as root.
The makefile creates the systemd service file and copies it to `/etc/systemd/system`, After this it reloads daemons and starts the server.

To see the server status use `systemctl status watchwithfriends.service`. For logs `journalctl -u watchwithfriends`

## Logging

Logging is done with `log` and `simple-logger` crates.
