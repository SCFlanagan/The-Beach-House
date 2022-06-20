import {
  GET_CART_REQUEST,
  GET_CART_SUCCESS,
  GET_CART_FAIL,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_QUANTITY,
  EMPTY_CART,
  UPDATE_CART,
} from "../constants/cartConstants";

export const cartReducer = (state = { cart: {}, cartItems: [] }, action) => {
  switch (action.type) {
    case GET_CART_REQUEST:
      return { loading: true, cartItems: [] };
    case GET_CART_SUCCESS:
      return {
        loading: false,
        cartItems: action.payload.cartItems,
        cart: action.payload.cart,
      };
    case GET_CART_FAIL:
      return { loading: false, error: action.payload };
    case ADD_TO_CART:
      return { cartItems: action.payload.cartItems, cart: action.payload.cart };
    case REMOVE_FROM_CART:
      return { cartItems: action.payload.cartItems, cart: action.payload.cart };
    case UPDATE_QUANTITY:
      return { cartItems: action.payload.cartItems, cart: action.payload.cart };
    case UPDATE_CART:
      return {
        cartItems: action.payload.cartItems,
        cart: action.payload.cart,
      };
    case EMPTY_CART:
      return { cartItems: [], cart: { subtotal: 0, sales_tax: 0, total: 0 } };
    default:
      return state;
  }
};
