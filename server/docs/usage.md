# Usage
All of the messages use JSON
## Connecting:
*Create a new websocket connection to the servers endpoint*

For example in javascript:
```js
const ws = new WebSocket("ws://server address:8080")
```
*Server sends your user id through the websocket.*

Example websocket message:
```json
{
    "type": "UserID",
    "user_id": "an uuid v4"
}
```
*You probably want to store the user id in a variable.*

## Creating / joining room
*With Watchwithfriends 4 you don't have an username that's tied to the websocket connection. Instead you join and create rooms with a specific username, which will be your username in the room.*

For example if you wanted to create a room with the username `example` you would send the following through the websocket:
```json
{
    "type": "CreateRoom",
    "username": "example"
}
```
*This would create a new room, and connect you to it. You will now recieve events from the room. The creator of the room is also the leader by default.*

The response would look something like this:

```json
{"type":"CreateRoom","success":true,"room_code":"188626"}
```

Joining the room is very similiar:
```json
{
    "type": "JoinRoom",
    "username": "example",
    "room_id": "188626"
}
```
And the response:
```json
{"type":"JoinRoom","success":true,"message":null}
```
## Leaving a room
*To leave a room you should send the LeaveRoom message through the websocket*
```json
{"type":"LeaveRoom"}
```
The response is an aknowledgement of you leaving:
```json
{"type":"LeaveRoom"}
```

## Getting room data:
*To get the entire room object from server, send the RoomData message*
```json
{
    "type": "RoomData"
}
```
Example response:
```json
{
  "type": "RoomData",
  "room": {
    "code": "342238",
    "users": {
      "5998e1ee-68ac-4ca1-af26-5bf559a3f2d6": {
        "name": "example"
      }
    },
    "video_id": null,
    "time": 0,
    "playing": false,
    "leader_id": "5998e1ee-68ac-4ca1-af26-5bf559a3f2d6"
  }
}
```

## Syncing time / Playing and pausing
*The leader of the room is expected to send sync messages containing current video time*
```json
{"type": "Sync", "time": 2}
```
The server relays these to all in the same room as the leader.

*Playing and pausing the video can be done by all users in the room. They need to send a SetPlay message to the server and the server will relay it to all users in the room*

```json
{"type": "SetPlay", "playing": true}
```

## Other events
*You may also recieve messages from the server telling you that something has changed in the room.*

For example when the leader changes:
```json
{"type":"NewLeader","leader_id":"53bf6eb1-14e9-4ea2-a880-40ef74f21af3"}
```
or when someone joins or disconnects:
```json
// Here an user called test joined the room
{"type":"NewUserConnected","user":["53bf6eb1-14e9-4ea2-a880-40ef74f21af3","test"]}
```
```json
// Here the same user left
{"type":"UserLeft","user":"5998e1ee-68ac-4ca1-af26-5bf559a3f2d6"}
```