import axios from "axios";
import {
  CATEGORY_LIST_REQUEST,
  CATEGORY_LIST_SUCCESS,
  CATEGORY_LIST_FAIL,
  SALE_LIST_REQUEST,
  SALE_LIST_SUCCESS,
  SALE_LIST_FAIL,
  PRODUCT_DETAIL_REQUEST,
  PRODUCT_DETAIL_SUCCESS,
  PRODUCT_DETAIL_FAIL,
  EMPTY_PRODUCT_DETAIL,
} from "../constants/productConstants";

// List all products of a given category.
export const listCategoryProducts = (category) => async (dispatch) => {
  try {
    dispatch({ type: CATEGORY_LIST_REQUEST });

    const { data } = await axios.get(`/api/products/category/${category}/`);

    dispatch({
      type: CATEGORY_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CATEGORY_LIST_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

// List all products that are on sale.
export const listSaleProducts = () => async (dispatch) => {
  try {
    dispatch({ type: SALE_LIST_REQUEST });

    const { data } = await axios.get("/api/products/sale/");

    dispatch({
      type: SALE_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SALE_LIST_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

// List the details of a product given the product ID.
export const listProductDetails = (productId) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAIL_REQUEST });

    const { data } = await axios.get(`/api/products/${productId}/`);

    dispatch({
      type: PRODUCT_DETAIL_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAIL_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const emptyProductDetails = () => (dispatch) => {
  dispatch({ type: EMPTY_PRODUCT_DETAIL });
};
