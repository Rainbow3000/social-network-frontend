import React, { useRef } from "react";
import styled from "styled-components";
import { AiOutlineUsergroupAdd, AiOutlineMessage } from "react-icons/ai";
import { BiBell } from "react-icons/bi";
import { useNavigate,useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import {useSelector,useDispatch} from "react-redux"
import { HiOutlineHome } from "react-icons/hi";
import { MdCancelPresentation } from "react-icons/md";
import {userLogout} from "../redux/slice/userSlice"
import {ImFilm} from 'react-icons/im'
import {BsCart4} from 'react-icons/bs'
import {getListUserByUsername} from '../redux/slice/userSlice'
const Navbar = () => {
  const navigate = useNavigate();
  const accountRef = useRef();
  const location = useLocation(); 
  const path = location.pathname.split('/')[1];
  const dispatch = useDispatch(); 
  const formRef = useRef(); 
  const {user,_userList} = useSelector(state=>state.user)
  const handleLogout = () => {
      dispatch(userLogout());
      navigate('/') 
  };

  const handleShowAccountSettings = () => {
    accountRef.current.style.display = "block";
  };

  const handleCloseOptions = () => {
    accountRef.current.style.display = "none";
  };

  const handleInputChange = (e)=>{
      formRef.current.style.display = "block"
      dispatch(getListUserByUsername(e.target.value))
  }

  const handleOnMouseLeave = ()=>{
    formRef.current.style.display = "none"
  }

  const handleOnMouseEnter= ()=>{
    formRef.current.style.display = "block"
  }

  return (
    <Container>
      <NavbarLeft>
        <Box className="navbar-left">
          <Logo className="navbar-left-logo">1906</Logo>
          <Brand className="navbar-left-brand">Diary's</Brand>
        </Box>
        <Form >
          <Input  onMouseEnter={handleOnMouseEnter} style={{minWidth:"120px"}}  type="text" placeholder="Tìm bạn bè..." onChange={handleInputChange} />
          <ModelListUser onMouseLeave={handleOnMouseLeave} ref={formRef} >
              {
                _userList && _userList.length !== 0 ? _userList.map(item=>{
                  return <Box key={item._id} className="f_user">
                      <img width={30} height={30} src= {item.avatar} alt ="" />
                      <span>{item.username}</span>
                  </Box>
                }) : <Box style={{width:"100%",height:"100%",display:"flex",justifyContent:'center',alignItems:'center',color:"gray"}} ><span>Kết quả tìm kiếm ...</span></Box>
              }
          </ModelListUser>
        </Form>
      </NavbarLeft>

      <NavbarCenter>
        <Box className="navbar-center-icon-home-container active">
          <Link className="link" to="/home">
            <HiOutlineHome color = {path === "home" ? "blue" :"gray"} className="navbar-center-icon navbar-center-icon-home" />
          </Link>
        </Box>
        <Box className="navbar-center-icon-home-container">
          <ImFilm  className="navbar-center-icon navbar-center-icon-friend" />
        </Box>
        <Box className="navbar-center-icon-home-container">
          <AiOutlineUsergroupAdd  className="navbar-center-icon navbar-center-icon-friend" />
        </Box>
        <Box className="navbar-center-icon-home-container">
          <BsCart4  className="navbar-center-icon navbar-center-icon-friend" />
        </Box>
      </NavbarCenter>

      <NavbarRight>
        <AiOutlineMessage className="navbar-right-icon" />
        <BiBell className="navbar-right-icon" />
        <Box className="navbar-right-icon">
          <Avatar
            onClick={handleShowAccountSettings}
            width={50}
            height={50}
            src={user && user.avatar}
          />
          <NavbarRightAccount ref={accountRef}>
            <MdCancelPresentation
              onClick={handleCloseOptions}
              className="close-options-icon"
            />
            <Box className="account-option">Settings</Box>
            <Box onClick={handleLogout} className="account-option">
              Logout
            </Box>
          </NavbarRightAccount>
        </Box>
      </NavbarRight>
    </Container>
  );
};

const ModelListUser = styled.div`
  width: 20vw;
  min-height: 120px;
  margin-top: 15px;
  height: auto;
  display: none;
  position: absolute;
  background-color: #FFF;
  border: 3px solid #80808045;
  border-radius:5px;
  padding: 20px;
  left: 150px;
  .f_user{
    margin-top: 5px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background-color: #8080808d;
    border-radius: 5px;
    padding: 5px;
    color: white;
    cursor: pointer;
    &:hover{
      background-color: gray;
    }
    img{
      border-radius: 50%;
      margin-right: 10px;
    }
  }
`

const NavbarRightAccount = styled.div`
  width: 200px;
  height: 200px;
  background-color: #fff;
  box-shadow: -1px 1px 5px 5px rgb(176, 168, 168);
  position: absolute;
  bottom: -200px;
  border-radius: 5px;
  display: none;
  right: 0;
  .close-options-icon {
    position: absolute;
    top: 5px;
    right: 10px;
    color: gray;
    cursor: pointer;
  }
  .account-option {
    width: 100%;
    height: 45px;
    font-size: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease-in;
    &:hover {
      background-color: #3333337a;
      color: white;
    }
  }
`;

const Container = styled.div`
  width: 100vw;
  height: 70px;
  background-color: white;
  box-shadow: -1px 1px 5px 5px rgb(176, 168, 168);
  -webkit-box-shadow: -1px 1px 5px 5px rgb(176, 168, 168);
  -moz-box-shadow: -1px 1px 5px 5px rgb(176, 168, 168);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  position: fixed;
  top: 0;
  z-index: 99;
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
  position: relative;
  .navbar-right-icon {
    font-size: 25px;
    margin: 0 20px;
    cursor: pointer;
    &:hover{
      color: orangered;
    }
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
    font-weight: 100;
    cursor: pointer;
    color: gray;
    &:hover{
      color: orangered;
    }
  }
  .navbar-center-icon-home-container {
    height: 100%;
    width: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover{
      color: orangered;
    }
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

export default Navbar;
