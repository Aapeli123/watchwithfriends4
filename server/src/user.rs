use crate::ws::WsWriter;

pub struct User {
    pub name: String,
    pub conn: WsWriter
}