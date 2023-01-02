# Usage

All of the messages use JSON

For an example of a typescript client class see [client/src/lib/conn.ts](../../client/src/lib/conn.ts)

## Connecting:

_Create a new websocket connection to the servers endpoint_

For example in javascript:

```js
const ws = new WebSocket("ws://server address:8080");
```

_Server sends your user id through the websocket._

Example websocket message:

```json
{
  "type": "UserID",
  "user_id": "an uuid v4"
}
```

_You probably want to store the user id in a variable._

## Creating / joining room

_With Watchwithfriends 4 you don't have an username that's tied to the websocket connection. Instead you join and create rooms with a specific username, which will be your username in the room._

For example if you wanted to create a room with the username `example` you would send the following through the websocket:

```json
{
  "type": "CreateRoom",
  "username": "example"
}
```

_This would create a new room, and connect you to it. You will now recieve events from the room. The creator of the room is also the leader by default._

The response would look something like this:

```json
{ "type": "CreateRoom", "success": true, "room_code": "188626" }
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
{ "type": "JoinRoom", "success": true, "message": null }
```

## Leaving a room

_To leave a room you should send the LeaveRoom message through the websocket_

```json
{ "type": "LeaveRoom" }
```

The response is an acknowledgement of you leaving:

```json
{ "type": "LeaveRoom" }
```

## Getting room data:

_To get the entire room object from server, send the RoomData message_

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

_The leader of the room is expected to send sync messages containing current video time_

```json
{ "type": "Sync", "time": 2 }
```

The server relays these to all in the same room as the leader.

_Playing and pausing the video can be done by all users in the room. They need to send a SetPlay message to the server and the server will relay it to all users in the room_

```json
{ "type": "SetPlay", "playing": true }
```

## Other events

_You may also recieve messages from the server telling you that something has changed in the room._

For example when the leader changes:

```json
{ "type": "NewLeader", "leader_id": "53bf6eb1-14e9-4ea2-a880-40ef74f21af3" }
```

or when someone joins or disconnects:

```json
{
  "type": "NewUserConnected",
  "user": ["53bf6eb1-14e9-4ea2-a880-40ef74f21af3", "test"]
}
```

```json
{ "type": "UserLeft", "user": "5998e1ee-68ac-4ca1-af26-5bf559a3f2d6" }
```

### List of event types that can be sent by server without user request:

- NewUserConnected
- UserLeft
- NewLeader
- Sync
- SetPlay
- UserChangedName
- NewVideo

See [client/src/lib/messages.ts](../../client/src/lib/messages.ts) for an example implementation of message types in typescript.
