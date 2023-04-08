import { useContext, useEffect } from 'react';
import {
  ReactReduxContext,
  ReactReduxContextValue,
  useDispatch,
  useSelector,
} from 'react-redux';
import { Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';
import Home from './pages/Home/Home';
import Info from './pages/Info/Info';
import Room from './pages/Room/Room';
import RoomCode from './pages/RoomCodeEntry/RoomCode';
import Settings from './pages/Settings/Settings';
import { startConnecting } from './store/connection';
import { setUn } from './store/prefs';
import { changeName } from './store/room';
import { RootState } from './store/store';
import {
  hideUnSelector,
  setUnSelectorClosable,
  showUnSelector,
} from './store/ui';
import Prompt from './ui/modals/prompt/Prompt';
import SideBar from './ui/SideBar';
import TopBar from './ui/TopBar';

import './themes/Dark.css';
import './themes/Light.css';

import ServerChanger from './pages/Settings/ServerChanger';

export const getBackURL = () => {
  const url = localStorage.getItem('backendUrl');
  if (url === null) {
    localStorage.setItem('backendUrl', 'wss://watchwithfriends.live/ws');
    return 'wss://watchwithfriends.ml/ws';
  }
  return url;
};

const theme = localStorage.getItem('theme') || 'dark';
if (localStorage.getItem('theme') === null) {
  // For first time users set dark theme as default
  localStorage.setItem('theme', 'dark');
}
document.body.setAttribute('data-theme', theme);

const MainLayout = () => {
  return (
    <>
      <TopBar />
      <div className="main-content">
        <SideBar />
        <div className="app-data">
          <Outlet />
        </div>
      </div>
    </>
  );
};

function App(): JSX.Element {
  const dispatch = useDispatch();
  const showUnPrompt = useSelector((state: RootState) => state.ui.unPrompt);
  const isConnected = useSelector((state: RootState) => state.conn.connected);
  const isConnecting = useSelector(
    (state: RootState) => state.conn.isConnecting
  );
  const roomLoaded = useSelector((state: RootState) => state.room.roomLoaded);
  const connectionFailed = useSelector(
    (state: RootState) => state.conn.connectionFailed
  );

  const navigate = useNavigate();
  const { store } =
    useContext<ReactReduxContextValue<RootState>>(ReactReduxContext);
  useEffect(() => {
    const hasUn = localStorage.getItem('username') !== null;
    if (roomLoaded) {
      navigate(`/room/${store.getState().room.roomCode}`);
      return;
    }

    console.log(hasUn);
    if (!hasUn) {
      dispatch(setUnSelectorClosable(false));
      dispatch(showUnSelector());
    }
    console.log('Rerunning app constructor');

    if (store.getState().conn.connected) {
      console.log('Already connected.');
      return;
    }
    dispatch(startConnecting(getBackURL()));
  }, [roomLoaded]);

  const unPromptCB = (un: string) => {
    if (un.trimStart().trimEnd() === '') {
      return;
    }
    if (store.getState().room.roomLoaded) {
      dispatch(changeName(un));
    }
    localStorage.setItem('username', un);
    dispatch(setUn(un));
    dispatch(hideUnSelector());
  };

  if (connectionFailed) {
    return (
      <>
        <h1>Connection failed</h1>
        <button onClick={() => dispatch(startConnecting(getBackURL()))}>
          {' '}
          Retry{' '}
        </button>
        <ServerChanger />
      </>
    );
  }

  if (!isConnecting && !isConnected) {
    return (
      <>
        <h1>Loading...</h1>
      </>
    );
  }

  return isConnected ? (
    <>
      <div className="App">
        <ToastContainer
          pauseOnHover={false}
          hideProgressBar={false}
          position="bottom-right"
        />
        <Prompt
          question="Choose a name:"
          closable={showUnPrompt.closable}
          show={showUnPrompt.show}
          callback={unPromptCB}
          close={() => dispatch(hideUnSelector())}
        />
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route path="/joinroom" element={<RoomCode />} />
            <Route path="/room/:code" element={<Room />} />
            <Route path="/info" element={<Info />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/" element={<Home />} />
          </Route>
        </Routes>
      </div>
    </>
  ) : (
    <div className="App">
      <h1>Connecting...</h1>
    </div>
  );
}

export default App;
