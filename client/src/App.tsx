import Cookies from 'js-cookie';
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
  Routes,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';
import connect, { ServerConn } from './lib/conn';
import Home from './pages/Home/Home';
import Info from './pages/Info/Info';
import Room from './pages/Room/Room';
import RoomCode from './pages/RoomCodeEntry/RoomCode';
import Settings from './pages/Settings/Settings';
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

const MainLayout = (props: { conn: ServerConn }) => {
  return (
    <>
      <TopBar conn={props.conn} />
      <div className="main-content">
        <SideBar conn={props.conn} />
        <div className="app-data">
          <Outlet />
        </div>
      </div>
    </>
  );
};

function App(): JSX.Element {
  const [connection, setConnection] = useState<ServerConn | undefined>();
  const [connected, setConnected] = useState(false);
  const dispatch = useDispatch();
  const showUnPrompt = useSelector((state: RootState) => state.ui.unPrompt);

  const { store } =
    useContext<ReactReduxContextValue<RootState>>(ReactReduxContext);
  useEffect(() => {
    const hasUn = localStorage.getItem('username') !== null;

    console.log(hasUn);
    if (!hasUn) {
      dispatch(setUnSelectorClosable(false));
      dispatch(showUnSelector());
    }

    if (connected) {
      console.log('Already connected.');
      return;
    }
    const connectToServer = async () => {
      const conn = await connect('wss://watchwithfriends.ml/ws');

      console.log('Connected...');
      setConnection(conn);
      setConnected(true);
    };
    connectToServer();
  }, []);

  const reconnect = async () => {
    setConnected(false);
    connection?.disconnect();
    setConnection(undefined);

    const conn = await connect('wss://watchwithfriends.ml/ws');

    setConnection(conn);
    setConnected(true);
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

  return connected ? (
    <>
      <BrowserRouter>
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
              element={<MainLayout conn={connection as ServerConn} />}
            >
              <Route
                path="/joinroom"
                element={<RoomCode conn={connection as ServerConn} />}
              />
              <Route
                path="/room/:code"
                element={<Room conn={connection as ServerConn} />}
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
                element={<Home conn={connection as ServerConn} />}
              />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </>
  ) : (
    <div className="App">
      <h1>Connecting...</h1>
    </div>
  );
}

export default App;
