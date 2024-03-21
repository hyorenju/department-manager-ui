import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  openModal: false,
};

const modalLoginSlide = createSlice({
  name: 'modalLogin',
  initialState,
  reducers: {
    setOpenModal: (state, action) => {
      state.openModal = action.payload;
    },
  },
});

export const { setOpenModal } = modalLoginSlide.actions;
const modalLoginReducer = modalLoginSlide.reducer;
export default modalLoginReducer;
