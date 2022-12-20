import { parseMessage, UserIdMsg, WsMessage } from "./messages";

interface ServerConn {
    user_id: string,
    socket: WebSocket
}

const connect = (server_url: string): Promise<ServerConn> => {
    return new Promise<ServerConn>((res, rej) => {
        const ws = new WebSocket(server_url);
        const errorEventListner = (event: Event): any => {
            rej("Could not connect...");
        }
        const messageEventListner = (event: MessageEvent<string>): any => {
            const msg = parseMessage(event.data).message as UserIdMsg;
            console.log(msg);
            res({
                socket: ws,
                user_id: msg.user_id as string
            });
        }
        ws.addEventListener("error",errorEventListner);
        ws.addEventListener("message",messageEventListner);

    })
}

export default connect;