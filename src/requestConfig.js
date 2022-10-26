import axios from "axios";

const baseURL = "http://localhost:5000/api";


export const publicRequest = axios.create({
  baseURL
});


export const userRequest = axios.create({
  baseURL,
  headers: {
    token:`Bearer ${JSON.parse(localStorage.getItem("user"))?.accesstoken}`   
  },
});