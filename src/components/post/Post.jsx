import React, { useRef, useState } from "react";
import styled from "styled-components";

import { FaGlobeAmericas } from "react-icons/fa";
import { TiMessages } from "react-icons/ti";
import { AiOutlineLike } from "react-icons/ai";
import { RiShareForwardLine } from "react-icons/ri";
import { createLike } from "../redux/slice/likeSlice";
import { useDispatch, useSelector } from "react-redux";
import { BsEmojiSmile } from "react-icons/bs";
import { BsImages } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import { createComment, postDelete,getChildComment } from "../redux/slice/postSlice";
import { dateConvert } from "../../utils/convertTodate";
import { BsThreeDots } from "react-icons/bs";
import { BsArrowReturnRight } from "react-icons/bs";

import { useEffect } from "react";

const Post = ({ postItem, flagBlue }) => {
  const { isLoading } = useSelector((state) => state.like);
  const [likNumber, setLikNumber] = useState(
    postItem && postItem.post.likeNumber
  );
  const [comNumber, setComNumber] = useState(
    postItem && postItem.post.commentNumber
  );
  const [comments, setComments] = useState("");
  const [idComment, setIdComment] = useState("");
  const [iconShow, setIconShow] = useState(false);
  const [iconShowChildrent, setIconShowChildrent] = useState(false);
  const [commentIsResponse, setCommentIsResponse] = useState([]);
  const { postList } = useSelector((state) => state.post);
  const { user } = useSelector((state) => state.user);
  const [childComment,setChildComment] = useState([]); 
  const containerRef = useRef();

  const commentRef = useRef();
  const dispatch = useDispatch();
  const handleCreateLike = (postId) => {
    if (isLoading) return;
    dispatch(createLike(postId));
    if (flagBlue !== undefined) {
      setLikNumber(likNumber - 1);
    } else {
      setLikNumber(likNumber + 1);
    }
  };

  const handleComment = (comment) => {
    setComments(comment);
  };

  const handleKeyDown = (e) => {
    if (e.key === 13 || e.key === "Enter") {
      if (comments === "") return;
      const data = {
        postId: postItem.post._id,
        content: comments,
        time: Date.now().toString(),
      };
      dispatch(createComment(data));
      setComNumber((prev) => prev + 1);
      setComments("");
    }
  };

  const handleShowIcon = () => {
    setIconShow(!iconShow);
  };
  const handleShowIconChildrent = () => {
    setIconShowChildrent(true);
  };

  const onEmojiClick = (object) => {
    let text = comments + object.emoji;
    setComments(text);
  };

  const time = dateConvert(postItem.post.time);

  const handleDeletePost = () => {
    dispatch(postDelete(postItem.post._id));
  };

  const handleResponseComment = (id) => {
    setCommentIsResponse([...commentIsResponse, id]);
    const checkIsClick = commentIsResponse.find((element) => element === id);
    if (!checkIsClick) {
      const inputWraper = document.createElement("div");
      inputWraper.className = "childCommentContainer";
      const inputElement = document.createElement("input");
      inputElement.setAttribute("placeholder", "Bình luận của bạn");
      const avatarUser = document.createElement("img");
      avatarUser.setAttribute("src", user.avatar);
      avatarUser.className = "userAvatar";
      const imgIconSmile = document.createElement("img");
      imgIconSmile.className = "iconSmile";
      imgIconSmile.setAttribute(
        "src",
        "https://i.pinimg.com/originals/12/ba/72/12ba72f0e3f84c4669cd8734d90ab395.png"
      );
      inputWraper.appendChild(avatarUser);
      inputWraper.appendChild(inputElement);
      inputWraper.appendChild(imgIconSmile);
      document.querySelector(`.comment-${id}`).appendChild(inputWraper);
      inputElement.addEventListener("keydown", (e) => {
        if (e.key === 13 || e.key === "Enter") {
          const data = {
            postId: postItem.post._id,
            content: e.target.value,
            parentId:id,
            time: Date.now().toString(),
          };
          dispatch(createComment(data));
          setComNumber((prev) => prev + 1);
          inputElement.value = "";
        }
      });
    }
  };

  const handleGetChildComment = (id)=>{
       const comment = postItem.comment.find(element=>element._id === id); 
       setChildComment(comment.child)
  }
  return (
    <NewItem>
      {postItem.post.userId === user.userId && (
        <div className="post-options">
          <BsThreeDots />
          <ul className="threeDot">
            <li>Ẩn bài viết</li>
            <li>Cập nhật quyền</li>
            <li onClick={handleDeletePost}>Xóa bài viết</li>
          </ul>
        </div>
      )}
      <NewItemHead>
        <Avatar
          width={50}
          height={50}
          src={postItem.user && postItem.user.avatar}
        />
        <Box className="post-username">
          <Text>{postItem.user && postItem.user.username}</Text>
          <span>
            {time}
            <FaGlobeAmericas style={{ marginLeft: "10px" }} />
          </span>
        </Box>
      </NewItemHead>

      <NewItemContent>{postItem.post && postItem.post.content}</NewItemContent>
      <Box>
        {postItem.post.image && (
          <a target="_blank" href={postItem.post && postItem.post.image}>
            <NewItemImage src={postItem.post && postItem.post.image} />
          </a>
        )}
      </Box>
      <Box className="news-count-like">
        <Paragraph>{likNumber} Thích</Paragraph>
        <Box className="news-count-like-right">
          <Paragraph>{comNumber} Bình luận</Paragraph>
          <Paragraph>
            {postItem.post && postItem.post.shareNumber} Chia sẻ
          </Paragraph>
        </Box>
      </Box>
      <Box className="news-hr" />
      <Box className="news-interactive">
        <Box
          style={{ color: flagBlue !== undefined && "blue" }}
          className="news-interactive-item"
        >
          <AiOutlineLike
            onClick={() => handleCreateLike(postItem.post && postItem.post._id)}
          />
          <Space /> Thích
        </Box>
        <Box className="news-interactive-item">
          <TiMessages />
          <Space /> Bình luận
        </Box>
        <Box className="news-interactive-item">
          <RiShareForwardLine />
          <Space /> Chia sẻ
        </Box>
      </Box>
      <Box className="news-hr" />
      <Comment>
        {postItem &&
          postItem.comment &&
          postItem.comment.map((item) => {
            const time = dateConvert(item.time);
            return (
              <OtherComment key={item._id}>
                <AvatarComment
                  width={50}
                  height={50}
                  src={item.ownUser.avatar}
                />
                <Space />
                <Box className={`other-comment comment-${item._id}`}>
                  <Box className="comment-content">
                    <Box style={{ fontWeight: "600" }}>
                      {item.ownUser.username}
                    </Box>
                    <Box>{item.content}</Box>
                  </Box>
                  <Box className="comment-react">
                    <span>Thích</span>
                    <span onClick={() => handleResponseComment(item._id)}>
                      Phản hồi
                    </span>
                    <span>{time}</span>
                  </Box>
                  {item.child?.length > 0 && childComment.length === 0  && (
                    <div className="list-comment-res" onClick={()=>handleGetChildComment(item._id)}>
                      <BsArrowReturnRight />{" "}
                      <span>{item.child?.length} phản hồi</span>
                    </div>
                  )}
                </Box>
              </OtherComment>
            );
          })}

        <MyComment>
          <AvatarComment width={50} height={50} src={user && user.avatar} />
          <FormCommemt onSubmit={(e) => e.preventDefault()}>
            {iconShow && (
              <div className="emoji">
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            )}
            <InputCommemt
              onClick={() => setIconShow(false)}
              onKeyDown={handleKeyDown}
              value={comments}
              onChange={(e) => handleComment(e.target.value)}
              type="text"
              placeholder="Bình luận của bạn"
            />
            <input style={{ display: "none" }} type="file" />
            <BsEmojiSmile onClick={handleShowIcon} className="image" />
            <BsImages className="image" />
          </FormCommemt>
        </MyComment>
      </Comment>
    </NewItem>
  );
};



const ListChildComment = styled.div`
  
`


const Comment = styled.div`
  width: "100%";
`;
const AvatarComment = styled.img`
  border-radius: 50%;
`;
const FormCommemt = styled.form`
  width: 100%;
  display: flex;
  position: relative;
  align-items: center;
  .emoji {
    position: absolute;
    bottom: 50px;
  }
  .image {
    font-size: 25px;
    margin-left: 20px;
    cursor: pointer;
  }
`;
const InputCommemt = styled.input`
  height: 40px;
  border: none;
  outline: none;
  width: 100%;
  background-color: #8080801f;
  padding-left: 10px;
  border-radius: 5px;
  margin-left: 10px;
`;
const MyComment = styled.div`
  display: flex;
  align-items: center;
`;

const MyCommentChildrent = styled.div`
  display: none;
  align-items: center;
`;

const OtherComment = styled.div`
  width: 100%;
  display: flex;
  height: auto;
  margin: 20px 0;
  position: relative;
  .other-comment {
    height: auto;
    .list-comment-res {
      display: flex;
      align-items: center;
      span:hover {
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }
  .userAvatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }

  .childCommentContainer {
    display: flex;
    align-items: center;
    width: 50%;
    margin-top: 5px;
    .iconSmile {
      width: 18px;
      height: 18px;
      margin-left: 20px;
      cursor: pointer;
    }
    input {
      height: 40px;
      border: none;
      outline: none;
      background-color: #8080801f;
      padding-left: 10px;
      border-radius: 5px;
      margin-left: 10px;
    }
  }
  .comment-react {
    font-size: 12px;
    span {
      margin: 0 10px;
      cursor: pointer;
    }
  }
  .comment-content {
    display: flex;
    border-radius: 10px;
    padding: 10px;
    width: auto;
    background-color: #eee;
    flex-direction: column;
  }
`;
const NewItemContent = styled.p`
  margin-top: 20px;
  margin-bottom: 50px;
`;

const NewItemImage = styled.img`
  width: 100%;
  height: 500px;
  margin-top: 20px;
  object-fit: contain;
`;

const Space = styled.div`
  width: 10px;
`;

const Text = styled.h4``;

const Paragraph = styled.p`
  font-size: 15px;
  padding: 5px 0;
`;

const NewItem = styled.div`
  width: 100%;
  height: auto;
  margin-top: 40px;
  border-radius: 5px;
  background-color: white;
  box-shadow: -1px 1px 5px 5px rgb(176, 168, 168);
  -webkit-box-shadow: -1px 1px 5px 5px rgb(176, 168, 168);
  -moz-box-shadow: -1px 1px 5px 5px rgb(176, 168, 168);
  padding: 10px 30px;
  position: relative;
  .post-options {
    position: absolute;
    top: 30px;
    cursor: pointer;
    font-size: 25px;
    right: 20px;
    &:hover .threeDot {
      display: flex;
    }
    .threeDot {
      position: absolute;
      width: 170px;
      font-size: 18px;
      height: 100px;
      border: 1px solid rgb(176, 168, 168);
      border-radius: 5px;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      z-index: 999;
      justify-content: space-around;
      display: none;

      li {
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.5 ease;
        list-style: none;
        &:hover {
          list-style: disc;
          text-decoration: underline;
        }
      }
    }
  }
  .news-interactive {
    display: flex;
    justify-content: space-between;
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
    background-color: #0000003b;
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

const Box = styled.div`
  position: relative;
`;

const Avatar = styled.img`
  border-radius: 50%;
  cursor: pointer;
  object-fit: cover;
`;

export default Post;
