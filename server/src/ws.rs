use futures_util::{StreamExt, stream::SplitSink, SinkExt};
use log::{warn, debug, info};
use tokio_tungstenite::WebSocketStream;
use tokio::net::TcpStream;
use tokio_tungstenite::tungstenite::{Error as WsError, Message};
use serde::{Deserialize, Serialize};
use serde_json;
use tokio::sync::Mutex;
use uuid::Uuid;
use std::{sync::Arc, net::SocketAddr};

use crate::{user::User, room::{Room}, ROOMS, USER_COUNT};

pub type WsWriter = Arc<Mutex<SplitSink<WebSocketStream<TcpStream>, Message>>>;

pub trait WSSendable {
    fn to_msg(&self) -> Message;
}

pub async fn send_message(ws_sender: &WsWriter, message: impl WSSendable) {
    ws_sender.lock().await.send(message.to_msg()).await.ok();
}


#[derive(Serialize, Deserialize, Debug)]
#[serde(tag = "type")]
pub enum WsMsg {
    SetPlay{playing: bool},
    JoinRoom{room_id: String, username: String},
    CreateRoom{username: String},
    LeaveRoom,
    SetVideo{video_id: String},
    SetLeader{leader_id: String},
    SyncTime{time: f64},
    RoomData
}

impl WSSendable for WsMsg {
    fn to_msg(&self) -> Message {
        let str_data = serde_json::to_string(&self).unwrap();
        Message::Text(str_data)
    }
}

#[derive(Serialize, Debug)]
#[serde(tag = "type")]
pub enum ServerWsMsg<'a> {
    UserID {user_id: String},
    JoinRoom {success: bool, message: Option<String>},
    LeaveRoom,
    CreateRoom {success: bool, room_code: String},
    RoomData {room: &'a Room},
    NewUserConnected {user: (String, String)},
    UserLeft {user: String},
    SetLeader {success: bool},
    SetVideo {success: bool},
    NewLeader {leader_id: String},
    Sync {time: f64},
    SetPlay {playing: bool}
}
impl<'a> WSSendable for ServerWsMsg<'a> {
    fn to_msg(&self) -> Message {
        let str_data = serde_json::to_string(&self).unwrap();
        Message::Text(str_data)
    }
}

pub async fn add_user_to_count() {
    let mut lock = USER_COUNT.lock().await;
    let uc = *lock + 1;
    *lock = uc;
}

pub async fn remove_user_from_count() {
    let mut lock = USER_COUNT.lock().await;
    let uc = *lock - 1;
    *lock = uc;
}

pub async fn handle_connection(conn: TcpStream, addr: SocketAddr) -> Result<(), WsError> {
    debug!("New connection from {}", &addr.to_string());
    
    add_user_to_count().await;

    let ws_conn = tokio_tungstenite::accept_async(conn).await?;

    let (ws_sender, mut ws_reader) = ws_conn.split();
    let ws_sender = Arc::new(Mutex::new(ws_sender));

    let mut room_code = String::from("");
    let user_id = Uuid::new_v4().to_string();
    send_message(&ws_sender, ServerWsMsg::UserID { user_id: user_id.clone() }).await;
    debug!("Assinged user id {} to address {}", user_id, &addr.to_string());

    'main_loop: loop {
        let msg = ws_reader.next().await;
        if msg.is_none() {
            debug!("Recieved empty or close message from user {}. Closing connection.", user_id);
            break 'main_loop;
        }
        let data = msg.unwrap();
        if data.is_err() {
            warn!("Websocket data from user {} was erroneous. Disconnecting them.", user_id);
            break 'main_loop;
        }
        let msg = data.unwrap();
        if !msg.is_text() {
            debug!("Message from user {} was not text...", user_id);
            continue;
        }
        let data = msg.into_text().unwrap();
        let ws_msg = serde_json::from_str::<WsMsg>(data.as_str());
        if ws_msg.is_err() {
            warn!("User {} broke protocol. Disconnecting.", user_id);
            break 'main_loop;
        }

        let ws_msg = ws_msg.unwrap();
        debug!("Recieved message from user {}. Message: {:?}", user_id, ws_msg);
        match ws_msg {
            WsMsg::SetPlay { playing } => set_playing(&room_code, playing, &user_id).await,
            WsMsg::JoinRoom { room_id, username } => {
                if room_code != "" {
                    warn!("{} tried to join a room while already in a room", {&user_id});
                    continue;
                }
                let succ = join_room(&room_id, &user_id, &username, &ws_sender).await;
                if succ {
                    room_code = room_id;
                }
            },
            WsMsg::CreateRoom { username } => {
                if room_code != "" {
                    warn!("{} tried to create a room while already in a room", {&user_id});
                    continue;
                }
                let rc = create_room(&ws_sender, &user_id, username).await;
                room_code = rc
            },
            WsMsg::LeaveRoom => {
                leave_room(&room_code, &user_id).await;
                room_code = String::from("");
            },
            WsMsg::SetVideo { video_id } => set_video(&room_code, &video_id, &user_id, &ws_sender).await,
            WsMsg::SetLeader { leader_id } => set_leader(&room_code, &user_id, &leader_id).await,
            WsMsg::SyncTime { time } => sync_time(&room_code, time, &user_id).await,
            WsMsg::RoomData => get_room_data(&room_code, &user_id, &ws_sender).await,
        }
    }

    if room_code != "" {
        debug!("User {} is disconnecting but still in room. Leaving the room.", user_id);
        leave_room(&room_code, &user_id).await;
    }

    debug!("Closing connection for address {}", addr.to_string());
    remove_user_from_count().await;
    Ok(())
}


async fn create_room(ws_sender: &WsWriter, user_id: &String, name: String)  -> String  {
    let un = name.clone();
    debug!("User {} is creating a new room with the username {}...", user_id, &un);
    let room = Room::new(User { name, conn: ws_sender.clone() }, user_id);
    let code = room.code.clone();
    info!("New room created by {} with code {}", un, code);
    ROOMS.lock().await.insert(code.clone(), room);
    send_message(ws_sender, ServerWsMsg::CreateRoom { success: true, room_code: code.clone() }).await;

    code
}

async fn leave_room(room_id: &String, user_id: &String) {
    debug!("User {} is leaving the room {}", user_id, room_id);
    let mut rooms = ROOMS.lock().await;
    let room = rooms.get_mut(room_id);
    if room.is_none() {
        warn!("Room with ID {} not found", room_id);
        return ;
    }
    let room = room.unwrap();
    room.remove_user(user_id).await;
    let roomcode = room.code.clone();
    if room.user_count() == 0 {
        // Delete empty room
        info!("Room {} is now empty. Removing it.", room_id);
        drop(room);
        rooms.remove(&roomcode);
        info!("Empty room removed.");
        return;
    }
    
}

async fn join_room(room_id: &String, user_id: &String, username: &String, ws_sender: &WsWriter) -> bool {
    debug!("User {} is trying to join room {} with username: {}", user_id, room_id, username);
    let mut rooms = ROOMS.lock().await;
    let room = rooms.get_mut(room_id);
    if room.is_none() {
        debug!("Room with code {} does not exist to join.", room_id);
        send_message(ws_sender, ServerWsMsg::JoinRoom { success: false, message: Some(String::from("Room not found")) }).await;
        return false;
    }

    let user = User{
        conn: ws_sender.clone(),
        name: username.clone()
    };

    let room = room.unwrap();
    room.add_user(user_id, user).await;
    info!("User {} joined room {}", username, room_id);
    true
}

async fn get_room_data(room_code: &String, user_id: &String, ws_sender: &WsWriter) {
    debug!("{} has requested the room data for {}", user_id, room_code);
    let rooms = ROOMS.lock().await;
    let room = rooms.get(room_code);
    if room.is_none() {
        warn!("Room with code {} does not exist.", room_code);
        return;
    }
    let room = room.unwrap();
    send_message(ws_sender, ServerWsMsg::RoomData { room: room }).await;
}

async fn sync_time(room_id: &String, time: f64, user_id: &String) {
    debug!("{} has sent a sync message.", user_id);
    let mut rooms = ROOMS.lock().await;
    let room = rooms.get_mut(room_id);
    if room.is_none() {
        warn!("Room with code {} does not exist.", room_id);
        return;
    }
    let room = room.unwrap();
    if !room.is_leader(user_id) {
        warn!("User {} is not leader and sent a sync event.", user_id);
        return;
    }
    room.sync_time(time).await;
}


async fn set_playing(room_id: &String, playing: bool, user_id: &String) {
    debug!("{} has requested to change playing to {}.", user_id, playing);
    let mut rooms = ROOMS.lock().await;
    let room = rooms.get_mut(room_id);
    if room.is_none() {
        warn!("Room with code {} does not exist.", room_id);
        return;
    }
    let room = room.unwrap();
    room.set_play(playing).await;
}

async fn set_video(room_id: &String, video_id: &String, user_id: &String, ws_sender: &WsWriter) {
    debug!("{} is trying to change the video in room {}", user_id, room_id);
    let mut rooms = ROOMS.lock().await;
    let room = rooms.get_mut(room_id);
    if room.is_none() {
        warn!("Room with code {} does not exist.", room_id);
        return;
    }
    let room = room.unwrap();
    if !room.is_leader(user_id) {
        warn!("{} is not leader and therefore cannot change the video.", user_id);
        send_message(ws_sender, ServerWsMsg::SetVideo { success: false }).await;
        return;
    }
    room.set_video(video_id).await;
    send_message(ws_sender, ServerWsMsg::SetVideo { success: true }).await;

}

async fn set_leader(room_id: &String, user_id: &String, new_leader_id: &String) {
    debug!("{} is trying to change the leader in room {}", user_id, room_id);
    let mut rooms = ROOMS.lock().await;
    let room = rooms.get_mut(room_id);
    if room.is_none() {
        warn!("Room with code {} does not exist.", room_id);
        return;
    }
    let room = room.unwrap();

    if !room.is_leader(user_id) {
        warn!("{} is not the leader and cannot change the leader.", user_id);
        return;
    }

    room.set_leader(new_leader_id).await;
}