import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { userLogin } from "../redux/slice/userSlice";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
const Login = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError } = useSelector((state) => state.user);

  useEffect(() => {
    const userExist = localStorage.getItem("user");
    if (userExist) {
      navigate("/home");
    }
  }, [user && user.userId, navigate]);

  const onSubmit = ({ email, password }) => {
    if (!errors.email && !errors.message) {
      dispatch(userLogin({ email, password }));
    }
  };

  return (
    <Container>
      <Title>Read to World's</Title>
      <Shape />
      <Wraper>
        <RightWraper>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <span style={{ color: "red" }}>
              {errors.email?.type === "required" &&
                "(*) Vui lòng điền email vào ô trống!"}
            </span>
            <span style={{ color: "red" }}>
              {errors.email?.type === "pattern" &&
                "(*) Định dạng email không chính xác"}
            </span>
            <span style={{ color: "red" }}>
              {" "}
              {isError.message &&
                isError.message === "user not exist !" &&
                "(*) Tài khoản không tồn tại !"}
            </span>
            <Input
              style={{ border: errors.email && "1px solid red" }}
              {...register("email", {
                required: true,
                pattern: /^[A-Z0-9 ._%+-]+@[A-Z0-9 .-]+\.[A-Z]{2,}$/i,
              })}
              placeholder="Email của bạn"
            />

            <span style={{ color: "red", marginTop: "20px" }}>
              {errors.password?.type === "required" &&
                "(*) Mật khẩu không được để trống"}
            </span>
            <span style={{ color: "red" }}>
              {errors.password?.type === "minLength" &&
                "(*) Độ dài mật khẩu phải lớn hơn 8 kí tự"}
            </span>

            <span style={{ color: "red" }}>
              {isError.message &&
                isError.message === "password incorrect !" &&
                "Mật khẩu không chính xác !"}
            </span>
            <Input
              style={{
                border: errors.password && "1px solid red",
              }}
              {...register("password", { required: true, minLength: 8 })}
              type="password"
              placeholder="Mật khẩu của bạn"
            />
            <Button
              type="submit"
              isLoad={isLoading === true ? "true" : "false"}
            >
              Đăng nhập
            </Button>
            <Link
              style={{ textDecoration: "underline" }}
              className="link link-forget-pass"
              href="#"
            >
              Quên mật khẩu ?
            </Link>
            <Hr />
            <span>Hoặc</span>
            <ButtonCreateAccount>
              <Link className="link link-create-account" to="/register">
                Tạo tài khoản mới
              </Link>
            </ButtonCreateAccount>
          </Form>
        </RightWraper>
      </Wraper>
    </Container>
  );
};

export default Login;

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
  align-items: flex-start;
  flex-direction: column;
  padding: 50px 20px;
  border-radius: 5px;
  box-shadow: 5px 5px 30px gray;
`;

const Wraper = styled.div`
  height: 30vh;
  width: 25%;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Text = styled.p`
  margin-bottom: 10px;
  font-size: 20px;
`;

const LastUser = styled.div`
  width: 200px;
  height: 250px;
  background-color: #ffff;
  border-radius: 5px;
  box-shadow: 5px 5px 30px gray;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
  cursor: pointer;
`;

const UserAvatar = styled.img`
  width: 100%;
  height: 80%;
  border-radius: 5px 5px 0 0;
`;
const UserName = styled.h3``;

const WebName = styled.h1`
  font-weight: 800;
  display: flex;
  margin-bottom: 20px;
  font-size: 45px;
`;

const LeftWraper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const RightWraper = styled.div`
  flex: 1;
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
  background-color: ${(props) =>
    props.isLoad === "true" ? "#ebb434" : "orangered"};
  font-size: 20px;
  color: white;
  font-weight: 700;
  cursor: ${(props) => (props.isLoad === "true" ? "not-allowed" : "pointer")};
  border-radius: 5px;
`;
const ButtonCreateAccount = styled(Button)`
  background-color: #36a420;
  width: auto;
  min-width:50%;
  margin-top: 20px;
  padding: 5px;
`;
const Hr = styled.hr`
  width: 90%;
  height: 1px;
  margin-top: 10px;
`;
