import { Middleware } from '@reduxjs/toolkit';
import { connected, startConnecting } from '../store/connection';
import { RootState } from '../store/store';
import connect, { ServerConn } from './conn';

const serverURL = 'ws://localhost:8080';

const connMiddleware: Middleware = store => {
  let connection: ServerConn;

  return next => async action => {
    if (!startConnecting.match(action)) next(action);
    connection = await connect(serverURL);
    store.dispatch(connected());
    console.log(connection);
  };
};

export default connMiddleware;
