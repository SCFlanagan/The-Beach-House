import { configureStore } from "@reduxjs/toolkit";
import {
  categoryListReducer,
  saleListReducer,
  productDetailsReducer,
} from "./reducers/productReducers";
import { cartReducer } from "./reducers/cartReducers";
import {
  updateUserReducer,
  userLogInReducer,
  userSignUpReducer,
} from "./reducers/userReducers";
import {
  userReviewListReducer,
  userReviewReducer,
} from "./reducers/reviewReducers";
import { favoriteListReducer } from "./reducers/favoriteListReducer";
import {
  orderDetailsReducer,
  orderListReducer,
} from "./reducers/orderReducers";
import { profileReducer } from "./reducers/profileReducers";

const reducer = {
  categoryList: categoryListReducer,
  saleList: saleListReducer,
  productDetails: productDetailsReducer,
  userCart: cartReducer,
  favoriteList: favoriteListReducer,
  userReviewList: userReviewListReducer,
  userLogIn: userLogInReducer,
  userSignUp: userSignUpReducer,
  userReview: userReviewReducer,
  orderDetails: orderDetailsReducer,
  orderList: orderListReducer,
  userProfile: profileReducer,
  updatedUser: updateUserReducer,
};

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : {};

const cartFromStorage = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { subtotal: 0, sales_tax: 0, total: 0 };

const cartItemsFromStorage = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

const preloadedState = {
  userCart: { cart: cartFromStorage, cartItems: cartItemsFromStorage },
  userLogIn: { userInfo: userInfoFromStorage },
};

const store = configureStore({
  reducer,
  preloadedState,
});

export default store;
