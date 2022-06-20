import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ListGroup, Button } from "react-bootstrap";
import CartSlideoutItem from "./CartSlideoutItem";

function CartSlideout() {
  const navigate = useNavigate();
  const userCart = useSelector((state) => state.userCart);
  const { cartItems } = userCart;

  const handleClose = () => {
    const elem = document.getElementById("cart-slideout");
    elem.className = "";
  };
  return (
    <div id="cart-slideout">
      <h4 className="slide-close-btn pointer-hover" onClick={handleClose}>
        X
      </h4>
      <h4 className="ms-2 mt-2">Shopping Cart</h4>
      <ListGroup variant="flush">
        {cartItems
          ? cartItems.map((item, index) => (
              <CartSlideoutItem cartItem={item} key={index} />
            ))
          : null}
        <Button
          onClick={() => navigate("/cart")}
          className="btn-block slideout-cart-btn"
        >
          View Cart
        </Button>
      </ListGroup>
    </div>
  );
}

export default CartSlideout;
