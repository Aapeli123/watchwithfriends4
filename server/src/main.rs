use std::collections::HashMap;
use room::Room;
use tokio::{sync::{Mutex}, net::TcpListener};
use std::io::Error as IoError;
use lazy_static::lazy_static;

mod ws;
mod room;
mod user;

lazy_static!{
    pub static ref ROOMS: Mutex<HashMap<String, Room>> = Mutex::new(HashMap::new());
}

#[tokio::main]
async fn main() -> Result<(), IoError>{
    let try_socket = TcpListener::bind("0.0.0.0:8080").await;
    let listener = try_socket.expect("Failed to bind");

    while let Ok((stream, _)) = listener.accept().await {
        tokio::spawn(ws::handle_connection(stream));
    }
    Ok(())
}
