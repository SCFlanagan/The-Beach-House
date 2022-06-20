import axios from "axios";
import {
  USER_REVIEW_LIST_REQUEST,
  USER_REVIEW_LIST_SUCCESS,
  USER_REVIEW_LIST_FAIL,
  GET_USER_REVIEW_REQUEST,
  GET_USER_REVIEW_SUCCESS,
  GET_USER_REVIEW_FAIL,
} from "../constants/reviewConstants";
import { getUserConfig } from "../constants/universalFunctions";

// List all the reviews a particular user has made, if the user is logged in.
export const listUserReviews = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_REVIEW_LIST_REQUEST });

    const {
      userLogIn: { userInfo },
    } = getState();

    const { data } = await axios.get(
      `/api/users/reviews/`,
      getUserConfig(userInfo)
    );

    dispatch({
      type: USER_REVIEW_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_REVIEW_LIST_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

// Get a single review by the current, logged-in user.
export const getUserReview = (reviewId) => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_USER_REVIEW_REQUEST });

    const {
      userLogIn: { userInfo },
    } = getState();

    const { data } = await axios.get(
      `/api/users/review/${reviewId}`,
      getUserConfig(userInfo)
    );

    dispatch({
      type: GET_USER_REVIEW_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_USER_REVIEW_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};
