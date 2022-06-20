import React, { useEffect } from "react";
import { ListGroup, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import CartItem from "./CartItem";
import Loader from "./Loader";
import Message from "./Message";
import { getCart } from "../actions/cartActions";

function Cart() {
  const dispatch = useDispatch();

  const userCart = useSelector((state) => state.userCart);
  const { loading, error, cartItems } = userCart;

  const userLogIn = useSelector((state) => state.userLogIn);
  const { userInfo } = userLogIn;

  useEffect(() => {
    if (userInfo && Object.keys(userInfo).length) {
      dispatch(getCart());
    }
  }, [dispatch, userInfo]);

  return (
    <div className="page-title">
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <ListGroup variant="flush" style={{ marginBottom: "2rem" }}>
          <ListGroup.Item>
            <h3>Shopping Cart</h3>
          </ListGroup.Item>

          {!cartItems.length ? (
            <div className="no-cart-text">
              <p>There are no items in your cart.</p>
            </div>
          ) : (
            <div>
              <ListGroup.Item>
                <Row className="cart-text">
                  <Col md={3} sm={4}></Col>
                  <Col md={4} sm={2} className="flex-center">
                    Item
                  </Col>
                  <Col md={3} sm={3} className="flex-center">
                    Quantity
                  </Col>
                  <Col md={2} sm={2} className="cart-item-price flex-center">
                    Price
                  </Col>
                </Row>
              </ListGroup.Item>
              {cartItems.map((cartItem, index) => (
                <CartItem cartItem={cartItem} key={index}></CartItem>
              ))}
            </div>
          )}
        </ListGroup>
      )}
    </div>
  );
}

export default Cart;
