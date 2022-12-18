use std::collections::HashMap;

use futures_util::SinkExt;

use crate::{ws::{WsMsg, WsWriter}, user::User};

fn create_room_code() -> String {
    todo!();
}

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

    pub async fn broadcast(&self, message: WsMsg) {
        for (id, ws_sender) in &self.users {
            let mut conn = ws_sender.conn.lock().await;
            conn.send(message.to_msg()).await.ok();
        }
    }

    pub async fn add_user(&mut self, user_id: &String, ws_sender: User) {
        self.users.insert(user_id.clone(), ws_sender);
        // self.broadcast()
    }

    pub async fn remove_user(&mut self,user_id: &String) {
        self.users.remove(user_id);
    }

    pub fn user_count(&self) -> usize {
        self.users.len()
    }
}