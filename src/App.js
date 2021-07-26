import logo from "./logo.svg";
import "./App.css";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

function App() {
  const [user, setUser] = useState({});

  const refresh = async (refreshToken) => {
    try {
      console.log("refreshing token");

      const { data } = await axios.post("http://localhost:3000/auth/refresh", {
        token: refreshToken,
      });
      return { ...data };
    } catch (error) {
      console.log(error.toString());
    }
  };
  const requestLogin = (e) => {};
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    console.log(user);
  };
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post("http://localhost:3000/auth/login", {
        ...user,
      });
      const { token, refreshToken } = data;
      Cookies.set("access", token);
      Cookies.set("refresh", refreshToken);
    } catch (error) {}
  };
  const hasAccess = async (accessToken, refreshToken) => {
    if (!refreshToken) return null;

    if (accessToken === undefined) {
      //generate new accessToken
      accessToken = await refresh(refreshToken);
    }

    return accessToken;
  };
  const protect = async (e) => {
    let accessToken = Cookies.get("access");
    let refreshToken = Cookies.get("refresh");

    accessToken = await hasAccess(accessToken, refreshToken);
    if (!accessToken) {
      //message say login again
    } else {
      await requestLogin(accessToken, refreshToken);
    }
  };
  return (
    <div className="App">
      <form action="" onChange={handleChange} onSubmit={handleSubmit}>
        <input name="username" type="text" placeholder="username" />
        <br />
        <br />
        <input name="password" type="password" placeholder="password" />
        <br />
        <br />
        <input type="submit" value="login" />
      </form>
      <button>Access Protected Content</button>
    </div>
  );
}

export default App;
