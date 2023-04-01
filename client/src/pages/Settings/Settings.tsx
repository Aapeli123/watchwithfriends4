import { useDispatch, useSelector } from 'react-redux';
import { disconnect, startConnecting } from '../../store/connection';
import { RootState } from '../../store/store';
import { getBackURL } from '../../App';
import { useRef, useState } from 'react';
import ServerChanger from './ServerChanger';

type themeDef = {name: string, id: string}

const themes: themeDef[] = [
  {name: "Dark", id: "dark"}, {name: "Light", id: "light"}
]

const Settings = () => {



  const [currentTheme, setCurTheme] = useState(() => localStorage.getItem("theme"));
  const themeSelector = useRef<HTMLSelectElement>(null);

  const clearLocalstorage = () => {
    localStorage.clear();
    location.reload();
  };
  const dispatch = useDispatch();
  const connected = useSelector((state: RootState) => state.conn.connected);
  const userid = useSelector((state: RootState) => state.conn.userID);

  const reconnect = async () => {
    dispatch(disconnect());
    dispatch(startConnecting(getBackURL()));
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
      {connected && <h3>Session id: {userid}</h3>}
      <button onClick={reconnect}>Reconnect to server</button>
      <ServerChanger />

      <br />
    </>
  );
};
export default Settings;
