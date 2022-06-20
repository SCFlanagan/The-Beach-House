import {
  USER_REVIEW_LIST_REQUEST,
  USER_REVIEW_LIST_SUCCESS,
  USER_REVIEW_LIST_FAIL,
  GET_USER_REVIEW_REQUEST,
  GET_USER_REVIEW_SUCCESS,
  GET_USER_REVIEW_FAIL,
} from "../constants/reviewConstants";

export const userReviewListReducer = (state = { reviews: [] }, action) => {
  switch (action.type) {
    case USER_REVIEW_LIST_REQUEST:
      return { loading: true, reviews: [] };
    case USER_REVIEW_LIST_SUCCESS:
      return { loading: false, reviews: action.payload };
    case USER_REVIEW_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userReviewReducer = (state = { review: {} }, action) => {
  switch (action.type) {
    case GET_USER_REVIEW_REQUEST:
      return { loading: true };
    case GET_USER_REVIEW_SUCCESS:
      return { loading: false, review: action.payload };
    case GET_USER_REVIEW_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
