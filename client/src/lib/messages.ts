export namespace Response {
    export type WsResponseBody = UserIdResp | JoinRoomResp | LeaveRoomResp | CreateRoomResp | RoomDataResp 
    | NewUserConnectedResp | UserLeft | SetLeaderResp | SetVideoResp | NewLeader | Sync | SetPlay

    export interface UserIdResp {user_id: string};
    export interface JoinRoomResp  {success: boolean, message: string | null};
    export interface LeaveRoomResp {};
    export interface CreateRoomResp {success: boolean, room_code: string}
    export interface RoomDataResp {room: SrvrRoom}
    export interface NewUserConnectedResp {user: [string, string]}
    export interface SetLeaderResp {success: boolean}
    export interface SetVideoResp {success: boolean}
    export interface UserLeft {user: string}
    export interface NewLeader {leader_id: string}
    export interface Sync {time: number}
    export interface SetPlay {playing: boolean}
    export interface NewVideo {video_id: string}
    
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
        SetPlay = "SetPlay",
        NewVideo = "NewVideo"
    }
    export interface WsResponse {
        type: MessageType,
        message: WsResponseBody
    }


    export interface SrvrRoom { // Stands for ServerRoom to avoid confusion between this and the Room.tsx file export Room
        code: string,
        users: {[key: string]: {name: string}},
        video_id: string | null,
        time: number,
        playing: boolean,
        leader_id: string
    }
}

export const parseMessage = (message: string): Response.WsResponse => {
    let data = JSON.parse(message);
    let type = data.type as Response.MessageType;
    return {type: type, message: data as Response.WsResponseBody};
}


export namespace Sendable {
    export type WsMsgBody = SetPlay | JoinRoom | CreateRoom | LeaveRoom | SetVideo | SetLeader | SyncTime | RoomData; 
    export interface SetPlay{playing: boolean}
    export interface JoinRoom{room_id: string, username: string}
    export interface CreateRoom{username: string}
    export interface LeaveRoom{}
    export interface SetVideo{video_id: string}
    export interface SetLeader{leader_id: string}
    export interface SyncTime{time: number}
    export interface RoomData{}

    export enum WsMsgType{
        SetPlay = "SetPlay",
        JoinRoom = "JoinRoom",
        CreateRoom = "CreateRoom",
        LeaveRoom = "LeaveRoom",
        SetVideo = "SetVideo",
        SetLeader = "SetLeader",
        SyncTime = "SyncTime",
        RoomData = "RoomData",
    }
}
