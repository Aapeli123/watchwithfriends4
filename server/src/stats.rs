use std::time::Duration;

use log::debug;

use crate::{ROOMS, USER_COUNT};

pub async fn stat_display_thread() {
    let mut interval = tokio::time::interval(Duration::from_secs(30));

    loop {
        interval.tick().await; // Wait 10 seconds
        let n = ROOMS.lock().await.len();
        let users = USER_COUNT.lock().await;
        debug!("Rooms currently online: {}, Users online {}", n, users);
    }
}
