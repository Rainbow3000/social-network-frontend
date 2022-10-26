import { useEffect, useRef, useState } from "react";
import Home from "./components/home/Home";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Profile from "./components/profile/Profile";
import styled from "styled-components";
import ChatBox from "./components/chatbox/ChatBox";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { chatUser, getMsg } from "./components/redux/slice/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import NotFound from "./components/NotFound";

function App() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);

  const chatBoxRef = useRef();
  const handleMessagesUser = (user) => {
    dispatch(chatUser(user));
    dispatch(getMsg(user._id));
    chatBoxRef.current.style.display = "block";
  };

  return (
    <Container>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/home"
            element={<Home handleMessagesUser={handleMessagesUser} />}
          />
          <Route path="/profile/user/:userId" element={<Profile />} />
          <Route path="*" />
        </Routes>
      </BrowserRouter>
      <ChatBox chatBoxRef={chatBoxRef} />
    </Container>
  );
}

export default App;

const Container = styled.body`
  width: 100%;
  height: 100%;
  position: relative;
  overflow-x: hidden;
`;
