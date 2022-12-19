use std::collections::HashMap;

use futures_util::SinkExt;
use log::info;
use serde::{Serialize};
use rand::Rng;

use crate::{ws::ServerWsMsg, user::User};

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

#[derive(Serialize)]
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
        for (_, ws_sender) in &self.users {
            let mut conn = ws_sender.conn.lock().await;
            conn.send(message.to_msg()).await.ok();
        }
    }

    pub async fn add_user(&mut self, user_id: &String, user: User) {
        let un = user.name.clone();
        self.broadcast(ServerWsMsg::NewUserConnected { user: (user_id.clone(), un) }).await;
        let c = user.conn.clone();
        self.users.insert(user_id.clone(), user);
        c.lock().await.send(ServerWsMsg::RoomData { room: self }.to_msg()).await.ok();
    }

    pub async fn remove_user(&mut self,user_id: &String) {
        let u = self.users.remove(user_id);
        let u = u.unwrap();
        info!("Removed user {} from room {}", u.name, self.code);
        u.conn.lock().await.send(ServerWsMsg::LeaveRoom.to_msg()).await.ok();

        self.broadcast(ServerWsMsg::UserLeft { user: user_id.clone() }).await;
        if user_id.clone() == self.leader_id && self.user_count() != 0{
            let new_leader = self.users.keys().next().unwrap().clone();
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