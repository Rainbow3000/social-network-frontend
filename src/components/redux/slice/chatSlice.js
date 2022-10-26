import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userRequest } from "../../../requestConfig";

export const createMsg = createAsyncThunk("msg/create",async(data)=>{
        const response = await userRequest.post('/message',data); 
        return response.data; 
})

export const getMsg = createAsyncThunk("msg/getMsg",async(to)=>{
    const response = await userRequest.get(`/message/?to=${to}`); 
    return response.data; 
})

const chatState = {
  isLoading: false,
  userChat:null,
  _user:null, 
  msgs:[], 
  isError: {
    error: false,
    message: null,
    action: null,
  },
};

const chatSlice = createSlice({
  name: "chat",
  initialState: chatState,
  reducers: {
    chatUser:(state,action)=>{
        state.userChat = action.payload
    }, 
    addMsgToChat:(state,action)=>{
        if(state.msgs.msg){
          state.msgs.msg  = action.payload ? [...state.msgs.msg,action.payload]: [state.msgs.msg];
          state._user = action.payload && action.payload; 
        }
    }, 
  },
  extraReducers:(builder)=>{
    builder.addCase(createMsg.pending,(state,action)=>{
        state.isLoading = true;
    })
    builder.addCase(createMsg.fulfilled,(state,action)=>{
        state.isLoading = false;
        state.msgs.msg = [...state.msgs.msg,action.payload.message];
        state._user = action.payload && action.payload; 
    })

    builder.addCase(getMsg.pending,(state,action)=>{
        state.isLoading = true
    })

    builder.addCase(getMsg.fulfilled,(state,action)=>{
        state.msgs = action.payload
    })

  }
});

export const {chatUser,addMsgToChat} = chatSlice.actions

export default chatSlice.reducer;
