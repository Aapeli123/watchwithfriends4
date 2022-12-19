use std::{collections::HashMap};
use room::Room;
use tokio::{sync::{Mutex}, net::TcpListener};
use std::io::Error as IoError;
use lazy_static::lazy_static;
use simple_logger::SimpleLogger;
use log::{info, error};

mod ws;
mod room;
mod user;
mod stats;

lazy_static!{
    pub static ref ROOMS: Mutex<HashMap<String, Room>> = Mutex::new(HashMap::new());
    pub static ref USER_COUNT: Mutex<u64> = Mutex::new(0);
}

const PORT: &str ="8080"; 

#[tokio::main]
async fn main() -> Result<(), IoError>{
    SimpleLogger::new().with_level(log::LevelFilter::Debug).init().unwrap();
    info!("Starting Watch W/Friends Server...");
    info!("Trying to listen on port {}", PORT);
    
    tokio::spawn(stats::stat_display_thread());
    let try_socket = TcpListener::bind(format!("0.0.0.0:{}", PORT)).await;
    if try_socket.is_err() {
        error!("Could not bind socket...");
        return Err(try_socket.err().unwrap());
    }
    let listener = try_socket.unwrap();
    info!("Started listening! Server should be online.");
    while let Ok((stream, addr)) = listener.accept().await {
        tokio::spawn(ws::handle_connection(stream, addr));
    }
    Ok(())
}

