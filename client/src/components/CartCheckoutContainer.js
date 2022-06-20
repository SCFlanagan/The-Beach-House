import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import axios from "axios";
import OrderSummary from "./OrderSummary";
import Cart from "./Cart";
import Checkout from "./Checkout";
import OrderConfirmation from "./OrderConfirmation";
import CartChangedModal from "./CartChangedModal";
import { getCart, updateUserCart } from "../actions/cartActions";
import { setOrderInfo } from "../actions/orderActions";
import { getUserConfig, updateCart } from "../constants/universalFunctions";

function CartCheckoutContainer({ showCart, showConfirmation }) {
  const [showModal, setShowModal] = useState(false);
  const [changedItems, setChangedItems] = useState([]);
  const [shippingType, setShippingType] = useState("G");
  const [isFormValid, setIsFormValid] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoSavings, setPromoSavings] = useState("");
  const [total, setTotal] = useState("");
  const [featuredPromo, setFeaturedPromo] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogIn = useSelector((state) => state.userLogIn);
  const { userInfo } = userLogIn;

  const userCart = useSelector((state) => state.userCart);
  const { cart, cartItems } = userCart;

  const getFeaturedPromo = async () => {
    if (!Object.keys(featuredPromo).length) {
      const { data } = await axios.get("/api/promocodes/featured/");
      setFeaturedPromo(data);
    }
  };

  useEffect(() => {
    if (!Object.keys(featuredPromo).length) getFeaturedPromo();
    if (Object.keys(userInfo).length) dispatch(getCart);
  });

  const checkStock = async () => {
    // Check that all the items in the user's cart still have the desired quantity in stock. If they do not, update the cart to reflect the available amount.

    const { data } = await axios.put("/api/cart/checkcart/", {
      cart_items: cartItems,
    });

    if (data.updated_items.length) {
      setChangedItems(data.updated_items);

      let updatedCart = updateCart(data.cart_items);

      if (!Object.keys(userInfo).length) {
        dispatch(updateUserCart(updatedCart, data.cart_items));

        localStorage.setItem("cart", JSON.stringify(updatedCart));
        localStorage.setItem("cartItems", JSON.stringify(data.cart_items));
      } else {
        dispatch(getCart());
      }

      setShowModal(true);
      return false;
    } else {
      return true;
    }
  };

  const sendFormInput = async (formInput) => {
    // Create a new order in the database.
    const newOrder = {
      subtotal: cart.subtotal,
      sales_tax: cart.sales_tax,
      promo_code: promoCode,
      promo_savings: promoSavings,
      total: total,
      contact_email: formInput.email,
      contact_phone: formInput.phone,
      shipping_name: formInput.shippingName,
      shipping_address_1: formInput.shippingAdd1,
      shipping_address_2: formInput.shippingAdd2,
      shipping_city: formInput.shippingCity,
      shipping_state: formInput.shippingState,
      shipping_zip: formInput.shippingZip,
      card_name: formInput.cardName,
      card_month: formInput.cardMonth,
      card_year: formInput.cardYear,
      security_code: formInput.securityCode,
      billing_name: formInput.billName,
      billing_address_1: formInput.billAdd1,
      billing_address_2: formInput.billAdd2,
      billing_city: formInput.billCity,
      billing_state: formInput.billState,
      billing_zip: formInput.billZip,
      shipping_type: shippingType,
      shipping_cost: formInput.shippingCost,
      order_items: cartItems,
    };

    if (userInfo && Object.keys(userInfo).length) {
      const { data } = await axios.post(
        "/api/orders/create/",
        newOrder,
        getUserConfig(userInfo)
      );

      dispatch(setOrderInfo(data));
      navigate("/confirmation");
    } else {
      const { data } = await axios.post("/api/orders/create/", newOrder);

      dispatch(setOrderInfo(data));
      navigate("/confirmation");
    }
  };

  return (
    <div>
      <CartChangedModal
        showModal={showModal}
        closeModal={() => setShowModal(false)}
        changedItems={changedItems}
      />
      {showConfirmation ? (
        <OrderConfirmation />
      ) : (
        <Row>
          <Col lg={8} sm={12}>
            {showCart ? (
              <Cart />
            ) : (
              <Checkout
                setShippingType={(type) => {
                  setShippingType(type);
                }}
                setIsFormValid={setIsFormValid}
                sendFormInput={sendFormInput}
                checkStock={checkStock}
              />
            )}
          </Col>
          <Col lg={4} sm={12}>
            <OrderSummary
              showCart={showCart}
              shippingType={shippingType}
              isFormValid={isFormValid}
              featuredPromo={featuredPromo}
              total={total}
              promoCode={promoCode}
              promoSavings={promoSavings}
              setTotal={setTotal}
              setPromoCode={setPromoCode}
              setPromoSavings={setPromoSavings}
              checkStock={checkStock}
            />
          </Col>
        </Row>
      )}
    </div>
  );
}

export default CartCheckoutContainer;
