import axios from "axios";
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_SIGNUP_REQUEST,
  USER_SIGNUP_SUCCESS,
  USER_SIGNUP_FAIL,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAIL,
  GET_USER_INFO,
} from "../constants/userConstants";
import { getUserConfig } from "../constants/universalFunctions";

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST,
    });

    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/api/users/login/",
      {
        username: email,
        password: password,
      },
      config
    );

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("userInfo");
  dispatch({
    type: USER_LOGOUT,
  });
};

export const signup =
  (firstName, lastName, email, password) => async (dispatch) => {
    try {
      dispatch({
        type: USER_SIGNUP_REQUEST,
      });

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/users/signup/",
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
        },
        config
      );

      dispatch({
        type: USER_SIGNUP_SUCCESS,
        payload: data,
      });

      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: data,
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
      dispatch({
        type: USER_SIGNUP_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };

export const updateUser = (updates) => async (dispatch, getState) => {
  const {
    userLogIn: { userInfo },
  } = getState();

  if (userInfo && Object.keys(userInfo).length) {
    try {
      dispatch({
        type: UPDATE_USER_REQUEST,
      });

      const userUpdates = {
        first_name: false,
        last_name: false,
        email: false,
      };

      const keys = Object.keys(updates);
      keys.forEach((key) => {
        if (updates[key]) {
          userUpdates[key] = updates[key];
        }
      });

      const { data } = await axios.put(
        `/api/users/update/`,
        userUpdates,
        getUserConfig(userInfo)
      );

      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: data,
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
      dispatch({
        type: UPDATE_USER_FAIL,
        payload:
          error.response && error.response.data
            ? error.response.data
            : error.message,
      });
    }
  }
};

export const getUserInfo = () => async (dispatch, getState) => {
  const {
    userLogIn: { userInfo },
  } = getState();

  if (userInfo && Object.keys(userInfo).length) {
    const { data } = await axios.get(
      `/api/users/getuserinfo/`,
      getUserConfig(userInfo)
    );

    dispatch({
      type: GET_USER_INFO,
      payload: data,
    });
  }
};
