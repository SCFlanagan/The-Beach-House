import axios from "axios";
import {
  GET_CART_REQUEST,
  GET_CART_SUCCESS,
  GET_CART_FAIL,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_QUANTITY,
  UPDATE_CART,
  EMPTY_CART,
} from "../constants/cartConstants";
import { getUserConfig } from "../constants/universalFunctions";

export const getCart = () => async (dispatch, getState) => {
  const {
    userLogIn: { userInfo },
  } = getState();

  // If user is logged in, get the user's cart from the database.
  if (userInfo && Object.keys(userInfo).length) {
    try {
      dispatch({ type: GET_CART_REQUEST });

      const { data } = await axios.get(`/api/cart/`, getUserConfig(userInfo));

      dispatch({
        type: GET_CART_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: GET_CART_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  }
};

export const addToCart =
  (productId, qty, selectedColorId) => async (dispatch, getState) => {
    const {
      userLogIn: { userInfo },
    } = getState();

    // If user is logged in, get user's cart from database.
    if (userInfo && Object.keys(userInfo).length) {
      const { data } = await axios.post(
        "/api/cart/add/",
        {
          product_id: productId,
          qty,
          product_color_id: selectedColorId,
        },
        getUserConfig(userInfo)
      );

      dispatch({
        type: ADD_TO_CART,
        payload: data,
      });
    } else {
      const {
        userCart: { cart, cartItems },
      } = getState();
      let cartMod = { ...cart };
      let price;

      let productData = await axios.get(`/api/products/${productId}/`);
      productData = productData.data;

      let subtotal, cartItemsMod, foundItem, tax, total, item, newQty;

      // If the product has a color option selected:
      if (selectedColorId) {
        let productColorData = await axios.get(
          `/api/products/productcolors/${selectedColorId}`
        );
        productColorData = productColorData.data;

        // If item is already in cart, change the quantity.
        foundItem = false;
        subtotal = 0;
        cartItemsMod = cartItems.map((item) => {
          price = item.product.on_sale
            ? item.product.sale_price
            : item.product.price;

          if (
            item.product.id === Number(productId) &&
            item.product_color.id === Number(selectedColorId)
          ) {
            newQty = Number(item.qty) + Number(qty);
            subtotal += Number(price) * newQty;
            foundItem = true;
            return {
              product: item.product,
              product_color: productColorData,
              qty: newQty,
            };
          } else {
            subtotal += Number(price) * Number(item.qty);
            return item;
          }
        });

        // If item is not in cart, add it to the cart.
        if (!foundItem) {
          price = productData.product.on_sale
            ? Number(productData.product.sale_price)
            : Number(productData.product.price);
          subtotal += price;
          item = {
            product: productData.product,
            product_color: productColorData,
            qty: Number(qty),
          };
          cartItemsMod.push(item);
        }
      } else {
        // If item does not have a color option selected:
        // If the item is in the cart, change the quantity.
        foundItem = false;
        subtotal = 0;
        cartItemsMod = cartItems.map((item) => {
          price = item.product.on_sale
            ? item.product.sale_price
            : item.product.price;
          if (item.product.id === Number(productId)) {
            newQty = Number(item.qty) + Number(qty);
            subtotal += Number(price) * newQty;
            foundItem = true;
            return {
              product: item.product,
              qty: newQty,
            };
          } else {
            subtotal += Number(price) * Number(item.qty);
            return item;
          }
        });

        // If the item is not in the cart, add it.
        if (!foundItem) {
          price = productData.product.on_sale
            ? Number(productData.product.sale_price)
            : Number(productData.product.price);
          subtotal += price;
          item = {
            product: productData.product,
            product_color: false,
            qty: Number(qty),
          };
          cartItemsMod.push(item);
        }
      }

      // Update the cart summary.
      tax = subtotal * 0.0625;
      total = subtotal + tax;

      cartMod.subtotal = subtotal;
      cartMod.sales_tax = tax;
      cartMod.total = total;

      const payload = {
        cart: cartMod,
        cartItems: cartItemsMod,
      };

      dispatch({
        type: ADD_TO_CART,
        payload,
      });

      // Save changes to local storage.
      localStorage.setItem("cart", JSON.stringify(cartMod));
      localStorage.setItem("cartItems", JSON.stringify(cartItemsMod));
    }
  };

export const removeFromCart =
  (cartItemId, productId, productColorId) => async (dispatch, getState) => {
    const {
      userLogIn: { userInfo },
    } = getState();

    // If user is logged in, remove the cart item from the database.
    if (userInfo && Object.keys(userInfo).length) {
      const { data } = await axios.delete(
        `/api/cart/${cartItemId}/remove/`,
        getUserConfig(userInfo)
      );

      dispatch({
        type: REMOVE_FROM_CART,
        payload: data,
      });
    } else {
      const {
        userCart: { cart, cartItems },
      } = getState();
      let cartMod = { ...cart };
      let subtotal = 0;

      // Remove item from the cart of a user who is not logged in.
      let cartItemsMod = [];
      cartItems.forEach((item) => {
        if (
          item.product.id !== Number(productId) ||
          (item.product.id === Number(productId) &&
            item.product_color &&
            item.product_color.id !== Number(productColorId))
        ) {
          const price = item.product.on_sale
            ? Number(item.product.sale_price)
            : Number(item.product.price);
          subtotal += price * Number(item.qty);
          cartItemsMod.push(item);
        }
      });

      // Update cart summary
      const tax = subtotal * 0.0625;
      const total = subtotal + tax;

      cartMod.subtotal = subtotal;
      cartMod.sales_tax = tax;
      cartMod.total = total;

      const payload = {
        cart: cartMod,
        cartItems: cartItemsMod,
      };

      dispatch({
        type: REMOVE_FROM_CART,
        payload,
      });

      // Update cart in local storage
      localStorage.setItem("cart", JSON.stringify(cartMod));
      localStorage.setItem("cartItems", JSON.stringify(cartItemsMod));
    }
  };

export const updateQuantity =
  (cartItemId, productId, productColorId, qty) =>
  async (dispatch, getState) => {
    const {
      userLogIn: { userInfo },
    } = getState();

    // If a user is logged in, update the cart item quantity in the database.
    if (userInfo && Object.keys(userInfo).length) {
      const { data } = await axios.put(
        `/api/cart/${cartItemId}/update/`,
        {
          qty: qty,
        },
        getUserConfig(userInfo)
      );

      dispatch({
        type: UPDATE_QUANTITY,
        payload: data,
      });
    } else {
      const {
        userCart: { cart, cartItems },
      } = getState();
      let cartMod = { ...cart };

      // Update the quantity of a cart item for a user who's not logged in.
      let subtotal = 0;
      let cartItemsMod = cartItems.map((item) => {
        let price = item.product.on_sale
          ? Number(item.product.sale_price)
          : Number(item.product.price);
        if (
          (item.product.id === Number(productId) && !item.product_color) ||
          (item.product_color &&
            item.product_color.id === Number(productColorId))
        ) {
          subtotal += price * qty;
          const productColor = item.product_color ? item.product_color : null;
          return {
            product: item.product,
            product_color: productColor,
            qty,
          };
        } else {
          subtotal += price * item.qty;
          return item;
        }
      });

      // Update cart
      const tax = subtotal * 0.0625;
      const total = subtotal + tax;

      cartMod.subtotal = subtotal;
      cartMod.sales_tax = tax;
      cartMod.total = total;

      const payload = {
        cart: cartMod,
        cartItems: cartItemsMod,
      };

      dispatch({
        type: UPDATE_QUANTITY,
        payload,
      });

      // Update the cart in local storage
      localStorage.setItem("cart", JSON.stringify(cartMod));
      localStorage.setItem("cartItems", JSON.stringify(cartItemsMod));
    }
  };

// Update user's cart in store
export const updateUserCart = (cart, cartItems) => (dispatch) => {
  dispatch({
    type: UPDATE_CART,
    payload: { cartItems: cartItems, cart: cart },
  });
};

export const emptyCart = () => (dispatch) => {
  dispatch({
    type: EMPTY_CART,
  });
};
