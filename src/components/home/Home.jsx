import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { BiSmile } from "react-icons/bi";
import { AiFillPicture } from "react-icons/ai";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import Post from "../post/Post";
import Navbar from "../navbar/Navbar";
import { Link } from "react-router-dom";
import { getListUser,getById } from "../redux/slice/userSlice";
import { getPostList } from "../redux/slice/postSlice";
import { getLikeUser } from "../redux/slice/likeSlice";
import EmojiPicker from "emoji-picker-react";
import { io } from "socket.io-client";
import {addMsgToChat} from '../redux/slice/chatSlice'

import axios from "axios";


import { createPost } from "../redux/slice/postSlice";

const Home = ({ handleMessagesUser,chatBoxRef }) => {
  const socket = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const modelPostRef = useRef();
  const inputFileRef = useRef();
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [errCreatePost,setErrCreatePost] = useState(null) ;
  const [text, setText] = useState("");
  const [emojiClick, setEmojiClick] = useState(false);
  const [imgPost, setImgPost] = useState("");
  const { userList, user} = useSelector((state) => state.user);
  const { postList, isLoading, isError } = useSelector((state) => state.post);
  const { likeList } = useSelector((state) => state.like);
  const [imageLoading, setImageLoading] = useState(false);
  const [userListOnline,setUserListOnline] = useState([]); 
  const [receiveUser,setReceiveUser] = useState(null); 
  const handlePost = () => {
    modelPostRef.current.style.display = "block";
    window.onscroll = () => {
      window.scroll(0, 0);
    };
  };

  useEffect(() => {
    socket.current = io("http://localhost:5000");
  }, []);

  useEffect(()=>{
    if(socket.current){
      socket.current.on("user-is-online",(data)=>{
        setUserListOnline(data); 
      })
    }
  },[])

  useEffect(() => {
    if(socket.current){
      socket.current.emit("user-online",user.userId)
    }
  }, []);

  useEffect(()=>{
    const _user = JSON.parse(localStorage.getItem("user")) && JSON.parse(localStorage.getItem("user")).userId; 
    setReceiveUser(_user); 
  },[])

  useEffect(()=>{
      if(socket.current){
        socket.current.on("server-send-data",(data)=>{
            const {avatar,username,...rest} = data; 
            dispatch(addMsgToChat(rest))   
            handleMessagesUser({
              _id:data.from, 
              username:data.username,
              avatar:data.avatar
            })
        })
      }
  },[])



  const handleCancelPost = () => {
    modelPostRef.current.style.display = "none";
    window.onscroll = () => {
      window.scroll();
    };
  };

  const handleSetEmojiClick = () => {
    setEmojiClick(true);
  };

  const onEmojiClick = (emojiObject) => {
    const content = text + emojiObject.emoji;
    setText(content);
  };

  const handleShowFile = () => {
    inputFileRef.current.click();
    setEmojiClick(false);
  };

  const handleUploadImg = async (formData) => {
    try {
      setImageLoading(true);
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/love3000/upload`,
        formData
      );
      if (response.data) {
        setImgPost(response.data.url);
        setImageLoading(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };


  const hanldeChooseFile = (e) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.addEventListener("load", () => {
      setPreviewAvatar(reader.result);
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      formData.append("upload_preset", "ve93uroy");
      handleUploadImg(formData);
    });
  };

  const handleCreatePost = async () => {
    if (text === "" && imgPost === "") {
      setErrCreatePost("Phải có nội dung hoặc ảnh khi tạo bài viết !")
      return;
    }
    const post = {
      content: text,
      image: imgPost,
      time: Date.now(),
    };
    if (imageLoading === false) {
      dispatch(createPost(post));
      navigate(0);
    }
  };

  const reGetPostList = () => {
    dispatch(getPostList());
  };

  const handleOnKeyDown = (e)=>{
      if(e.key === 13 || e.key === "Enter"){
        handleCreatePost(); 
      }
  }

  useEffect(() => {
    const userLocal = localStorage.getItem("user"); 
    if (!userLocal) {
      navigate("/");
    }
  },[]);

  useEffect(() => {
    dispatch(getListUser());
    dispatch(getPostList());
    dispatch(getLikeUser());
  },[user.userId]);


  return (
    <Container>
      <FormModelStatus ref={modelPostRef}>
        <FormModelStatusItem onSubmit={(e)=>e.preventDefault()}>
          <div className="emoji">
            {emojiClick && <EmojiPicker onEmojiClick={onEmojiClick} />}
          </div>
          <ModelTitle>Tạo bài viết</ModelTitle>
          <span style={{color:"red"}}>{errCreatePost}</span>
          <span style={{ color: "red", fontSize: 14 }}>
            {isError.message !== null && "Có lỗi xảy ra !"}
          </span>
          <MdOutlineCancelPresentation
            onClick={handleCancelPost}
            className="model-cancel"
          />
          <ModelHr />
          <ModelForm>
            <Box>
              <img width={30} alt="" height={30} src={user && user.avatar} />
            </Box>
            <Box style={{ width: "100%" }}>
              <ModelInput
                onKeyDown={handleOnKeyDown}
                value={text}
                onClick={() => setEmojiClick(false)}
                onChange={(e) => setText(e.target.value)}
                type="text"
                placeholder="Bạn đang nghĩ gì thế ?"
              />
            </Box>
          </ModelForm>
          <ModelImg>
            {previewAvatar && <img alt="" src={previewAvatar} />}
          </ModelImg>
          <ModelOptions>
            <span>Thêm vào bài viết của bạn:</span>
            <Box className="model-options">
              <input
                ref={inputFileRef}
                type="file"
                onChange={hanldeChooseFile}
                style={{ display: "none" }}
              />
              <BiSmile
                fontSize={30}
                style={{color:"orangered"}}
                onClick={handleSetEmojiClick}
                className ="mo-icon"
              />
              <Space />
              <AiFillPicture style={{color:"orangered"}} fontSize={30} onClick={handleShowFile}  className ="mo-icon" />
            </Box>
          </ModelOptions>
          <ModelBtn
            imageLoading={imageLoading}
            isLoading={isLoading}
            onClick={handleCreatePost}
          >
            Đăng
          </ModelBtn>
        </FormModelStatusItem>
      </FormModelStatus>

      <Navbar />
      <Body>
        <TaskbarLeft>
          <TaskListLeft>
            <Link className="link l-profile" to={`/profile/user/${user && user.userId}`}>
              <TaskListLeftUser>
                <Avatar className="avatar-user" width={50} height={50} src={user && user.avatar} />
                <Box>
                  <span>{user && user.username}</span>
                </Box>
              </TaskListLeftUser>
            </Link>
            <TaskListLeftItem>
              <TaskBarLeftText>Tìm bạn bè</TaskBarLeftText>
            </TaskListLeftItem>
            <TaskListLeftItem>
              <TaskBarLeftText>Nhóm</TaskBarLeftText>
            </TaskListLeftItem>
            <TaskListLeftItem>
              <TaskBarLeftText>Kỉ niệm</TaskBarLeftText>
            </TaskListLeftItem>
            <TaskListLeftItem>
              <TaskBarLeftText>Kho lưu trữ</TaskBarLeftText>
            </TaskListLeftItem>
            <TaskListLeftItem>
              <TaskBarLeftText>Gần đây</TaskBarLeftText>
            </TaskListLeftItem>
            <TaskListLeftItem>
              <TaskBarLeftText>Yêu thích</TaskBarLeftText>
            </TaskListLeftItem>
            <TaskListLeftItem>
              <TaskBarLeftText>Quảng cáo</TaskBarLeftText>
            </TaskListLeftItem>
            <TaskListLeftItem>
              <TaskBarLeftText>Video</TaskBarLeftText>
            </TaskListLeftItem>
            <TaskListLeftItem>
              <TaskBarLeftText>Phòng</TaskBarLeftText>
            </TaskListLeftItem>
          </TaskListLeft>
        </TaskbarLeft>
        <News>
          <Feel>
            <Box className="news-status">
              <Avatar width={50} height={50} src={user && user.avatar} />
              <Form className="news-form" onClick={handlePost}>
                <FeelInput>
                  <Paragraph className="text-question">
                    Ngày hôm nay của bạn thế nào ?
                  </Paragraph>
                </FeelInput>
              </Form>
            </Box>
          </Feel>
          <h1 style={{ marginTop: "50px" }}>Bảng tin</h1>
          {postList &&
            postList.post &&
            postList.post.map((item) => {
              const flagBlue =
                likeList &&
                likeList.like &&
                likeList.like.find((element) => {
                 return  element.postId === item.post._id && element.userId === receiveUser
                });
              return (
                <Post
                  reGetPostList={reGetPostList}
                  flagBlue={flagBlue}
                  key={item.post._id}
                  postItem={item}
                />
              );
            })}
        </News>
        <TaskbarRight>
          <TaskListRight>
            <h3>Mọi người</h3>
            {userList &&
              userList.user?.map((item) => {
                const flag = userListOnline.find(element=>element===item._id); 
                return (
                  <TaskListRightItem
                    key={item._id}
                    onClick={() => handleMessagesUser({
                      _id:item._id, 
                      username:item.username,
                      avatar:item.avatar
                    })}
                  >
                    <Box className="taskbar-right-username">
                      <Avatar width={50} height={50} src={item.avatar} />
                      {
                        flag && 
                       <Box className="taskbar-right-active" />
                      }
                    </Box>
                    <Text className="task-right-item-username">
                      {item.username}
                    </Text>
                  </TaskListRightItem>
                );
              })}
          </TaskListRight>
        </TaskbarRight>
      </Body>
    </Container>
  );
};

const TaskListLeftUser = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width:350px;
  .avatar-user{
    border-radius: 50%;
  }
  span {
    font-weight: bold;
    display: block;
    min-width: 250px;
    position: relative;
    left: 20px;
  }
`;

const FormModelStatusItem = styled.div`
  width: 600px;
  height: auto;
  min-height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffff;
  border-radius: 5px;
  box-shadow: -1px 1px 5px 5px rgb(176, 168, 168);
  position: absolute;
  left: 50%;
  z-index: 99999;
  transform: translate(-50%, -50%);
  top: 50%;
  .model-cancel {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 20px;
    cursor: pointer;
  }
  .emoji {
    position: absolute;
    top: 118px;
    z-index: 9999;
  }
`;
const ModelTitle = styled.h3`
  margin: 10px 0;
`;

const ModelOptions = styled.div`
  width: 95%;
  height: 45px;
  border: 1px solid #80808050;
  border-radius: 5px;
  margin-top: 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  align-items: center;
  .model-options {
    display: flex;
    justify-content: center;
    .mo-icon{
      &:hover{
        color: red;
      }
    }
    .emojiPicker {
      display: hidden;
    }
  }
`;

const ModelBtn = styled.button`
  width: 95%;
  height: 45px;
  background-color: ${(props) =>
    props.imageLoading === true ? "#0000ff96" : "#0000ff5a"};
  color: white;
  border-radius: 5px;
  &:hover{
    background-color: blue;
  }
  font-size: 20px;
  margin: 20px 0;
  border: none;
  transition: all 0.5s ease-in;
  cursor: ${(props) =>
    props.imageLoading === true ? "not-allowed" : "pointer"};
`;

const ModelImg = styled.div`
  width: 100%;
  height:auto;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 100%;
    max-height: 400px;
    object-fit: contain;
    flex: 1;
  }
`;

const FormModelStatus = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #3333336c;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  display: none;
`;

const TaskBarLeftText = styled.span`
  font-weight: 600;
  position: relative;
  padding-right: 20px;
  display: block;
`;

const Body = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  padding-top: 30px;
  height: auto;
  margin-top: 70px;
`;

const Space = styled.div`
  width: 10px;
`;

const Text = styled.h4``;

const TaskbarLeft = styled.div`
  flex: 1;
  border-radius: 2px;
  position: fixed;
  padding-right: 20px;
  margin-right: 20px;
  width: auto;
  left: 0;
`;

const TaskListLeft = styled.ul`
  padding-left: 70px;
  margin-right: 20px;
  height: 90vh;
  overflow-y: scroll;
  overflow-x: hidden;
  ::-webkit-scrollbar {
    width: 5px;
    background-color: #8080806c;
    border-radius: 5px;
    opacity: 0.5;
    display: none;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #8080806c;
    border-radius: 5px;
  }
  &:hover {
    ::-webkit-scrollbar {
      display: block;
      opacity: 0.5;
    }
  }
`;

const FeelInput = styled.div`
  width: 100%;
  height: 40px;
  border: none;
  outline: none;
  border-radius: 5px;
  background-color: #8080801f;
  padding-left: 10px;
  cursor: pointer;
  line-height: 40px;
  display: flex;
  align-items: center;
`;

const Paragraph = styled.p`
  font-size: 15px;
  padding: 5px 0;
`;

const ModelHr = styled.div`
  width: 100%;
  height: 3px;
  background-color: gray;
`;

const TaskListLeftItem = styled.li`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  min-width: 200px;
  margin-top: 20px;
  width: 100%;
  position: relative;
  height: 50px;
  padding-left: 20px;
  padding-right: 30px;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: white;
    position: relative;
    .task-left-username {
      display: block;
      color: red;
    }
  }
`;

const TaskListRight = styled.ul`
  padding-right: 70px;
  height: 100vh;
  width: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  position: relative;
  ::-webkit-scrollbar {
    width: 5px;
    background-color: #8080806c;
    border-radius: 5px;
    display: none;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #8080806c;
    border-radius: 5px;
  }
  &:hover {
    ::-webkit-scrollbar {
      display: block;
    }
  }
`;

const TaskListRightItem = styled.li`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 20px;
  width: 100%;
  height: 50px;
  padding: 0 20px;
  border-radius: 5px;
  position: relative;
  cursor: pointer;
  &:hover {
    background-color: white;
    position: relative;
    .task-right-item-username {
      position: relative;
    }
  }
  .task-right-item-username {
    margin-left: 10px;
    position: relative;
    width: 100%;
    font-size: 14px;
  }
  .taskbar-right-username {
    display: flex;
    height: 100%;
    align-items: center;
    position: relative;
    &:hover {
      position: relative;
      .task-right-item-username {
        position: relative;
      }
    }
  }

  .taskbar-right-active {
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background-color: #33c233;
    position: absolute;
    bottom: 2px;

  }
`;
const News = styled.div`
  width: 40%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Feel = styled.div`
  width: 100%;
  height: 120px;
  border-radius: 5px;
  background-color: white;
  box-shadow: -1px 1px 5px 5px rgb(176, 168, 168);
  -webkit-box-shadow: -1px 1px 5px 5px rgb(176, 168, 168);
  -moz-box-shadow: -1px 1px 5px 5px rgb(176, 168, 168);
  padding: 10px 30px;
  display: flex;
  align-items: center;
  .news-status {
    width: 100%;
    height: 45px;
    display: flex;
    align-items: center;
  }
  .news-form {
    width: 100%;
    margin-left: 10px;
  }
  .text-question {
    opacity: 0.7;
  }
`;

const NewItem = styled.div`
  width: 70%;
  height: auto;
  margin-top: 40px;
  border-radius: 5px;
  background-color: white;
  box-shadow: -1px 1px 5px 5px rgb(176, 168, 168);
  -webkit-box-shadow: -1px 1px 5px 5px rgb(176, 168, 168);
  -moz-box-shadow: -1px 1px 5px 5px rgb(176, 168, 168);
  padding: 10px 30px;
  .news-interactive {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    cursor: pointer;
  }
  .news-count-like {
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    .news-count-like-right {
      width: 30%;
      display: flex;
      justify-content: space-between;
    }
  }
  .news-interactive-item {
    display: flex;
    align-items: center;
  }

  .news-hr {
    width: 100%;
    height: 2px;
    background-color: black;
    border-radius: 5px;
    margin: 5px 0;
  }
`;

const NewItemHead = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  .post-username {
    margin-left: 20px;
  }
  span {
    font-size: 14px;
    display: flex;
    align-items: center;
  }
`;

const TaskbarRight = styled.div`
  flex: 1;
  border-radius: 2px;
  position: fixed;
  padding-left: 20px;
  width: 20%;
  right: 0;
`;
const Container = styled.div`
  width: 100%;
  height: auto;
  min-height: 100vh;
  background-color: #eeee;
  padding-bottom: 100px;
  position: relative;
`;

const Logo = styled.h1`
  font-size: 50px;
  font-weight: 800;
`;

const Brand = styled.h3``;

const Box = styled.div`
  position: relative;
`;

const NavbarLeft = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  .navbar-left {
    display: flex;
    height: 100%;
    align-items: center;
    cursor: pointer;
    .navbar-left-logo {
      color: red;
    }

    .navbar-left-brand {
      color: gray;
    }
  }
`;

const Avatar = styled.img`
  border-radius: 50%;
  cursor: pointer;
  object-fit: cover;
`;

const NavbarRight = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .navbar-right-icon {
    font-size: 25px;
    margin: 0 20px;
  }
`;
const NavbarCenter = styled.div`
  flex: 2;
  height: 100%;
  display: flex;
  padding: 0 50px;
  justify-content: space-around;
  align-items: center;
  .navbar-center-icon-home {
    font-size: 27px;
    cursor: pointer;
  }
  .navbar-center-icon-friend {
    font-size: 30px;
    cursor: pointer;
  }
  .navbar-center-icon-home-container {
    height: 100%;
    width: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .navbar-center-icon-home-container.active {
    border-bottom: 4px solid blue;
  }
`;

const Input = styled.input`
  height: 40px;
  outline: none;
  border-radius: 5px;
  width: 100%;
  padding-left: 20px;
  border: none;
  background-color: #8080801c;
  margin-left: 10px;
`;
const Form = styled.form`
  height: 80%;
  width: 100%;
`;

const ModelForm = styled.form`
  width: 100%;
  height: 50px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  padding-left: 10px;
  img {
    border-radius: 50%;
  }
`;

const ModelInput = styled.input`
  width: 100%;
  height: 100%;
  padding-left: 20px;
  border: none;
  outline: none;
`;

export default Home;
