import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";


const preferencsSlice = createSlice({
    initialState: () => {
        const username = Cookies.get("username") as string;
        return {
            username: username,
        };
    },
    name: "preferences",
    reducers: {
        setUn(state, action: PayloadAction<string>) {
            state.username = action.payload;
        }
    }
});


export default preferencsSlice.reducer;

export const {setUn} = preferencsSlice.actions;