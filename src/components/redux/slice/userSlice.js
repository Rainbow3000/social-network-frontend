import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { publicRequest, userRequest } from "../../../requestConfig";

export const userLogin = createAsyncThunk("user/userLogin", async (user) => {
  const response = await publicRequest.post("/auth/login", user);
  return response.data;
});
export const userRegister = createAsyncThunk(
  "user/userRegister",
  async (data) => {
    const response = await publicRequest.post("/auth/register", data);
    return response.data;
  }
);
export const getListUser = createAsyncThunk("user/getListUser", async () => {
  const response = await publicRequest.get("/user");
  return response.data;
});

export const getListUserByUsername = createAsyncThunk(
  "user/getListUserByUsername",
  async (username) => {
    const response = await publicRequest.get(
      `/user/userByUsername?username=${username}`
    );
    return response.data;
  }
);

export const getOneUser = createAsyncThunk(
  "user/getOneUser",
  async (userId) => {
    const response = await userRequest.get(`/user/getUser/${userId}`);
    return response.data;
  }
);

// export const getOneUser = createAsyncThunk("user/getOneUser", async () => {
//     const response = await userRequest.get("/user/getOne");
//     return response.data;
//   });

export const updateAvatarCover = createAsyncThunk(
  "user/updateAvatarCover",
  async (data) => {
    const response = await userRequest.put("/user", {
      avatar: data,
    });
    return response.data;
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (data) => {
    const response = await userRequest.put("/user/profile", data);
    return response.data;
  }
);
export const updateUserAvatar = createAsyncThunk(
  "user/updateUserAvatar",
  async (data) => {
    const response = await userRequest.put("/user/avatar", {
      avatar: data,
    });
    return response.data;
  }
);

const userState = {
  user: JSON.parse(localStorage.getItem("user"))
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  userInfo: null,
  _user: null,
  _userList: null,
  userList: [],
  isLoading: false,
  isError: {
    error: false,
    message: null,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState: userState,
  reducers: {
    userLogout: (state, action) => {
      localStorage.removeItem("user");
      state.user = null;
      state.isLoading = false;
      state.isError = {
        error: false,
        message: null,
      };
    },
    handleUploadAvatarCover: (state, action) => {
      state.userInfo = action.payload.userUpdate;
    },
    handleUploadAvatar: (state, action) => {
      state.userInfo = action.payload.userUpdate;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getListUserByUsername.fulfilled, (state, action) => {
      state._userList = action.payload.user;
    });

    builder.addCase(updateAvatarCover.fulfilled,(state,action)=>{
        state.userInfo = action.payload; 
    })

    builder.addCase(updateUserAvatar.fulfilled,(state,action)=>{
        state.userInfo = action.payload;
    })

    builder.addCase(userLogin.pending, (state, action) => {
      state.isLoading = true;
      state.isError.error = false;
      state.isError.message = null;
    });
    builder.addCase(userRegister.pending, (state, action) => {
      state.isLoading = true;
      state.isError.error = false;
      state.isError.message = null;
    });

    builder.addCase(userRegister.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.isLoading = false;
        state.isError.error = false;
        state.isError.message = action.payload.message;
      } else {
        state.isLoading = false;
        state.isError.error = true;
        state.isError.message = action.payload.message;
      }
    });

    builder.addCase(userLogin.fulfilled, (state, action) => {
      if (action.payload.success) {
        localStorage.removeItem("user");
        state.user = action.payload;
        state.isLoading = false;
        state.isError.error = false;
        state.isError.message = null;
        localStorage.setItem("user", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("user");
        state.isLoading = false;
        state.isError.error = true;
        state.isError.message = action.payload.message;
      }
    });

    builder.addCase(getListUser.fulfilled, (state, action) => {
      state.userList = action.payload;
    });

    builder.addCase(getOneUser.fulfilled, (state, action) => {
      state.userInfo = action.payload;
    });
  },
});

// export const {} = userSlice.actions

export const { userLogout,handleUploadAvatar,handleUploadAvatarCover } = userSlice.actions;

export default userSlice.reducer;
