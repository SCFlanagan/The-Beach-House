import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Message from "./Message";

function OrderSummary({
  showCart,
  shippingType,
  isFormValid,
  featuredPromo,
  total,
  promoCode,
  promoSavings,
  setTotal,
  setPromoCode,
  setPromoSavings,
  checkStock,
}) {
  const navigate = useNavigate();
  const [subtotal, setSubtotal] = useState(0);
  const [salesTax, setSalesTax] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState(false);
  const [msgVariant, setMsgVariant] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [shippingCost, setShippingCost] = useState(6.99);

  const userLogIn = useSelector((state) => state.userLogIn);
  const { userInfo } = userLogIn;

  const userCart = useSelector((state) => state.userCart);
  const { cart, cartItems } = userCart;

  useEffect(() => {
    if (shippingType) {
      switch (shippingType) {
        case "G":
          setShippingCost(6.99);
          break;
        case "E":
          setShippingCost(14.99);
          break;
        case "O":
          setShippingCost(24.99);
          break;
        default:
          return;
      }
    }
    if (cart) {
      if (promoDiscount) {
        const savings = Number(cart.subtotal) * promoDiscount;
        const tax = (Number(cart.subtotal) - savings) * 0.0625;

        setSubtotal(Number(cart.subtotal).toFixed(2));
        setPromoSavings(savings.toFixed(2));
        setSalesTax(tax.toFixed(2));

        let sum = Number(cart.subtotal) - savings + tax;
        if (!showCart) sum += shippingCost;
        setTotal(sum.toFixed(2));
      } else {
        setSubtotal(Number(cart.subtotal).toFixed(2));
        setSalesTax(Number(cart.sales_tax).toFixed(2));

        let sum = Number(cart.total);
        if (!showCart) sum += shippingCost;
        setTotal(sum.toFixed(2));
      }
    }
    if (isFormValid) {
      // Reset
      setPromoSavings(0);
      setShowMessage(false);
      setMessage(false);
      setMsgVariant("");
      setPromoDiscount(0);
      setPromoCode("");
      setShowForm(false);
      setShippingCost(6.99);
    }
  }, [
    userInfo,
    cart,
    cartItems,
    promoDiscount,
    shippingType,
    shippingCost,
    isFormValid,
    showCart,
    setPromoCode,
    setPromoSavings,
    setTotal,
  ]);

  const togglePromoForm = () => {
    if (showForm) {
      setShowForm(false);
    } else {
      setShowForm(true);
    }
  };

  const handleApplyPromo = async () => {
    const isValid = await axios.get(
      `/api/promocodes/${promoCode.toUpperCase()}/confirm`
    );
    if (isValid.data) {
      setMsgVariant("success");
      setMessage(`${promoCode.toUpperCase()} is applied.`);
      setShowMessage(true);
      setPromoDiscount(Number(isValid.data.discount));
    } else {
      setMessage("Invalid Promo Code");
      setMsgVariant("danger");
      setShowMessage(true);
    }
  };

  const handleChangePromo = (e) => {
    e.preventDefault();
    setPromoCode(e.target.value);
  };

  const handleProceed = async () => {
    const cartIsValid = await checkStock();
    if (cartIsValid) {
      navigate("/checkout");
    }
  };

  return (
    <div className="page-title">
      <Card>
        <Card.Body>
          <Card.Title>Order Summary</Card.Title>
          <div className="order-summary-line">
            <Card.Text className="inline">Subtotal</Card.Text>
            <Card.Text className="inline right">${subtotal}</Card.Text>
          </div>
          {promoSavings ? (
            <div className="order-summary-line blue">
              <Card.Text className="inline">Promo Discount</Card.Text>
              <Card.Text className="inline right">- ${promoSavings}</Card.Text>
            </div>
          ) : null}
          <div className="order-summary-line">
            <Card.Text className="inline">Sales Tax</Card.Text>
            <Card.Text className="inline right">${salesTax}</Card.Text>
          </div>
          <div className="order-summary-line">
            <Card.Text className="inline">Shipping</Card.Text>
            <Card.Text className="inline right">
              {!showCart ? `$${shippingCost}` : "TBD"}
            </Card.Text>
          </div>
          <hr />
          <div className="order-summary-line order-total">
            <Card.Text className="inline">Total</Card.Text>
            <Card.Text className="inline right">${total}</Card.Text>
          </div>
          {showCart ? (
            <Button
              className="btn-block checkout-btn"
              disabled={cartItems && cartItems.length ? false : true}
              type="button"
              onClick={handleProceed}
            >
              Proceed to Checkout
            </Button>
          ) : (
            <Button
              className="btn-block checkout-btn"
              type="submit"
              form="checkout-form"
            >
              Place Order
            </Button>
          )}
          <hr />
          {Object.keys(featuredPromo).length ? (
            <div className="promo-alert-div">
              <Card.Text className="promo-alert">Use Promo Code</Card.Text>
              <Card.Text className="promo-alert promo-code">
                {featuredPromo.code}
              </Card.Text>
              <Card.Text className="promo-alert">{`For ${(
                featuredPromo.discount * 100
              ).toFixed(0)}% OFF!`}</Card.Text>
            </div>
          ) : null}
          <div
            className="order-summary-line open-promo-btn"
            onClick={togglePromoForm}
          >
            <Card.Text className="inline">Promo Code</Card.Text>
            <Card.Text className="inline right" placeholder="Enter Promo Code">
              <span>+</span>
            </Card.Text>
          </div>
          {showForm ? (
            <div>
              {showMessage ? (
                <Message variant={msgVariant}>{message}</Message>
              ) : null}
              <div className="order-summary-line">
                <Card.Text>
                  <span className="full-padding">
                    <Form.Control
                      className="inline"
                      size="sm"
                      maxLength={20}
                      type="text"
                      id="promo-form"
                      value={promoCode}
                      placeholder="Enter Promo Code"
                      onChange={handleChangePromo}
                    ></Form.Control>

                    <Button
                      id="apply-promo-btn"
                      className="inline right"
                      size="sm"
                      onClick={handleApplyPromo}
                    >
                      Apply
                    </Button>
                  </span>
                </Card.Text>
              </div>
            </div>
          ) : null}
        </Card.Body>
      </Card>
    </div>
  );
}

export default OrderSummary;
