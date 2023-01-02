import React, { useContext, useState } from 'react';
import {
  ReactReduxContext,
  ReactReduxContextValue,
  useDispatch,
  useSelector,
} from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ServerConn } from '../lib/conn';
import { RootState } from '../store/store';
import { showVideoPrompt } from '../store/ui';
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import './SideBar.css';

import logo from './logo_final.png';
import AlertWithChildren from './modals/alert/AlertWithChildren';

const RoomBar = (props: { conn: ServerConn }) => {
  const { store } =
    useContext<ReactReduxContextValue<RootState>>(ReactReduxContext);
  const roomCode = useSelector((state: RootState) => state.room.roomCode);
  const [showUsers, setShowUsers] = useState(false);
  const dispatch = useDispatch();
  const leaderId = useSelector((state: RootState) => state.room.leaderId);

  const changeVideo = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    dispatch(showVideoPrompt());
  };

  const copyRoomCode = async () => {
    await navigator.clipboard.writeText(store.getState().room.roomCode);
    toast('Room code copied to clipboard!', {
      type: 'success',
      theme: 'dark',
      closeOnClick: true,
      autoClose: 500,
      delay: 0,
    });
  };

  const clickUsers = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setShowUsers(!showUsers);
  };

  const users = useSelector((state: RootState) => state.room.users);
  const makeLeader = async (user_id: string) => {
    const res = await props.conn.makeLeader(user_id);
    if (!res.success) {
      console.log('Something went horribly wrong...');
    }
  };
  return (
    <>
      <div className="side-bar">
        <div
          className="sidebar-top"
          onClick={() => {
            copyRoomCode();
          }}
        >
          <h2>Room code: {roomCode}</h2>
        </div>
        <div className="sidebar-item" onClick={clickUsers}>
          <h4>
            <span className="material-icons">group</span>
            <span className="sidebar-text">Users</span>
          </h4>
        </div>
        {showUsers && (
          <>
            <div className="user-list desktop">
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
            <AlertWithChildren
              className="mobile"
              closeBtnPress={() => setShowUsers(false)}
            >
              <>
                <h1>Users:</h1>
                {Object.keys(users).map(id => {
                  return (
                    <div className="username-container">
                      <h2>
                        {users[id].name} {id === leaderId && '(Leader)'}
                      </h2>
                      {leaderId === props.conn.user_id && id !== leaderId && (
                        <button>Make leader</button>
                      )}
                    </div>
                  );
                })}
              </>
            </AlertWithChildren>
          </>
        )}

        {leaderId === props.conn.user_id && (
          <div className="sidebar-item" onClick={changeVideo}>
            <h4>
              <span className="material-icons">video_settings</span>
              <span className="sidebar-text">Change video</span>
            </h4>
          </div>
        )}
        <Link to={'/'}>
          <div className="sidebar-item">
            <h4>
              <span className="material-icons">exit_to_app</span>
              <span className="sidebar-text">Leave Room</span>
            </h4>
          </div>
        </Link>
      </div>
    </>
  );
};

const HomeBar = (props: { conn: ServerConn }) => {
  const navigate = useNavigate();
  const username = useSelector((state: RootState) => state.pref.username);
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
  return (
    <>
      <div className="side-bar">
        <Link to={'/'}>
          <div className="sidebar-top-responsive">
            <img className="logo-img" src={logo} />
          </div>
        </Link>
        <Link to={'/joinroom'}>
          <div className="sidebar-top desktop">
            <h2>Join Room</h2>
          </div>
        </Link>
        <a href="" onClick={createRoomClick}>
          <div className="sidebar-item">
            <h4>
              <span className="material-icons">add</span>
              <span className="sidebar-text">New Room</span>
            </h4>
          </div>
        </a>
        <Link to={'/info'}>
          <div className="sidebar-item">
            <h4>
              <span className="material-icons">menu_book</span>
              <span className="sidebar-text">Info</span>
            </h4>
          </div>
        </Link>
        <Link to={'/settings'}>
          <div className="sidebar-item">
            <h4>
              <span className="material-icons">settings</span>
              <span className="sidebar-text">Settings</span>
            </h4>
          </div>
        </Link>
      </div>
    </>
  );
};

const SideBar = (props: { conn: ServerConn }) => {
  const roomBar = useSelector((state: RootState) => state.ui.roomBar);

  return roomBar ? (
    <RoomBar conn={props.conn} />
  ) : (
    <HomeBar conn={props.conn} />
  );
};

export default SideBar;
