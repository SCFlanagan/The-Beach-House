import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ListGroup, Form, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { removeFromCart, updateQuantity } from "../actions/cartActions";

function CartItem({ cartItem, fromCartChangedModal }) {
  const dispatch = useDispatch();
  const [qty, setQty] = useState(cartItem.qty);
  const [qtyOptions, setQtyOptions] = useState([]);

  const userCart = useSelector((state) => state.userCart);
  const { cartItems } = userCart;

  useEffect(() => {
    let arr;
    if (cartItem.product_color && !qtyOptions.length) {
      arr = [];
      for (let i = 1; i <= cartItem.product_color.num_stock; i++) {
        arr.push(i);
      }
      setQtyOptions(arr);
    } else if (!qtyOptions.length) {
      arr = [];
      for (let i = 1; i <= cartItem.product.num_stock; i++) {
        arr.push(i);
      }
      setQtyOptions(arr);
    }
    setQty(cartItem.qty);
  }, [cartItem, cartItems, qtyOptions]);

  const handleRemove = () => {
    // Remove an item from user's cart.
    let productColorId = false;
    if (cartItem.product_color) productColorId = cartItem.product_color.id;
    dispatch(removeFromCart(cartItem.id, cartItem.product.id, productColorId));
  };

  const changeQuantity = (e) => {
    // Change the quantity of an item in user's cart.
    e.preventDefault();
    setQty(e.target.value);
    let productColorId = false;
    if (cartItem.product_color) productColorId = cartItem.product_color.id;
    dispatch(
      updateQuantity(
        cartItem.id,
        cartItem.product.id,
        productColorId,
        e.target.value
      )
    );
  };

  return (
    <div className="cart-item-container">
      {!fromCartChangedModal ? (
        <h3>
          <i
            className="fa-solid fa-rectangle-xmark rm-cart-item-btn"
            onClick={handleRemove}
          ></i>
        </h3>
      ) : null}
      <ListGroup.Item key={cartItem.product.id}>
        <Row className="cart-text">
          <Col md={3} sm={4} className="flex-center">
            <Link
              to={`/products/${cartItem.product.id}/`}
              style={{ textDecoration: "none" }}
            >
              <img
                src={cartItem.product.image}
                className="cart-item-image"
                alt=""
              />
            </Link>
          </Col>
          <Col md={4} sm={2} style={{ display: "flex", alignItems: "center" }}>
            <div>
              <Link
                to={`/products/${cartItem.product.id}/`}
                style={{ textDecoration: "inherit" }}
              >
                <p className="mt-3" component={Link}>
                  {cartItem.product.name}
                </p>
              </Link>
              {cartItem.product_color ? (
                <p className="product-color-text">
                  <em>{cartItem.product_color.name}</em>
                </p>
              ) : null}
            </div>
          </Col>
          <Col md={3} sm={3} className="flex-center">
            {fromCartChangedModal ? (
              <p className="full-padding">{cartItem.qty}</p>
            ) : (
              <Form.Select
                id="detail-qty-input"
                className="enter-text"
                value={qty}
                onChange={(e) => changeQuantity(e)}
              >
                {qtyOptions.map((num) => (
                  <option value={num} key={num}>
                    {num}
                  </option>
                ))}
              </Form.Select>
            )}
          </Col>
          {cartItem.product.on_sale ? (
            <Col className="cart-item-price red flex-center" md={2} sm={2}>
              ${cartItem.product.sale_price}
            </Col>
          ) : (
            <Col className="cart-item-price flex-center" md={2} sm={2}>
              ${cartItem.product.price}
            </Col>
          )}
        </Row>
      </ListGroup.Item>
    </div>
  );
}

export default CartItem;
