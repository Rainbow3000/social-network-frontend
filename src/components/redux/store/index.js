import { configureStore } from '@reduxjs/toolkit'

import userReducer from '../slice/userSlice'
import postReducer from '../slice/postSlice'
import likeReducer from '../slice/likeSlice'
import commentReducer from '../slice/commentSlice'
import chatReducer from '../slice/chatSlice'

export const store = configureStore({
    reducer:{
        user:userReducer, 
        post:postReducer,
        like:likeReducer,
        comment:commentReducer,
        chat:chatReducer
    }
})