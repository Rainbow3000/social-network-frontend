import {createSlice,createAsyncThunk} from '@reduxjs/toolkit'
import {publicRequest,userRequest} from '../../../requestConfig'

export const getPostList = createAsyncThunk(
    'post/getList', async()=>{
        const response = await publicRequest.get('/post')
        return response.data
    }
)

export const getPostListByUserId = createAsyncThunk(
    'post/getPostListByUserId', async(userId)=>{
        const response = await userRequest.get(`/post/${userId}`)
        return response.data
    }
)


export const postDelete = createAsyncThunk(
    'post/postDelete', async(postId)=>{
        const response = await userRequest.delete(`/post/${postId}`)
        return response.data
    }
)



export const createPost = createAsyncThunk(
    'post/create', async(post)=>{
        const response = await userRequest.post('/post',post)
        return response.data
    }
)

export const createComment = createAsyncThunk(
    "comment/createComment",
    async (data) => {
      const response = await userRequest.post("/comment", data);
      return response.data;
    }
  );



const postState = { 
    postList:[],
    postListUser:[],
    isLoading:false, 
    isError:{
        error:false, 
        message:null,
        action:null
    },
}


const postSlice=  createSlice({
    name:'post', 
    initialState:postState, 
    reducers:{
        
    }, 
    extraReducers:(builder)=>{

        builder.addCase(postDelete.pending,(state,action)=>{

        })

        builder.addCase(postDelete.fulfilled,(state,action)=>{
            state.postList.post = state.postList.post.filter(element=>{
                return element._id !== action.payload.postId
            })
        })

        builder.addCase(createComment.pending, (state, action) => {
            state.isLoading = true;
          });
          builder.addCase(createComment.fulfilled, (state,action) => {
              state.postList.post = state.postList.post.map(item=>{
                  if(item.post._id  === action.payload.comment.postId){
                      item.comment.push(action.payload.comment);
                    }
                    return item; 
                })
                state.isLoading = false;
            });
        builder.addCase(getPostList.pending,(state,action)=>{
            state.isLoading = true; 
            state.isError.error = false; 
            state.isError.message = null; 
        })
        builder.addCase(getPostList.fulfilled,(state,action)=>{
            if(action.payload.success){
                state.postList = action.payload
                state.isLoading = false; 
                state.isError.error = false; 
                state.isError.message = null;
                //localStorage.setItem('user',JSON.stringify(state.user))
            }else{
                state.isLoading = false
                state.isError.error = true
                state.isError.message = action.payload.message
            }
        })

        builder.addCase(createPost.pending,(state,action)=>{
                state.isLoading = true; 
        })
        builder.addCase(createPost.fulfilled,(state,action)=>{
            if(action.payload.success){
                state.isLoading = false; 
                state.isError.error = false; 
                state.isError.message = null;
               
            }else{
                state.isLoading = false
                state.isError.error = true
                state.isError.message = action.payload.message
              
            }
        })

        builder.addCase(getPostListByUserId.fulfilled,(state,action)=>{
            if(action.payload.success){
                state.isLoading = false; 
                state.postListUser = action.payload
                state.isError.error = false; 
                state.isError.message = null;
              
            }else{
                state.isLoading = false
                state.isError.error = true
                state.isError.message = action.payload.message
                
            }
        })


    }
})


// export const {} = userSlice.actions

export default postSlice.reducer; 

