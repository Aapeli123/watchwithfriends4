import { parseMessage, Response, Sendable } from "./messages";

export class ServerConn {
    readonly user_id: string
    private socket: WebSocket

    constructor(user_id: string, conn: WebSocket) {
        this.user_id = user_id;
        this.socket = conn;
    }

    createRoom(username: string) {
        this.sendMessage({username: username}, Sendable.WsMsgType.CreateRoom);
    }

    joinRoom(room_id: string, username: string) {
        this.sendMessage({username: username, room_id: room_id}, Sendable.WsMsgType.JoinRoom);
    }

    leaveRoom() {
        this.sendMessage({}, Sendable.WsMsgType.LeaveRoom);
    }

    roomData() {
        this.sendMessage({}, Sendable.WsMsgType.RoomData);
    }

    makeLeader(new_leader: string) {
        this.sendMessage({leader_id: new_leader}, Sendable.WsMsgType.SetLeader);
    }

    syncTime(time: number) {
        this.sendMessage({time: time}, Sendable.WsMsgType.SyncTime);
    }

    setPlay(playing: boolean) {
        this.sendMessage({playing: playing}, Sendable.WsMsgType.SetPlay)
    }

    addMessageCallback(callback: (msg: Response.WsResponse) => any) {
        this.socket.addEventListener("message", (event) => {
            let data = JSON.parse(event.data) as Response.WsResponse;
            callback(data);
        });
    }

    private sendMessage(message: Sendable.WsMsgBody, type: Sendable.WsMsgType) {
        let msg = {
            ...message,
            type: type
        }

        let msg_string = JSON.stringify(msg);
        this.socket.send(msg_string);
    }

}

const connect = (server_url: string): Promise<ServerConn> => {
    return new Promise<ServerConn>((res, rej) => {
        const ws = new WebSocket(server_url);
        const errorEventListner = (event: Event): any => {
            // Clean event listeners from websocket
            ws.removeEventListener("error",errorEventListner);
            ws.removeEventListener("message",messageEventListner);

            rej("Could not connect...");
        }
        const messageEventListner = (event: MessageEvent<string>): any => {
            // Clean event listeners from websocket
            ws.removeEventListener("error",errorEventListner);
            ws.removeEventListener("message",messageEventListner);

            const msg = parseMessage(event.data).message as Response.UserIdResp;
            console.log(msg);

            res(new ServerConn(msg.user_id, ws));
        }
        ws.addEventListener("error",errorEventListner);
        ws.addEventListener("message",messageEventListner);

    })
}

export default connect;