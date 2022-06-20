import axios from "axios";
import {
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAIL,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
} from "../constants/profileConstants";
import { getUserConfig } from "../constants/universalFunctions";

// Get a user's profile, if logged in.
export const getProfile = () => async (dispatch, getState) => {
  dispatch({ type: GET_PROFILE_REQUEST });

  const {
    userLogIn: { userInfo },
  } = getState();

  if (userInfo && Object.keys(userInfo).length) {
    try {
      const { data } = await axios.get(
        `/api/profile/`,
        getUserConfig(userInfo)
      );

      dispatch({
        type: GET_PROFILE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: GET_PROFILE_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  }
};

// Update a user's profile if they are logged in.
export const updateProfile = (profileInfo) => async (dispatch, getState) => {
  const {
    userLogIn: { userInfo },
  } = getState();

  if (userInfo && Object.keys(userInfo).length) {
    try {
      const updates = {
        dob_month: "$$##$$",
        dob_day: "$$##$$",
        phone: "$$##$$",
        address_1: "$$##$$",
        address_2: "$$##$$",
        address_city: "$$##$$",
        address_state: "$$##$$",
        address_zip: "$$##$$",
      };
      const keys = Object.keys(profileInfo);
      keys.forEach((key) => {
        updates[key] = profileInfo[key];
      });

      const { data } = await axios.put(
        `/api/profile/update/`,
        updates,
        getUserConfig(userInfo)
      );

      dispatch({
        type: UPDATE_PROFILE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: UPDATE_PROFILE_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  }
};
