use crate::ws::WsWriter;
use serde::{Serialize};

#[derive(Serialize)]
pub struct User {
    pub name: String,

    #[serde(skip_serializing)]
    pub conn: WsWriter
}