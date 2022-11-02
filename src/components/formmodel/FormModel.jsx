import React,{useEffect, useState} from "react";
import styled from "styled-components";
import {MdOutlineCancelPresentation} from 'react-icons/md'
import {updateUserProfile} from '../redux/slice/userSlice'
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";


const FormModel = ({formModelRef,handleHiddenModel,userInfo}) => {
    const [school,setSchool] = useState("")
    const [livePlace,setLivePlace] = useState("")
    const [homeTown,setHomeTown] = useState("")
    const [errModel,setErrModel] = useState("")
    const dispatch = useDispatch(); 
    const navigate = useNavigate(); 
    const handleUpdateInfoUser = ()=>{
        if(school === "" && livePlace === "" && homeTown === ""){
             setErrModel("Không được để trống hết các ô !"); 
             return; 
        }
        const data = {
            school,
            livePlace,
            homeTown
        }
        dispatch(updateUserProfile(data))
        setSchool(""); 
        setLivePlace(""); 
        setHomeTown("");
        handleHiddenModel(); 
    }

    return (
    <Container ref={formModelRef}>
        <MdOutlineCancelPresentation className="cancel" onClick={handleHiddenModel}/>
        <span style={{color:"red"}}>{errModel}</span>
        <Input value={school} type="text" placeholder="Học vấn của bạn" onChange={(e)=>setSchool(e.target.value)}/>
        <Input value={livePlace} type="text" placeholder="Nơi bạn sinh sống" onChange={(e)=>setLivePlace(e.target.value)}/>
        <Input value={homeTown} type="text" placeholder="Quê quán của bạn" onChange={(e)=>setHomeTown(e.target.value)}/>
      <button onClick={handleUpdateInfoUser}>Cập nhật</button>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: auto;
  padding: 50px 0;
  position: absolute;
  transform: translateX(80%);
  top: 0;
  z-index: 99999999999;
  box-shadow: -1px 1px 5px 5px rgb(176, 168, 168);
  background-color: #FFF;
  display: flex;
  flex-direction: column;
  width: 50vw;
  align-items: center;
  border-radius: 5px;
  .cancel{
    position: absolute;
    right: 10px;
    top: 10px;
    color: gray;
    font-size: 30px;
    cursor: pointer;
  }
  button{
    width: 50%;
    height: 45px;
    margin-top: 20px;
    font-size: 20px;
    background-color: blue;
    border: none;
    border-radius: 5px;
    color: white;
    cursor: pointer;
  }
`;

const Input = styled.input`
  width: 95%;
  height: 45px;
  margin-top: 20px;
  border-radius: 5px;
  outline: none;
  padding-left: 20px;
  border: 0.5px solid gray;
`;

export default FormModel;
