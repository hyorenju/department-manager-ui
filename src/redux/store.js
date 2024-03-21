import { configureStore } from '@reduxjs/toolkit';
import userReducer from './User/userSlice';
import loginReducer from './Login/loginSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    login: loginReducer,
  },
});
