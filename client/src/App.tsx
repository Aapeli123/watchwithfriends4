import { Unsubscribe } from '@reduxjs/toolkit';
import { useContext, useEffect, useState } from 'react';
import {
  Provider,
  ReactReduxContext,
  ReactReduxContextValue,
  useDispatch,
  useSelector,
} from 'react-redux';
import {
  BrowserRouter,
  createBrowserRouter,
  Outlet,
  Route,
  RouterProvider,
  redirect,
  Routes,
  useNavigate,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';
import connect, { ServerConn } from './lib/conn';
import Home from './pages/Home/Home';
import Info from './pages/Info/Info';
import Room from './pages/Room/Room';
import RoomCode from './pages/RoomCodeEntry/RoomCode';
import Settings from './pages/Settings/Settings';
import { startConnecting } from './store/connection';
import { setUn } from './store/prefs';
import { RootState } from './store/store';
import {
  hideUnSelector,
  setUnSelectorClosable,
  showUnSelector,
} from './store/ui';
import Prompt from './ui/modals/prompt/Prompt';
import SideBar from './ui/SideBar';
import TopBar from './ui/TopBar';

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
  const [connection, setConnection] = useState<ServerConn | undefined>();
  // const [connected, setConnected] = useState(false);
  const dispatch = useDispatch();
  const showUnPrompt = useSelector((state: RootState) => state.ui.unPrompt);
  const isConnected = useSelector((state: RootState) => state.conn.connected);
  const isConnecting = useSelector((state: RootState) => state.conn.isConnecting);
  const roomLoading = useSelector((state: RootState) => state.room.roomLoading);
  const roomLoaded = useSelector((state: RootState) => state.room.roomLoaded);
  const [unsub, setUnsub] = useState<null | Unsubscribe>(null);
  const navigate = useNavigate();
  const { store } =
    useContext<ReactReduxContextValue<RootState>>(ReactReduxContext);
  useEffect(() => {
    const hasUn = localStorage.getItem('username') !== null;
    if(roomLoaded) {
      navigate(`/room/${store.getState().room.roomCode}`); 
      return;
  }

    console.log(hasUn);
    if (!hasUn) {
      dispatch(setUnSelectorClosable(false));
      dispatch(showUnSelector());
    }
    console.log("Rerunning app constructor")

    if (store.getState().conn.connected) {
      console.log('Already connected.');
      return;
    }
    dispatch(startConnecting());
  }, [roomLoaded]);


  const reconnect = async () => {
    // setConnected(false);
    connection?.disconnect();
    setConnection(undefined);

    const conn = await connect('wss://watchwithfriends.ml/ws');

    setConnection(conn);
  };

  const unPromptCB = (un: string) => {
    if (un.trimStart().trimEnd() === '') {
      return;
    }
    if (store.getState().room.roomLoaded) {
      connection?.changeUsername(un);
    }
    localStorage.setItem('username', un);
    dispatch(setUn(un));
    dispatch(hideUnSelector());
  };

  if(!isConnecting && !isConnected) {
    return <>
      <h1>Loading...</h1>
    </>
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
            <Route
              path="/"
              element={<MainLayout />}
            >
              <Route
                path="/joinroom"
                element={<RoomCode />}
              />
              <Route
                path="/room/:code"
                element={<Room />}
              />
              <Route path="/info" element={<Info />} />
              <Route
                path="/settings"
                element={
                  <Settings
                    conn={connection as ServerConn}
                    reconnect={reconnect}
                  />
                }
              />
              <Route
                path="/"
                element={<Home />}
              />
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
