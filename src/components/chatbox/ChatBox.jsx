import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { MdCancelPresentation } from "react-icons/md";
import { AiOutlineSend } from "react-icons/ai";
import { BsEmojiSmile } from "react-icons/bs";
import { message } from "../../data";
import { useSelector, useDispatch } from "react-redux";
import EmojiPicker from "emoji-picker-react";
import { createMsg, getMsg } from "../redux/slice/chatSlice";
import { io } from "socket.io-client";

const ChatBox = ({ chatBoxRef }) => {
  const [messageText, setMessageText] = useState("");
  const [emojiShow, setEmojiShow] = useState(false);
  const { userChat, msgs } = useSelector((state) => state.chat);
  const { user, userList } = useSelector((state) => state.user);

  const socket = useRef(null);
  const scrollRef = useRef();
  useEffect(() => {
    socket.current = io("http://localhost:5000");
  }, []);

  useEffect(() => {
    const scrollToBottomWithSmoothScroll = () => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current?.scrollHeight,
        behavior: "smooth",
      });
    };
    scrollToBottomWithSmoothScroll();
  }, [msgs && msgs.msg]);

  const handleMessagesUserClose = () => {
    document.getElementById("chatBox").style.display = "none";
  };

  const dispatch = useDispatch();

  const handleSendMsg = () => {
    if (messageText === "") return;
    const data = {
      to: userChat._id,
      content: messageText,
      time: Date.now().toString(),
    };
    dispatch(createMsg(data));

    if (socket.current) {
      data.from =
        JSON.parse(localStorage.getItem("user")) &&
        JSON.parse(localStorage.getItem("user")).userId;
      data.username = user.username;
      data.avatar = user.avatar;
      socket.current.emit("user-send-msg", data);
    }
    setMessageText("");
  };

  const onEmojiClick = (object) => {
    let text = messageText + object.emoji;
    setMessageText(text);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
      ? JSON.parse(localStorage.getItem("user"))
      : null;
    if (user !== null) {
      //setUserId(user.userId);
    }
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 13 || e.key === "Enter") {
      handleSendMsg();
    }
  };

  return (
    <Container id="chatBox" ref={chatBoxRef}>
      <Username>
        {/* <Active /> */}
        <Avatar src={userChat && userChat.avatar} />
        <Name>{userChat && userChat.username}</Name>
        <MdCancelPresentation
          onClick={handleMessagesUserClose}
          className="chatbox-hidden"
        />
      </Username>
      <ChatMain ref={scrollRef}>
        {msgs &&
          msgs.msg &&
          msgs.msg.map((item) => {
            const _user = userList?.user?.find(
              (element) => element._id === item.from
            );
            return (
              <MsgContainer
                from={item.from}
                userId={
                  JSON.parse(localStorage.getItem("user")) &&
                  JSON.parse(localStorage.getItem("user")).userId
                }
                key={item._id}
              >
                <img src={_user.avatar} alt="" />
                <MessageItem
                  from={item.from}
                  userId={
                    JSON.parse(localStorage.getItem("user")) &&
                    JSON.parse(localStorage.getItem("user")).userId
                  }
                >
                  {item.content}
                </MessageItem>
              </MsgContainer>
            );
          })}
      </ChatMain>
      <ChatInput>
        {emojiShow && (
          <div className="emoji">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
        <BsEmojiSmile
          onClick={() => setEmojiShow(!emojiShow)}
          style={{ cursor: "pointer" }}
          className="smile-icon"
        />
        <Input
          onKeyDown={handleKeyDown}
          onClick={() => setEmojiShow(false)}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          type="text"
          placeholder="Nh???p tin nh???n c???a b???n ..."
        />
        <Button onClick={handleSendMsg}>
          <AiOutlineSend className="send-icon" />
        </Button>
      </ChatInput>
    </Container>
  );
};

const MessageItem = styled.div`
  width: auto;
  height: auto;
  border-radius: 15px;
  padding: 15px;
  margin-left: 5px;
  margin-right: ${props=>props.from === props.userId && "5px"};
  font-size: 18px;
  border: ${(props) => props.from !== props.userId && "1px solid gray"};
  color: ${(props) => (props.from === props.userId ? "white" : "black")};
  max-width: 50%;
  overflow: hidden;
  word-wrap: break-word;
  background-color: ${(props) =>
    props.from === props.userId ? "blue" : "white"};
`;

const ChatInput = styled.div`
  height: 70px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: absolute;
  bottom: 5px;
  border-top: 0.5px solid gray;
  background-color: #fff;
  .smile-icon {
    font-size: 20px;
  }
  .emoji {
    position: absolute;
    bottom: 70px;
    transform: translateX(-100%);
  }
`;

const Input = styled.input`
  height: 45px;
  width: 55%;
  outline: none;
  border: 0.5px solid gray;
  border-radius: 5px;
  padding: 0 20px;
  font-size: 18px;
`;

const Button = styled.button`
  width: 20%;
  height: 45px;
  color: white;
  background-color: teal;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  .send-icon {
    font-size: 25px;
  }
`;

const ChatMain = styled.div`
  width: 100%;
  height: 80%;
  overflow-y: scroll;
  padding-bottom: 50px;
`;

const MsgContainer = styled.div`
  display: flex;
  align-items: center;
  flex-flow:${props=>props.from === props.userId && "row-reverse"};
  height: auto;
  margin-top: 10px;
  img {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }
`;

const Active = styled.div`
  width: 10px;
  height: 10px;
  background-color: #33c233;
  border-radius: 50%;
  margin-left: 10px;
  margin-top: 10px;
`;

const Username = styled.div`
  width: 100%;
  height: 60px;
  border-bottom: 1px solid #80808063;
  border-radius: 0 0 5px 5px;
  display: flex;
  background-color: #80808022;
  align-items: center;
  position: relative;
  .chatbox-hidden {
    width: 30px;
    height: 30px;
    color: gray;
    position: absolute;
    right: 10px;
    cursor: pointer;
  }
`;

const Avatar = styled.img`
  width: 45px;
  height: 45px;
  object-fit: cover;
  border-radius: 50%;
  margin-left: 10px;
`;

const Name = styled.span`
  font-weight: bold;
  margin-left: 20px;
`;

const Container = styled.div`
  display: none;
  width: 350px;
  height: 50vh;
  background-color: #fff;
  border-radius: 5px 5px 0 0;
  box-shadow: -1px 1px 5px 5px rgb(176, 168, 168);
  position: fixed;
  bottom: 0;
  right: 50px;
`;

export default ChatBox;
