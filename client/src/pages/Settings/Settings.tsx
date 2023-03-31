import {useDispatch, useSelector} from "react-redux";
import {disconnect, startConnecting} from "../../store/connection";
import {RootState} from "../../store/store";

const Settings = () => {
  const clearLocalstorage = () => {
    localStorage.clear();
    location.reload();
  };
  const dispatch = useDispatch();
  const connected = useSelector((state:RootState) => state.conn.connected);
  const userid = useSelector((state: RootState) => state.conn.userID);
  const reconnect = async () => {
      dispatch(disconnect());
      dispatch(startConnecting());
  };
  return (
    <>
      <h1>Settings:</h1>
      <h2>Theme:</h2>
      <p>Coming soon...</p>
      <h2> Local storage: </h2>
      <button onClick={clearLocalstorage}>Clear local storage</button>
      <h2>Connection:</h2>
      {connected && <h3>Session id: {userid}</h3>}
      <button onClick={reconnect}>Reconnect to server</button>
      <br />
    </>
  );
};
export default Settings;
