import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import {userRegister,resetStateRgs} from '../redux/slice/userSlice'

const Register = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

 const dispatch = useDispatch(); 
  const [passErr, setPassErr] = useState("");
  const {isError} = useSelector(state=>state.user);
  const navigate = useNavigate();

  const onSubmit = async ({ email, password, username, rePassword }) => {
    if (password !== rePassword) {
      setPassErr("(*) Mật khẩu không khớp");
      return;
    }else{
      setPassErr("")
    }
    let avatar = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRl5Q6_xZ46DYo8CxlI7v-NyYi7KGCzG59GcOIU9XOFngbJ0S2te7CnU9vYiGHi5pWyvYk&usqp=CAU"
    dispatch(userRegister({email,password,username,avatar}))
  };

  useEffect(()=>{
        if(isError.message === "register success"){
          dispatch(resetStateRgs()); 
          navigate("/"); 
          alert("Đăng kí tài khoản thành công !");         
            return; 
        }
  },[isError.message])

  return (
    <Container>
      <Title>Read to World's</Title>
      <Shape />
      <Wraper>
        <RightWraper>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <span style={{ color: "red" }}>{isError.message && isError.message === "email is exist" &&"Tài khoản đã tồn tại !"}</span>
            <span style={{ color: "red", marginTop: "10px" }}>
              {errors.email?.type === "required" &&
                "(*) Email không được để trống."}
            </span>
            <span style={{ color: "red", marginTop: "10px" }}>
              {errors.email?.type === "pattern" &&
                "(*) Định dạng email không chính xác"}
            </span>

            <Input
              placeholder="Email của bạn"
              {...register("email", {
                required: true,
                pattern: /^[A-Z0-9 ._%+-]+@[A-Z0-9 .-]+\.[A-Z]{2,}$/i,
              })}
            />

            <span style={{ color: "red", marginTop: "10px" }}>
              {errors.username?.type === "required" &&
                "(*) Vui lòng điền tên của bạn."}
            </span>
            <span style={{ color: "red", marginTop: "10px" }}>
              {errors.username?.type === "minLength" &&
                "(*) Độ dài của tên phải lớn hơn 1 kí tự."}
            </span>
            <Input
              type="text"
              placeholder="Tên của bạn"
              {...register("username", {
                required: true,
                minLength: 2,
              })}
            />

            <span style={{ color: "red", marginTop: "10px" }}>
              {errors.password?.type === "required" &&
                "(*) Vui lòng điền mật khẩu của bạn."}
            </span>
            <span style={{ color: "red", marginTop: "10px" }}>
              {errors.password?.type === "minLength" &&
                "(*) Độ dài của mật khẩu phải lớn hơn 7 kí tự."}
            </span>

            <Input
              type="password"
              placeholder="Mật khẩu của bạn"
              {...register("password", {
                required: true,
                minLength: 8,
              })}
            />
            <span style={{ color: "red", marginTop: "10px" }}>
              {errors.username?.type === "required" &&
                "(*) Vui lòng điền lại mật khẩu của bạn."}
            </span>
            <span style={{ color: "red", marginTop: "10px" }}>
              {errors.username?.type === "minLength" &&
                "(*) Độ dài của mật khẩu phải lớn hơn 7 kí tự."}
            </span>
            <span style={{ color: "red", marginTop: "10px" }}>{passErr}</span>
            <Input
              type="password"
              placeholder="Nhập lại mật khẩu của bạn"
              {...register("rePassword", {
                required: true,
                minLength: 8,
              })}
            />
            <Button type="submit">Đăng Kí</Button>
            <Link className="link link-login" to="/">
              Bạn đã có tài khoản ?
            </Link>
          </Form>
        </RightWraper>
      </Wraper>
    </Container>
  );
};

export default Register;

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: #f0f2f5;
  position: relative;
`;

const Title = styled.h1`
  font-size: 60px;
  font-weight: 800;
  width: 100%;
  height: 30vh;
  display: block;
  background-color: #282a35;
  text-align: center;
  line-height: 30vh;
  color: white;
  clip-path: polygon(0 2%, 0% 100%, 100% 49%);
`;

const Shape = styled.div`
  height: 70vh;
  width: 100%;
  clip-path: polygon(100% 0, 100% 100%, 0 50%);
  background-color: #277bc5b9;
`;

const Form = styled.form`
  width: 100%;
  height: auto;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 50px 20px;
  border-radius: 5px;
  box-shadow: 5px 5px 30px gray;
`;

const Wraper = styled.div`
  height: 30vh;
  width: 70%;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RightWraper = styled.div`
  width: 50%;
`;

const Input = styled.input`
  width: 100%;
  height: 45px;
  padding-left: 10px;
  margin-top: 10px;
  border: 1px solid #8080803b;
  outline: none;
  border-radius: 5px;
`;

const Button = styled.button`
  width: 100%;
  height: 45px;
  margin-top: 10px;
  border: none;
  background-color: orangered;
  font-size: 20px;
  color: white;
  font-weight: 700;
  border-radius: 5px;
  cursor: pointer;
`;

// const Link = styled.a`
//     color: blue;
//     margin-top: 10px;
//     text-decoration: none;
// `
