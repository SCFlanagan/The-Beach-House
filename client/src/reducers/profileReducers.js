import {
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAIL,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
} from "../constants/profileConstants";

export const profileReducer = (state = { profile: {} }, action) => {
  switch (action.type) {
    case GET_PROFILE_REQUEST:
      return { loading: true, profile: [] };
    case GET_PROFILE_SUCCESS:
      return { loading: false, profile: action.payload };
    case GET_PROFILE_FAIL:
      return { loading: false, error: action.payload };
    case UPDATE_PROFILE_SUCCESS:
      return { profile: action.payload };
    case UPDATE_PROFILE_FAIL:
      return { error: action.payload };
    default:
      return state;
  }
};
