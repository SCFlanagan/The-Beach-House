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

export const categoryListReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case CATEGORY_LIST_REQUEST:
      return { loading: true, products: [] };
    case CATEGORY_LIST_SUCCESS:
      return { loading: false, products: action.payload };
    case CATEGORY_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const saleListReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case SALE_LIST_REQUEST:
      return { loading: true, products: [] };
    case SALE_LIST_SUCCESS:
      return { loading: false, products: action.payload };
    case SALE_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const productDetailsReducer = (
  state = { product: { reviews: [] } },
  action
) => {
  switch (action.type) {
    case PRODUCT_DETAIL_REQUEST:
      return { loading: true, ...state };
    case PRODUCT_DETAIL_SUCCESS:
      return {
        loading: false,
        product: {
          name: action.payload.product.name,
          description: action.payload.product.description,
          price: action.payload.product.price,
          num_stock: action.payload.product.num_stock,
          image: action.payload.product.image,
          category: action.payload.product.category,
          avg_rating: action.payload.product.avg_rating,
          num_reviews: action.payload.product.num_reviews,
          on_sale: action.payload.product.on_sale,
          sale_price: action.payload.product.sale_price,
          featured: action.payload.product.featured,
          date_created: action.payload.product.date_created,
          reviews: action.payload.reviews,
          colors: action.payload.colors,
        },
      };
    case PRODUCT_DETAIL_FAIL:
      return { loading: false, error: action.payload };
    case EMPTY_PRODUCT_DETAIL:
      return { product: { reviews: [] } };
    default:
      return state;
  }
};
