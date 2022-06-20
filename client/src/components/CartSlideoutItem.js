import React from "react";
import { ListGroup, Row, Col } from "react-bootstrap";

function CartSlideoutItem({ cartItem }) {
  return (
    <ListGroup.Item key={cartItem.product.id}>
      <Row className="p-1">
        <Col md={3} className="flex-center">
          <img
            src={cartItem.product.image}
            alt=""
            className="cart-slideout-image"
          />
        </Col>
        <Col md={8} style={{ display: "flex", alignItems: "center" }}>
          <h5 className="full-padding slideout-text">
            {cartItem.product.name}
          </h5>
          {cartItem.product_color ? (
            <p className=" mt-2 mb-0 slideout-text product-color-text">
              <em>{cartItem.product_color.name}</em>
            </p>
          ) : null}
        </Col>
        <Col md={1} className="flex-center">
          <p className="full-padding slideout-text">{cartItem.qty}</p>
        </Col>
      </Row>
    </ListGroup.Item>
  );
}

export default CartSlideoutItem;
