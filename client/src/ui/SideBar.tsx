import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ServerConn } from '../lib/conn';
import { RootState } from '../store/store';
import { showVideoPrompt } from '../store/ui';
import './SideBar.css';
const SideBar = (props: { conn: ServerConn }) => {
  const [showUsers, setShowUsers] = useState(false);

  const navigate = useNavigate();
  const username = useSelector((state: RootState) => state.pref.username);
  const roomBar = useSelector((state: RootState) => state.ui.roomBar);
  const roomCode = useSelector((state: RootState) => state.room.roomCode);
  const users = useSelector((state: RootState) => state.room.users);

  const leaderId = useSelector((state: RootState) => state.room.leaderId);
  const dispatch = useDispatch();
  const createRoomClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    try {
      console.log(username);
      let r = await props.conn.createRoom(username);
      navigate(`room/${r.room_code}`);
    } catch {
      console.log('Room creation failed...');
    }
  };

  const changeVideo = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    dispatch(showVideoPrompt());
  };

  const clickUsers = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setShowUsers(!showUsers);
  };

  const makeLeader = async (user_id: string) => {
    const res = await props.conn.makeLeader(user_id);
    if (!res.success) {
      console.log('Something went horribly wrong...');
    }
  };

  return roomBar ? (
    <>
      <div className="side-bar">
        <div className="sidebar-top">
          <h2>Room code: {roomCode}</h2>
        </div>
        <div className="sidebar-item" onClick={clickUsers}>
          <h4>
            <span className="material-icons">group</span>Users
          </h4>
        </div>
        {showUsers && (
          <div className="user-list">
            {Object.keys(users).map(id => {
              return (
                <div key={id}>
                  <h6>
                    {users[id].name} {id === leaderId && '(Leader)'}
                  </h6>
                  {props.conn.user_id === leaderId &&
                    id !== props.conn.user_id && (
                      <button
                        onClick={() => {
                          makeLeader(id);
                        }}
                      >
                        Make leader
                      </button>
                    )}
                </div>
              );
            })}
          </div>
        )}

        {leaderId === props.conn.user_id && (
          <div className="sidebar-item" onClick={changeVideo}>
            <h4>
              <span className="material-icons">video_settings</span>Change video
            </h4>
          </div>
        )}
        <Link to={'/'}>
          <div className="sidebar-item">
            <h4>
              <span className="material-icons">exit_to_app</span>Leave Room
            </h4>
          </div>
        </Link>
      </div>
    </>
  ) : (
    <>
      <div className="side-bar">
        <Link to={'/joinroom'}>
          <div className="sidebar-top">
            <h2>Join Room</h2>
          </div>
        </Link>
        <a href="" onClick={createRoomClick}>
          <div className="sidebar-item">
            <h4>
              <span className="material-icons">add</span>New Room
            </h4>
          </div>
        </a>
        <Link to={'/info'}>
          <div className="sidebar-item">
            <h4>
              <span className="material-icons">menu_book</span>Info
            </h4>
          </div>
        </Link>
        <Link to={'/settings'}>
          <div className="sidebar-item">
            <h4>
              <span className="material-icons">settings</span>Settings
            </h4>
          </div>
        </Link>
      </div>
    </>
  );
};

export default SideBar;
