import { createSlice, PayloadAction } from "@reduxjs/toolkit";



const preferencsSlice = createSlice({
    initialState: () => {
        const username = "test"
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

export const {} = preferencsSlice.actions;