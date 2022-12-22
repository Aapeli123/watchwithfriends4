import {configureStore} from '@reduxjs/toolkit';
import roomReducer from './roomReducer';
import uiReducer from './uiReducer';

const store = configureStore({
    reducer: {
        room: roomReducer,
        ui: uiReducer
    },
});


export default store;