import {createSlice,createAsyncThunk} from '@reduxjs/toolkit'
import {userRequest} from '../../../requestConfig'
import axios from 'axios'
export const createLike = createAsyncThunk(
    'like/likeCreate', async(data)=>{
        const response = await axios.post('http://localhost:5000/api/like',{
            postId:data
        },{
            headers:{
                token:`Bearer ${JSON.parse(localStorage.getItem("user"))?.accesstoken}`
            }
        })
        return response.data
    }
)

export const getLikeUser = createAsyncThunk(
    'like/getLikeUser', async()=>{
        const response = await userRequest.get('/like/byUserId')
        return response.data
    }
)



const likeState = { 
    isLike:false, 
    isLoading:false, 
    isLikeLoad:false,
    likeList:[], 
    isError:{
        error:false, 
        message:null,
        action:null
    },
}


const likeSlice=  createSlice({
    name:'like', 
    initialState:likeState, 
    reducers:{
       
    }, 
    extraReducers:(builder)=>{
       builder.addCase(createLike.pending, (state,action)=>{
            state.isLoading = true; 
            state.isLikeLoad = true;
       })
       builder.addCase(createLike.fulfilled,(state,action)=>{
           state.isLoading = false;
           state.likeList = action.payload;
           state.isLikeLoad = false;
           if(action.payload.message === "like success"){
                state.isLike = true
            }else{
                state.isLike = false
            }
        })
        builder.addCase(getLikeUser.fulfilled,(state,action)=>{ 
           state.likeList = action.payload; 
   })
    }
})


// export const {} = userSlice.actions

export default likeSlice.reducer; 

