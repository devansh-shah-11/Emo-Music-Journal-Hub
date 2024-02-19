import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: {
            session_token: null
        },
    },
    reducers: {
        login: (state, action) => {
            console.log("Login payload: ", action.payload);
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = {
                session_token: null
            };
        },
    },
});

export const { login, logout } = userSlice.actions;

export const selectUser = (state) => state.user.user.session_token;

export default userSlice.reducer;

// actions - define all url
// reducers - call initial state from actions =- success or failure or request
// store = combine all reducers and actions
// component