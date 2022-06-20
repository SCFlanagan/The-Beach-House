import axios from "axios";
import {
  FAVORITE_LIST_REQUEST,
  FAVORITE_LIST_SUCCESS,
  FAVORITE_LIST_FAIL,
  ADD_FAVORITE_LIST,
  REMOVE_FAVORITE_LIST,
} from "../constants/favoriteListConstants";
import { getUserConfig } from "../constants/universalFunctions";

// Get a user's favorite list if they are logged in.
export const getFavoriteList = () => async (dispatch, getState) => {
  try {
    dispatch({ type: FAVORITE_LIST_REQUEST });

    const {
      userLogIn: { userInfo },
    } = getState();

    const { data } = await axios.get(
      "/api/favoritelists/",
      getUserConfig(userInfo)
    );

    dispatch({
      type: FAVORITE_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FAVORITE_LIST_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

// Add to a user's favorite list, if they are logged in.
export const addToFavoriteList = (productId) => async (dispatch, getState) => {
  const {
    userLogIn: { userInfo },
  } = getState();

  const { data } = await axios.post(
    "/api/favoritelists/add/",
    {
      product_id: productId,
    },
    getUserConfig(userInfo)
  );

  dispatch({
    type: ADD_FAVORITE_LIST,
    payload: data,
  });
};

// Remove an item from a user's favorite list, if they are logged in.
export const removeFromFavoriteList =
  (productId) => async (dispatch, getState) => {
    const {
      userLogIn: { userInfo },
    } = getState();

    const { data } = await axios.delete(
      `/api/favoritelists/${productId}/remove/`,
      getUserConfig(userInfo)
    );

    dispatch({
      type: REMOVE_FAVORITE_LIST,
      payload: data,
    });
  };
