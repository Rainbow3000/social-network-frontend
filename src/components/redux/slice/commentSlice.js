import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { publicRequest, userRequest } from "../../../requestConfig";



const commentState = {
  isLike: false,
  isLoading: false,
  isLikeLoad: false,
  likeList: [],
  isError: {
    error: false,
    message: null,
    action: null,
  },
};

const commentSlice = createSlice({
  name: "comment",
  initialState: commentState,
  reducers: {},
  extraReducers: (builder) => {
   
  },
});

// export const {} = userSlice.actions

export default commentSlice.reducer;
