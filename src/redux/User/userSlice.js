import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accessToken: '',
};

const userSlide = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAccessToken: (state, actions) => {
      state.accessToken = actions.payload;
    },
  },
});

export const { setAccessToken } = userSlide.actions;
const userReducer = userSlide.reducer;
export default userReducer;
