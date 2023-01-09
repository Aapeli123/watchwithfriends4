import { useRef, useState } from 'react';
import connect, { ServerConn } from '../../lib/conn';

type themeDef = {name: string, id: string}

const themes: themeDef[] = [
  {name: "Dark", id: "dark"}, {name: "Light", id: "light"}
]

const Settings = (props: { conn: ServerConn; reconnect: () => any }) => {
  const [currentTheme, setCurTheme] = useState(() => localStorage.getItem("theme"));
  const themeSelector = useRef<HTMLSelectElement>(null);
  const clearLocalstorage = () => {
    localStorage.clear();
    location.reload();
  };
  const reconnect = async () => {
    props.reconnect();
  };

  const setTheme = (themeId?: string) => {
    if(themeId=== undefined) {
      return;
    }
    document.body.setAttribute("data-theme", themeId);
    localStorage.setItem("theme", themeId);
    setCurTheme(themeId);
  }
  return (
    <>
      <h1>Settings:</h1>
      <h2>Theme:</h2>
      <h3>Current theme is {currentTheme}</h3>
      <h3>Select a theme:</h3>
      <select ref={themeSelector}>
        {themes.map(({id, name}) => {
          return (
            <option value={id}>{name}</option>
          )
        })}
      </select>
      <button onClick={() => setTheme(themeSelector.current?.value)}>Set Theme</button>
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
