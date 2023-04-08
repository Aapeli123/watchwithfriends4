import { getBackURL } from '../../App';
import React, { useRef, useState } from 'react';
import { disconnect, startConnecting } from '../../store/connection';
import { useDispatch } from 'react-redux';

const ServerChanger = () => {
  const [backUrl, setBackUrl] = useState(getBackURL());
  const newUrlRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const changeServerUrl = (server_url: string) => {
    let url;
    try {
      url = new URL(server_url);
    } catch (e) {
      throw 'Url is not valid';
    }
    if (url.protocol !== 'ws:' && url.protocol !== 'wss:')
      throw 'Invalid protocol';
    localStorage.setItem('backendUrl', server_url);
    setBackUrl(getBackURL());

    dispatch(disconnect());
    dispatch(startConnecting(getBackURL()));
  };

  const serverFormSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUrlRef.current === null) return;
    changeServerUrl(newUrlRef.current.value);
  };
  return (
    <>
      <h4>Change the server:</h4>
      <h5>Current server: {backUrl}</h5>
      <form onSubmit={serverFormSubmitHandler}>
        <input ref={newUrlRef} placeholder={'New server URL'} />
        <input type={'submit'} value={'Change'} />
      </form>
      <br />
      <button onClick={() => changeServerUrl('wss://watchwithfriends.live/ws')}>
        Reset server url
      </button>
    </>
  );
};

export default ServerChanger;
