use futures_util::{StreamExt, stream::SplitSink, SinkExt};
use tokio_tungstenite::WebSocketStream;
use tokio::net::TcpStream;
use tokio_tungstenite::tungstenite::{Error as WsError, Message};
use serde::{Deserialize, Serialize};
use serde_json;
use tokio::sync::Mutex;
use uuid::Uuid;
use std::sync::Arc;

use crate::{user::User, room::Room, ROOMS};

pub type WsWriter = Arc<Mutex<SplitSink<WebSocketStream<TcpStream>, Message>>>;

#[derive(Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum WsMsg {
    SetPlay{playing: bool},
    JoinRoom{room_id: String, username: String},
    CreateRoom{username: String},
    LeaveRoom,
    SetVideo{video_id: String},
    SetLeader{leader_id: String},
    SyncTime{time: f64}
}

impl WsMsg {
    pub fn to_msg(&self) -> Message {
        let str_data = serde_json::to_string(&self).unwrap();
        Message::Text(str_data)
    }
}

#[derive(Serialize)]
#[serde(tag = "type")]
pub enum ServerWsMsg<'a> {
    JoinRoom {success: bool, message: Option<String>},
    LeaveRoom,
    CreateRoom {success: bool, room_code: String},
    RoomData {room: &'a Room},
    NewUserConnected {user: (String, String)},
    UserLeft {user: String}
}
impl<'a> ServerWsMsg<'a> {
    pub fn to_msg(&self) -> Message {
        let str_data = serde_json::to_string(&self).unwrap();
        Message::Text(str_data)
    }
}

pub async fn handle_connection(conn: TcpStream) -> Result<(), WsError> {
    let ws_conn = tokio_tungstenite::accept_async(conn).await?;

    let (ws_sender, mut ws_reader) = ws_conn.split();
    let ws_sender = Arc::new(Mutex::new(ws_sender));

    let mut room_code = String::from("");
    let user_id = Uuid::new_v4().to_string();
    'main_loop: loop {
        let msg = ws_reader.next().await;
        if msg.is_none() {
            break 'main_loop;
        }
        let data = msg.unwrap();
        if data.is_err() {
            break 'main_loop;
        }
        let msg = data.unwrap();
        if !msg.is_text() {
            continue;
        }
        let data = msg.into_text().unwrap();
        let ws_msg = serde_json::from_str::<WsMsg>(data.as_str());
        if ws_msg.is_err() {
            break 'main_loop;
        }

        let ws_msg = ws_msg.unwrap();

        match ws_msg {
            WsMsg::SetPlay { playing } => todo!(),
            WsMsg::JoinRoom { room_id, username } => {
                let succ = join_room(&room_id, &user_id, &username, &ws_sender).await;
                if succ {
                    room_code = room_id;
                }
            },
            WsMsg::CreateRoom { username } => {
                let rc = create_room(&ws_sender, &user_id, username).await;
                room_code = rc
            },
            WsMsg::LeaveRoom => {
                leave_room(&room_code, &user_id).await;
                room_code = String::from("");
            },
            WsMsg::SetVideo { video_id } => todo!(),
            WsMsg::SetLeader { leader_id } => todo!(),
            WsMsg::SyncTime { time } => todo!(),
        }
    }

    async fn create_room(ws_sender: &WsWriter, user_id: &String, name: String)  -> String  {
        let room = Room::new(User { name, conn: ws_sender.clone() }, user_id);
        let code = room.code.clone();
        ROOMS.lock().await.insert(code.clone(), room);
        ws_sender.lock().await.send(ServerWsMsg::CreateRoom { success: true, room_code: code.clone() }.to_msg()).await.ok();
        code
    }

    async fn leave_room(room_id: &String, user_id: &String, ) {
        let mut rooms = ROOMS.lock().await;
        let room = rooms.get_mut(room_id);
        if room.is_none() {
            return ;
        }
        let room = room.unwrap();
        room.remove_user(user_id).await;
        let roomcode = room.code.clone();
        if room.user_count() == 0 {
            // Delete empty room
            drop(room);
            rooms.remove(&roomcode);
            return;
        }
        
    }

    async fn join_room(room_id: &String, user_id: &String, username: &String, ws_sender: &WsWriter) -> bool {
        let mut rooms = ROOMS.lock().await;
        let room = rooms.get_mut(room_id);
        if room.is_none() {
            ws_sender.lock().await.send(ServerWsMsg::JoinRoom { success: false, message: Some(String::from("Room not found")) }.to_msg()).await.ok();
            return false;
        }

        let user = User{
            conn: ws_sender.clone(),
            name: username.clone()
        };

        let room = room.unwrap();
        room.add_user(user_id, user).await;
        true
    }

    async fn set_video() {

    }

    Ok(())
}