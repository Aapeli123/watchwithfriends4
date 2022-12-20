export enum MessageType {
    UserID = "UserID",
    JoinRoom = "JoinRoom",
    LeaveRoom = "LeaveRoom",
    CreateRoom = "CreateRoom",
    RoomData = "RoomData",
    NewUserConnected = "NewUserConnected",
    UserLeft = "UserLeft",
    SetLeader = "SetLeader",
    SetVideo = "SetVideo",
    NewLeader = "NewLeader",
    Sync = "Sync",
    SetPlay = "SetPlay"
}

export interface WsMessage {
    type: MessageType,
    message: WsMessageBody
}

export type WsMessageBody = UserIdMsg | JoinRoomMsg | LeaveRoomMsg | CreateRoomMsg | RoomDataMsg | NewUserConnectedMsg | UserLeftMsg | SetLeaderMsg | SetVideoMsg | NewLeaderMsg | SyncMsg | SetPlayMsg

export interface SrvrRoom { // Stands for ServerRoom to avoid confusion between this and the Room.tsx file export Room
    code: string,
    users: Map<string, string>,
    video_id: string | null,
    time: number,
    playing: boolean,
    leader_id: string
}

export interface UserIdMsg {
    user_id: string
};
export interface JoinRoomMsg  {
    success: boolean
    message: string | null
};
export interface LeaveRoomMsg {};
export interface CreateRoomMsg {
    success: boolean
    message: string | null
}
export interface RoomDataMsg {
    room: SrvrRoom
}

export interface NewUserConnectedMsg {
    user: [string, string]
}

export interface UserLeftMsg {
    user: string
}

export interface SetLeaderMsg {
    success: boolean
}

export interface SetVideoMsg {
    success: boolean
}

export interface NewLeaderMsg {
    leader_id: string
}

export interface SyncMsg {
    time: number
}

export interface SetPlayMsg {
    playing: boolean
}


export const parseMessage = (message: string): WsMessage => {
    let data = JSON.parse(message);
    let type = data.type as MessageType;
    return {type: type, message: data as WsMessageBody};
}