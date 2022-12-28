import connect, { ServerConn } from '../../lib/conn';

const Settings = (props: { conn: ServerConn; reconnect: () => any }) => {
  const clearLocalstorage = () => {
    localStorage.clear();
    location.reload();
  };
  const reconnect = async () => {
    props.reconnect();
  };
  return (
    <>
      <h1>Settings:</h1>
      <h2>Theme:</h2>
      <p>Coming soon...</p>
      <h2> Local storage: </h2>
      <button onClick={clearLocalstorage}>Clear local storage</button>
      <h2>Connection:</h2>
      {props.conn !== undefined && <h3>Session id: {props.conn.user_id}</h3>}
      <button onClick={reconnect}>Reconnect to server</button>
      <br />
    </>
  );
};
export default Settings;
