import React, { useContext, useState } from 'react';
import {
  ReactReduxContext,
  ReactReduxContextValue,
  useDispatch,
  useSelector,
} from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState, store } from '../store/store';
import { showVideoPrompt } from '../store/ui';
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import './SideBar.css';

import logo from './logo_final.png';
import AlertWithChildren from './modals/alert/AlertWithChildren';
import { createRoom, makeLeader } from '../store/room';

const RoomBar = () => {
  const { store } =
    useContext<ReactReduxContextValue<RootState>>(ReactReduxContext);
  const roomCode = useSelector((state: RootState) => state.room.roomCode);
  const [showUsers, setShowUsers] = useState(false);
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.conn.userID);
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

  const copyRoomCodeResponsive = async () => {
    await navigator.clipboard.writeText(store.getState().room.roomCode);
    toast(`Room code(${store.getState().room.roomCode}) copied!`, {
      type: 'success',
      theme: 'dark',
      closeOnClick: true,
      autoClose: 4000,
      delay: 0,
    });
  };

  const clickUsers = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setShowUsers(!showUsers);
  };

  const users = useSelector((state: RootState) => state.room.users);
  const newLeader = async (user_id: string) => {
    dispatch(makeLeader(user_id));
  };
  return (
    <>
      <div className="side-bar">
        <div
          className="sidebar-top desktop"
          onClick={() => {
            copyRoomCode();
          }}
        >
          <h2>Room code: {roomCode}</h2>
        </div>

        <div
          className="sidebar-top-responsive"
          onClick={() => {
            copyRoomCodeResponsive();
          }}
        >
          <span className="material-icons">link</span>
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
                    {userId === leaderId && id !== userId && (
                      <button
                        onClick={() => {
                          newLeader(id);
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
              <div className="user-list">
                <h1>Users:</h1>
                {Object.keys(users).map(id => {
                  return (
                    <div className="username-container" key={id}>
                      <h2>
                        {users[id].name} {id === leaderId && '(Leader)'}
                      </h2>
                      {leaderId === userId && id !== leaderId && (
                        <button onClick={() => makeLeader(id)}>
                          Make leader
                        </button>
                      )}
                      <br />
                    </div>
                  );
                })}
              </div>
            </AlertWithChildren>
          </>
        )}

        {leaderId === userId && (
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

const HomeBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const username = useSelector((state: RootState) => state.pref.username);
  const createRoomClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    try {
      dispatch(createRoom({ username: store.getState().pref.username }));
    } catch {
      console.log('Room creation failed...');
    }
  };
  return (
    <>
      <div className="side-bar">
        <Link aria-label={"Go Home"} to={'/'}>
          <div className="sidebar-top-responsive">
            <img className="logo-img" src={logo}  alt={"logo"}/>
          </div>
        </Link>
        <Link aria-label={"Join a room"} to={'/joinroom'}>
          <div className="sidebar-top desktop">
            <h2>Join Room</h2>
          </div>
        </Link>
        <a href="/" onClick={createRoomClick}>
          <div className="sidebar-item">
            <h4>
              <span className="material-icons">add</span>
              <span className="sidebar-text">New Room</span>
            </h4>
          </div>
        </a>
        <Link aria-label={"More information about website"} to={'/info'}>
          <div className="sidebar-item">
            <h4>
              <span className="material-icons">menu_book</span>
              <span className="sidebar-text">Info</span>
            </h4>
          </div>
        </Link>
        <Link aria-label={"Go to settings"} to={'/settings'}>
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

const SideBar = () => {
  const roomBar = useSelector((state: RootState) => state.ui.roomBar);

  return roomBar ? <RoomBar /> : <HomeBar />;
};

export default SideBar;
