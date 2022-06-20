import {
  FAVORITE_LIST_REQUEST,
  FAVORITE_LIST_SUCCESS,
  FAVORITE_LIST_FAIL,
  ADD_FAVORITE_LIST,
  REMOVE_FAVORITE_LIST,
} from "../constants/favoriteListConstants";

export const favoriteListReducer = (state = { favorites: [] }, action) => {
  switch (action.type) {
    case FAVORITE_LIST_REQUEST:
      return { loading: true, favorites: [] };
    case FAVORITE_LIST_SUCCESS:
      return { loading: false, favorites: action.payload };
    case FAVORITE_LIST_FAIL:
      return { loading: false, error: action.payload };
    case ADD_FAVORITE_LIST:
      return { favorites: action.payload };
    case REMOVE_FAVORITE_LIST:
      return { favorites: action.payload };
    default:
      return state;
  }
};
