use std::collections::HashMap;

use futures_util::SinkExt;
use log::{info, trace, debug};
use serde::{Serialize};
use rand::Rng;

use crate::{ws::{ServerWsMsg, WSSendable, send_message}, user::User};

fn create_room_code() -> String {
    const CHARSET: &[u8] = b"0123456789";
    const ROOMCODE_LEN: usize = 6;
    let mut rng = rand::thread_rng();

    let roomcode: String = (0..ROOMCODE_LEN)
        .map(|_| {
            let idx = rng.gen_range(0..CHARSET.len());
            CHARSET[idx] as char
        })
        .collect();
    roomcode
}

#[derive(Serialize, Debug)]
pub struct Room {
    pub code: String,
    users: HashMap<String, User>,
    video_id: Option<String>,
    time: f64,
    playing: bool,
    leader_id: String
}

impl Room {
    pub fn new(creator: User, user_id: &String) -> Room {
        let creator_id = user_id.clone();
        let mut users = HashMap::new();
        users.insert(creator_id.clone(), creator);
        Room{
            users,
            code: create_room_code(),
            video_id: None,
            time: 0f64,
            playing: false,
            leader_id: creator_id
        }
    }

    pub async fn broadcast<'a>(&self, message: ServerWsMsg<'a>) {
        trace!("Broadcasting {:?} to all users in room {}", message, self.code);
        for (id, user) in &self.users {
            trace!("Broadcasting the message to {}({})", id,user.name);
            let mut conn = user.conn.lock().await;
            conn.send(message.to_msg()).await.ok();
        }
    }

    pub async fn add_user(&mut self, user_id: &String, user: User) {
        send_message(&user.conn, ServerWsMsg::JoinRoom { success: true, message: None }).await;
        let un = user.name.clone();
        self.broadcast(ServerWsMsg::NewUserConnected { user: (user_id.clone(), un) }).await;
        debug!("Broadcasting user connection to all room users...");
        let c = user.conn.clone();
        self.users.insert(user_id.clone(), user);
        debug!("Added new user({}) to room {}. Room has now {} members.", user_id, self.code, self.user_count());
        send_message(&c, ServerWsMsg::RoomData { room: self }).await;
    }

    pub async fn remove_user(&mut self,user_id: &String) {
        let u = self.users.remove(user_id);
        let u = u.unwrap();
        info!("Removed user {} from room {}", u.name, self.code);
        send_message(&u.conn, ServerWsMsg::LeaveRoom).await;
        self.broadcast(ServerWsMsg::UserLeft { user: user_id.clone() }).await;
        if user_id.clone() == self.leader_id && self.user_count() != 0 {
            debug!("User was leader of the room and the room still exists, getting new leader.");
            let new_leader = self.users.keys().next().unwrap().clone();
            let new_leader_name = self.users[&new_leader].name.clone();
            info!("Room {} leader is now {}.", self.code, new_leader_name);
            debug!("New leader id: {}", new_leader);
            self.leader_id = new_leader;
        }
    }

    pub async fn sync_time() {
        todo!()
    }

    pub fn user_count(&self) -> usize {
        self.users.len()
    }
}