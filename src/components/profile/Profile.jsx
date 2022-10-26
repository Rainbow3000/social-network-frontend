import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { MdOutlineSchool } from "react-icons/md";
import { GrLocation } from "react-icons/gr";
import { BsHouse } from "react-icons/bs";
import { AiFillPicture, AiOutlineCamera } from "react-icons/ai";
import { BiSmile } from "react-icons/bi";
import { RiMessengerLine } from "react-icons/ri";
import { MdPersonAddAlt } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import { getPostListByUserId } from "../redux/slice/postSlice";
import { useLocation } from "react-router-dom";
import Post from "../post/Post";
import FormModel from "../formmodel/FormModel";
import axios from "axios";

import {
  getOneUser,
  updateAvatarCover,
  updateUserAvatar,
} from "../redux/slice/userSlice";
const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation(); 
  const path = location.pathname.split("/")[3]; 
  const [avatarCover, setAvatarCover] = useState("");
  const formModelRef = useRef();
  const avatarRef = useRef();
  const [iCoverLoad, setICoverLoad] = useState(false);
  const { postListUser } = useSelector((state) => state.post);
  const { userInfo,user } = useSelector((state) => state.user);
  const fileRef = useRef();
  const [imgPost, setImgPost] = useState("");
  

  const handleShowChangeAvatar = () => {
    avatarRef.current.click();
  };

  const handleUploadImgCover = async (formData) => {
    try {
      setICoverLoad(true);
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/love3000/upload`,
        formData
      );
      if (response.data) {
        return response.data.url;
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleUploadAvatarUser = async (formData) => {
    try {
      setICoverLoad(true);
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/love3000/upload`,
        formData
      );
      if (response.data) {
        return response.data.url;
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleHiddenModel = () => {
    formModelRef.current.style.display = "none";
  };

  useEffect(() => {
    formModelRef.current.style.display = "none";
    dispatch(getOneUser(path));
    dispatch(getPostListByUserId(path))
  }, [path]);

  const handleAvatarCover = () => {
    fileRef.current.click();
  };

  const handleChangeAvatarCover = (e) => {
    const reader = new FileReader();

    reader.readAsDataURL(e.target.files[0]);

    reader.addEventListener("load", async () => {
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      formData.append("upload_preset", "ve93uroy");
      const dataUrl = await handleUploadImgCover(formData);
      if (dataUrl) {
        dispatch(updateAvatarCover(dataUrl));
      }
    });
  };

  const showModelUpdate = () => {
    formModelRef.current.style.display = "flex";
  };

  const handleChangeAvatar = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    console.log("file", file);
    reader.addEventListener("load", async () => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ve93uroy");
      const dataUrl = await handleUploadAvatarUser(formData);
      if (dataUrl) {
        dispatch(updateUserAvatar(dataUrl));
      }
    });
  };


  return (
    <Container>
      <Navbar />
      <CoverImage>
        <AddCoverBtn onClick={handleAvatarCover}>
          <input
            ref={fileRef}
            onChange={handleChangeAvatarCover}
            className="avatar-cover"
            type="file"
          />
          <AiOutlineCamera />
          Đổi ảnh bìa
        </AddCoverBtn>
        {userInfo && userInfo.user && (
          <a href={userInfo && userInfo.user.avatarCover}>
            <img
              className="avatar-cover"
              src={userInfo && userInfo.user.avatarCover}
              alt=""
            />
          </a>
        )}
        <Box className="profile-avatar">
          <Box className="avatar-user">
            <input
              style={{ display: "none" }}
              type="file"
              ref={avatarRef}
              onChange={(e) => handleChangeAvatar(e.target.files[0])}
            />
            <div className="change-avatar" style={{width:"50px",height:"50px",borderRadius:"50%",backgroundColor:"white",display:"flex",justifyContent:"center",alignItems:"center"}}>
              <AiOutlineCamera
                className="change-avatar"
                onClick={handleShowChangeAvatar}
              />
            </div>
            <a target="_blank"  href={userInfo &&userInfo.user && userInfo.user.avatar}>
            <img
              width={180}
              height={180}
              src={userInfo &&userInfo.user && userInfo.user.avatar}
              alt=""
            />
            </a>
          </Box>
          <Text username>
            {userInfo && userInfo.user && userInfo.user.username}
          </Text>
          <ListFriend>
            <span>210 bạn</span>
            {/* <ListItem>
              <img
                width={30}
                height={30}
                src="https://imageio.forbes.com/specials-images/imageserve/62ef76e4a848f9070ad408c4/Harvest-Moon-Rising/960x0.jpg?height=473&width=711&fit=bounds"
                alt=""
              />
            </ListItem>
            <ListItem>
              <img
                width={30}
                height={30}
                src="https://imageio.forbes.com/specials-images/imageserve/62ef76e4a848f9070ad408c4/Harvest-Moon-Rising/960x0.jpg?height=473&width=711&fit=bounds"
                alt=""
              />
            </ListItem>

            <ListItem>
              <img
                width={30}
                height={30}
                src="https://imageio.forbes.com/specials-images/imageserve/62ef76e4a848f9070ad408c4/Harvest-Moon-Rising/960x0.jpg?height=473&width=711&fit=bounds"
                alt=""
              />
            </ListItem> */}
          </ListFriend>
        </Box>
      </CoverImage>
      <ListFeatured>
        <Box className="featured-left">
          <ListFeaturedItem>Bài Viết</ListFeaturedItem>
          <ListFeaturedItem>Giới Thiệu</ListFeaturedItem>
          <ListFeaturedItem>Bạn bè</ListFeaturedItem>
          <ListFeaturedItem>Ảnh</ListFeaturedItem>
          <ListFeaturedItem>Video</ListFeaturedItem>
          <ListFeaturedItem>Check in</ListFeaturedItem>
          <ListFeaturedItem>Xem thêm</ListFeaturedItem>
        </Box>
        <Box className="featured-add-send">
          <AddFriendBtn>
            <MdPersonAddAlt /> Thêm bạn
          </AddFriendBtn>
          <MessageBtn>
            {" "}
            <RiMessengerLine /> Nhắn tin
          </MessageBtn>
        </Box>
      </ListFeatured>
      <Hr />
      <MainProfile>
        <ProfileLeft>
          <ProfileLeftIntroduce>
            <FormModel
              formModelRef={formModelRef}
              handleHiddenModel={handleHiddenModel}
              userInfo={userInfo}
            />
            <IntroductTitle>Giới thiệu</IntroductTitle>
            <IntroduceStory>
              {userInfo && userInfo.user && userInfo.user.profile.story !== ""
                ? userInfo.user && userInfo.user.profile.school
                : "Chưa có"}
            </IntroduceStory>
            <ProfileBtn>Chỉnh sửa tiểu sử</ProfileBtn>
            <IntroduceRow>
              <Text className="introduce-item">
                <MdOutlineSchool />
                <Space />{" "}
                {userInfo && userInfo.user && userInfo.user.profile.school !== ""
                  ? "Học tại " + userInfo.user &&  userInfo.user.profile.school
                  : "Chưa có"}
              </Text>
              <Text className="introduce-item">
                <GrLocation />
                <Space />{" "}
                {userInfo && userInfo.user && userInfo.user.profile.livePlace !== ""
                  ? "Sống tại "+ userInfo.user && userInfo.user.profile.livePlace
                  : "Chưa có"}
              </Text>
              <Text className="introduce-item">
                <BsHouse />
                <Space />{" "}
                {userInfo &&userInfo.user && userInfo.user.profile.homeTown !== ""
                  ? "Đến từ " + userInfo.user && userInfo.user.profile.homeTown
                  : "Chưa có"}
              </Text>
            </IntroduceRow>
            <ProfileBtn onClick={showModelUpdate}>
              Chỉnh sửa chi tiết
            </ProfileBtn>
            <ProfileBtn>Thêm sở thích</ProfileBtn>
            <ProfileBtn>Thêm nội dung đáng chú ý</ProfileBtn>
          </ProfileLeftIntroduce>
          <ListFriendUser>
            <IntroductTitle>Bạn bè</IntroductTitle>
            <FriendArea>
              <FriendItem>
                <FriendAvatar
                  src="https://tapchianhdep.com/wp-content/uploads/2022/03/hinh-anh-nhung-con-meo-dang-yeu-va-de-thuong-nhat.jpg"
                  alt=""
                />
                <FriendName>Văn Đạt</FriendName>
              </FriendItem>
              <FriendItem>
                <FriendAvatar
                  src="https://tapchianhdep.com/wp-content/uploads/2022/03/hinh-anh-nhung-con-meo-dang-yeu-va-de-thuong-nhat.jpg"
                  alt=""
                />
                <FriendName>Văn Đạt</FriendName>
              </FriendItem>
              <FriendItem>
                <FriendAvatar
                  src="https://tapchianhdep.com/wp-content/uploads/2022/03/hinh-anh-nhung-con-meo-dang-yeu-va-de-thuong-nhat.jpg"
                  alt=""
                />
                <FriendName>Văn Đạt</FriendName>
              </FriendItem>
              <FriendItem>
                <FriendAvatar
                  src="https://tapchianhdep.com/wp-content/uploads/2022/03/hinh-anh-nhung-con-meo-dang-yeu-va-de-thuong-nhat.jpg"
                  alt=""
                />
                <FriendName>Văn Đạt</FriendName>
              </FriendItem>
              <FriendItem>
                <FriendAvatar
                  src="https://tapchianhdep.com/wp-content/uploads/2022/03/hinh-anh-nhung-con-meo-dang-yeu-va-de-thuong-nhat.jpg"
                  alt=""
                />
                <FriendName>Văn Đạt</FriendName>
              </FriendItem>
            </FriendArea>
          </ListFriendUser>
        </ProfileLeft>
        <ProfileRight>
          <ProfileRightFeel>
            <Box className="feel-text">
              <UserAvatar
                width={60}
                height={60}
                src={userInfo && userInfo.user && userInfo.user.avatar}
                alt=""
              />
              <Input
                placeholder="Bạn đang nghĩ gì thế ?"
                className="input-feel"
              />
              <BiSmile className="react-icon" />
              <Space />
              <AiFillPicture className="react-icon" />
              <Space />
              <button>Đăng</button>
            </Box>
            <Box className="feel-image">
              <PostImg
                src="https://tapchianhdep.com/wp-content/uploads/2022/03/hinh-anh-nhung-con-meo-dang-yeu-va-de-thuong-nhat.jpg"
                alt=""
              />
            </Box>
          </ProfileRightFeel>
          {postListUser.post &&
            postListUser.post.map((item) => {
              return <Post isProfile key={item._id} postItem={item} />;
            })}
        </ProfileRight>
      </MainProfile>
    </Container>
  );
};

const AddCoverBtn = styled.button`
  width: 220px;
  height: 45px;
  background-color: blue;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  color: white;
  border: none;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
  margin-right: 20px;
  position: absolute;
  z-index: 9999;
  right: 0;
  bottom: 10px;
  .avatar-cover {
    display: none;
  }
`;

const AddFriendBtn = styled.button`
  width: 120px;
  height: 45px;
  background-color: blue;
  border-radius: 5px;
  color: white;
  border: none;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
  margin-right: 20px;
`;
const MessageBtn = styled.button`
  width: 120px;
  height: 45px;
  background-color: gray;
  border-radius: 5px;
  color: white;
  border: none;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
`;

const FriendAvatar = styled.img`
  width: 95%;
  height: 95%;
`;

const FriendName = styled.span``;
const FriendArea = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  height: auto;
  margin-top: 30px;
`;

const FriendItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 30%;
  height: 150px;
  margin: 8px;
  margin-top: 10px;
  padding: 5px;
  border-radius: 5px;
  box-shadow: -1px 1px 5px 5px rgb(176, 168, 168);
`;

const ListFriendUser = styled.div`
  min-height: 500px;
  width: 100%;
  background-color: #ffff;
  box-shadow: -1px 1px 5px 5px rgb(176, 168, 168);
  height: auto;
  margin-top: 30px;
  border-radius: 5px;
`;

const UserAvatar = styled.img`
  width: 80px;
  height: 60px;
  border-radius: 50%;
`;
const PostImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const Space = styled.div`
  width: 20px;
`;

const ProfileRightFeel = styled.div`
  width: 100%;
  margin-top: 20px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 90px;
  height: auto;
  background-color: #fff;
  box-shadow: -1px 1px 5px 5px rgb(176, 168, 168);
  padding: 0 10px;
  .react-icon {
    cursor: pointer;
    font-size: 30px;
  }

  .feel-image {
    width: 100%;
    display: none;
    height: 500px;
    margin-top: 30px;
    border-radius: 5px;
    box-shadow: -1px 1px 5px 5px rgb(176, 168, 168);
    padding: 20px;
    margin-bottom: 20px;
  }
  .input-feel {
    width: 80%;
    height: 45px;
    border-radius: 5px;
    border: none;
    outline: none;
    padding-left: 20px;
  }
  .feel-text {
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    margin-top: 20px;
  }
  button {
    width: 120px;
    height: 45px;
    background-color: blue;
    border-radius: 5px;
    color: white;
    border: none;
    font-size: 16px;
    cursor: pointer;
    font-weight: bold;
  }
`;

const Form = styled.form``;
const Input = styled.input``;

const ProfileBtn = styled.button`
  width: 95%;
  height: 45px;
  cursor: pointer;
  border-radius: 5px;
  border: none;
  background-color: #d8dadf;
  font-size: 14px;
  font-weight: bold;
  margin-top: 20px;
`;

const IntroductTitle = styled.h3`
  position: relative;
  top: 20px;
  left: 20px;
`;

const IntroduceStory = styled.div`
  margin-top: 30px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;
const IntroduceRow = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .introduce-item {
    margin-top: 20px;
    display: flex;
    align-items: center;
  }
`;
const ProfileLeftIntroduce = styled.div`
  width: 100%;
  min-height: 500px;
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  height: auto;
  border-radius: 5px;
  box-shadow: -1px 1px 5px 5px rgb(176, 168, 168);
  margin-top: 20px;
`;

const MainProfile = styled.div`
  width: 70vw;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const ProfileLeft = styled.div`
  width: 40%;
`;
const ProfileRight = styled.div`
  width: 55%;
`;

const Text = styled.span`
  font-weight: ${(props) => props.username && "bold"};
  font-size: ${(props) => props.username && "30px"};
`;

const Container = styled.div`
  width: 100vw;
  height: auto;
  min-height: 100vh;
  padding-bottom: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const CoverImage = styled.div`
  width: 70vw;
  height: 500px;
  position: relative;
  background-color: #f0f2f5;
  border-radius: 0 0 5px 5px;
  .avatar-cover {
    //z-index: -1;
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  // box-shadow: -1px 1px 5px 5px rgb(176, 168, 168);
  .profile-avatar {
    position: absolute;
    bottom: -100px;
    left: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    transform: translateX(-50%);
    img {
      border-radius: 50%;
    }
    .avatar-user {
      position: relative;
      .change-avatar {
        position: absolute;
        font-size: 30px;
        bottom: 10px;
        right: 15px;
        cursor: pointer;
      }
    }
  }
`;

const ListFriend = styled.ul`
  display: flex;
  align-items: center;
`;

const ListItem = styled.li`
  list-style: none;
  margin: 0 5px;
`;

const ListFeatured = styled.ul`
  width: 70vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 120px;
  height: 95px;
  border-top: 1px solid #8080806f;
  .featured-left {
    display: flex;
    align-items: center;
  }
  .featured-add-send {
    display: none;
  }
`;

const Hr = styled.div`
  width: 100vw;
  height: 3px;
  background-color: #8080806f;
`;

const ListFeaturedItem = styled.li`
  list-style: none;
  color: gray;
  font-weight: 600;
  margin-right: 35px;
  cursor: pointer;
`;

const Box = styled.div``;

export default Profile;
