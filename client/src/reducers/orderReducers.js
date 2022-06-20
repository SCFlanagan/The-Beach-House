import {
  SET_ORDER_INFO,
  GET_ORDER_INFO,
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_FAIL,
} from "../constants/orderConstants";

export const orderDetailsReducer = (state = { orderInfo: {} }, action) => {
  switch (action.type) {
    case SET_ORDER_INFO:
      return {
        order: action.payload.order,
        orderItems: action.payload.order_items,
      };
    case GET_ORDER_INFO:
      return {
        order: action.payload.order,
        orderItems: action.payload.order_items,
      };
    default:
      return state;
  }
};

export const orderListReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case ORDER_LIST_REQUEST:
      return { loading: true, orders: [] };
    case ORDER_LIST_SUCCESS:
      return { loading: false, orders: action.payload };
    case ORDER_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
