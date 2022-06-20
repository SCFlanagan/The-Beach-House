import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { ListGroup, Row, Col } from "react-bootstrap";
import { convertDateToString } from "../constants/universalFunctions";
import { getOrderDetails } from "../actions/orderActions";
import ConfirmOrderCancelModal from "./ConfirmOrderCancelModal";
import GoBackBtn from "./GoBackBtn";
import NotFound from "./NotFound";
import { emptyCart } from "../actions/cartActions";

function OrderConfirmation({ orderDetailPage }) {
  const dispatch = useDispatch();
  const { orderId } = useParams();

  const userLogIn = useSelector((state) => state.userLogIn);
  const { userInfo } = userLogIn;

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, orderItems } = orderDetails;

  useEffect(() => {
    if (userInfo && Object.keys(userInfo).length && orderDetailPage) {
      dispatch(getOrderDetails(Number(orderId)));
    } else {
      dispatch(emptyCart());

      localStorage.setItem(
        "cart",
        JSON.stringify({ subtotal: 0, sales_tax: 0, total: 0 })
      );
      localStorage.setItem("cartItems", JSON.stringify([]));
    }
  }, [userInfo, orderId, dispatch, orderDetailPage]);

  return (
    <div
      className="page-title"
      style={{ width: "90%", margin: "auto", marginTop: "7rem" }}
    >
      {order && Object.keys(order).length ? (
        <div>
          {orderDetailPage ? (
            <GoBackBtn className="btn btn-outline-primary my-3 go-back-user-form" />
          ) : null}
          <h2 className="center-text" style={{ marginBottom: "3rem" }}>
            {orderDetailPage ? "Order Details" : "Thank you for your order!"}
          </h2>

          <ListGroup variant="flush">
            <ListGroup.Item className="center-text">
              <Row className="full-padding" style={{ marginBottom: "1rem" }}>
                <Col>
                  <h5>Order #:</h5>
                  <p className="detail-padding">{order.id}</p>
                </Col>
                <Col>
                  <h5>Order Date:</h5>
                  <p className="detail-padding">
                    {convertDateToString(order.date_created)}
                  </p>
                </Col>
                <Col>
                  <h5>Shipping Details:</h5>
                  <p className="detail-padding order-info-item">
                    {order.shipping_name}
                  </p>
                  <p className="order-info-item">{order.shipping_address_1}</p>
                  {order.shipping_address_2 ? (
                    <p className="order-info-item">
                      {order.shipping_address_2}
                    </p>
                  ) : null}
                  <p className="order-info-item">{`${order.shipping_city}, ${order.shipping_state} ${order.shipping_zip}`}</p>
                </Col>
                {orderDetailPage ? (
                  <Col>
                    <h5>Status:</h5>
                    <p className="detail-padding order-info-item">
                      {order.status === "P"
                        ? "Processing"
                        : order.status === "CO"
                        ? "Completed"
                        : order.status === "OH"
                        ? "On Hold"
                        : order.status === "CA"
                        ? "Cancelled"
                        : null}
                    </p>
                  </Col>
                ) : null}
              </Row>
            </ListGroup.Item>

            <ListGroup.Item
              style={{ paddingBottom: "2rem" }}
              className="center-text"
            >
              <h5 className="full-padding">Order Items:</h5>
              <Row className="cart-text full-padding">
                <Col md={2}></Col>
                <Col md={4} className="flex-center faint-text">
                  Item
                </Col>
                <Col md={3} className="flex-center faint-text">
                  Quantity
                </Col>
                <Col md={3} className="cart-item-price flex-center faint-text">
                  Price
                </Col>
              </Row>
              {orderItems.map((item) => (
                <Row key={item.id} className="detail-padding">
                  <div className="flex-center center-text" key={item.id}>
                    <Col md={2}>
                      <img
                        src={item.product.image}
                        alt=""
                        className="cart-item-image"
                      />
                    </Col>
                    <Col md={4}>
                      <div>
                        <p>{item.product.name}</p>
                        {item.product_color ? (
                          <p className="product-color-text">
                            <em>{item.product_color.name}</em>
                          </p>
                        ) : null}
                      </div>
                    </Col>
                    <Col md={3}>{item.qty}</Col>
                    <Col md={3}>
                      <p>
                        $
                        {item.product.on_sale
                          ? (item.product.sale_price * item.qty).toFixed(2)
                          : (item.product.price * item.qty).toFixed(2)}
                      </p>
                    </Col>
                  </div>
                </Row>
              ))}
            </ListGroup.Item>

            <ListGroup.Item className="text-center">
              <h5 className="full-padding">Order Summary:</h5>
              <Row style={{ margin: "3rem 0 2rem 0" }}>
                <Col md={2}></Col>
                <Col md={3}>
                  <div className="flex-apart">
                    <p>Subtotal:</p>
                    <p>${order.subtotal}</p>
                  </div>
                  {order.promo_savings ? (
                    <div className="flex-apart">
                      <p className="inline">Promo Savings: </p>
                      <p className=" inline right">${order.promo_savings}</p>
                    </div>
                  ) : null}
                  <div className="flex-apart">
                    <p>Sales Tax:</p>
                    <p>${order.sales_tax}</p>
                  </div>
                  <div className="flex-apart">
                    <p>Shipping:</p>
                    <p>${order.shipping_cost}</p>
                  </div>
                </Col>
                <Col md={2}></Col>
                <Col md={3}>
                  <div
                    className="flex-center"
                    style={{ width: "100%", height: "100%" }}
                  >
                    <div className="flex-apart" style={{ width: "100%" }}>
                      <p className="order-confirmation-total">Total:</p>
                      <p className="order-confirmation-total">${order.total}</p>
                    </div>
                  </div>
                </Col>
                <Col md={2}></Col>
              </Row>
              {!orderDetailPage ? (
                <div className="flex-center" style={{ padding: "2rem 0" }}>
                  <p className="text-center" style={{ width: "70%" }}>
                    If you have an account, you may cancel an order within one
                    hour of placing it by visiting your{" "}
                    <a href="/orders" style={{ textDecoration: "none" }}>
                      <span
                        className={
                          userInfo && Object.keys(userInfo).length
                            ? "blue pointer-hover"
                            : ""
                        }
                      >
                        order details
                      </span>
                    </a>{" "}
                    page. It is not possible to cancel after one hour. If you
                    have any questions, please contact our
                    <a href="/contact" style={{ textDecoration: "none" }}>
                      <span className="blue pointer-hover">
                        {" "}
                        customer support{" "}
                      </span>
                    </a>
                    team.
                  </p>
                </div>
              ) : null}
              {orderDetailPage ? (
                <ConfirmOrderCancelModal order={order} btnClass="mb-4" />
              ) : null}
            </ListGroup.Item>
          </ListGroup>
        </div>
      ) : (
        <NotFound />
      )}
    </div>
  );
}

export default OrderConfirmation;
