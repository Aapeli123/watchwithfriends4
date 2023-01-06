import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../store/store';

const connMiddleware: Middleware<{}, RootState> = store => {
  return next => action => {
    next(action);
  };
};
