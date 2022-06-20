import axios from "axios";
import {
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_FAIL,
  GET_ORDER_INFO,
  SET_ORDER_INFO,
} from "../constants/orderConstants";
import { getUserConfig } from "../constants/universalFunctions";

// Get a list of all a user's orders, if they are logged in.
export const getOrderList = () => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_LIST_REQUEST });

    const {
      userLogIn: { userInfo },
    } = getState();

    const { data } = await axios.get(`/api/orders/`, getUserConfig(userInfo));

    dispatch({
      type: ORDER_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ORDER_LIST_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

// Get the details of a single order made by the current, logged-in user.
export const getOrderDetails = (orderId) => async (dispatch, getState) => {
  const {
    userLogIn: { userInfo },
  } = getState();

  const { data } = await axios.get(
    `/api/orders/${orderId}/`,
    getUserConfig(userInfo)
  );
  dispatch({
    type: GET_ORDER_INFO,
    payload: data,
  });
};

export const setOrderInfo = (orderInfo) => (dispatch) => {
  dispatch({ type: SET_ORDER_INFO, payload: orderInfo });
};
