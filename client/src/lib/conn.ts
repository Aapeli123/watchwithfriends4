import { parseMessage, Response, Sendable } from "./messages";

export class ServerConn {
    readonly user_id: string
    private socket: WebSocket

    constructor(user_id: string, conn: WebSocket) {
        this.user_id = user_id;
        this.socket = conn;
    }

    createRoom(username: string): Promise<Response.CreateRoomResp> {
        return new Promise((res, rej) => {
            this.socket.onmessage = (event) => {
                const msg = parseMessage(event.data).message as Response.CreateRoomResp;
                if(msg.success) {
                    rej(msg.message);
                    return;
                }
                res(msg);
            }
            this.sendMessage({username: username}, Sendable.WsMsgType.CreateRoom);
        })
    }

    joinRoom(room_id: string, username: string): Promise<Response.JoinRoomResp> {
        return new Promise((res, rej) => {
            // TODO
            this.sendMessage({username: username, room_id: room_id}, Sendable.WsMsgType.JoinRoom);
        });
    }

    leaveRoom(): Promise<Response.LeaveRoomResp> {
        return new Promise((res, rej) => {
            // TODO
            this.sendMessage({}, Sendable.WsMsgType.LeaveRoom);
        });
    }

    roomData(): Promise<Response.RoomDataResp> {
        return new Promise((res, rej) => {
            // TODO
            this.sendMessage({}, Sendable.WsMsgType.RoomData);
        });
    }

    makeLeader(new_leader: string): Promise<Response.SetLeaderResp> {
        return new Promise((res, rej) => {
            // TODO
            this.sendMessage({leader_id: new_leader}, Sendable.WsMsgType.SetLeader);
        });
    }

    setVideo(video_id: string): Promise<Response.SetVideoResp> {
        return new Promise((res, rej) => {
            // TODO
            this.sendMessage({video_id: video_id}, Sendable.WsMsgType.SetVideo);
        });
    }

    syncTime(time: number) {
        this.sendMessage({time: time}, Sendable.WsMsgType.SyncTime);
    }

    setPlay(playing: boolean) {
        this.sendMessage({playing: playing}, Sendable.WsMsgType.SetPlay);
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