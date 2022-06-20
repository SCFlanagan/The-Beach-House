import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Card, Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import {
  convertDateToString,
  getUserConfig,
} from "../constants/universalFunctions";
import ConfirmOrderCancelModal from "./ConfirmOrderCancelModal";

function OrdersListItem({ order }) {
  const navigate = useNavigate();
  const [orderItems, setOrderItems] = useState([]);
  const [orderStatus, setOrderStatus] = useState("");

  const userLogIn = useSelector((state) => state.userLogIn);
  const { userInfo } = userLogIn;

  const getOrderItems = useCallback(async () => {
    const { data } = await axios.get(
      `/api/orders/${order.id}/items/`,
      getUserConfig(userInfo)
    );
    setOrderItems(data);
  }, [order, userInfo]);

  useEffect(() => {
    if (userInfo && Object.keys(userInfo).length) {
      if (order && Object.keys(order).length) {
        getOrderItems();
        setOrderStatus(order.status);
      }
    } else {
      navigate(-1);
    }
  }, [order, getOrderItems, navigate, userInfo]);

  const cancelOrder = () => {
    setOrderStatus("CA");
  };

  return (
    <Card className="order-list-item">
      <Card.Body>
        <Row className="center-text">
          <Col md={2} sm={6} className="mt-2 mb-2">
            <h5>ORDER NUMBER</h5>
            <p className="detail-padding">{order.id}</p>
          </Col>
          <Col md={3} sm={6} className="mt-2 mb-2">
            <h5>ORDER PLACED</h5>
            <p className="detail-padding">
              {convertDateToString(order.date_created)}
            </p>
          </Col>
          <Col md={2} sm={6} className="mt-2 mb-2">
            <h5>TOTAL</h5>
            <p className="detail-padding">${order.total}</p>
          </Col>
          <Col md={3} sm={6} className="mt-2 mb-2">
            <h5>SHIP TO</h5>
            <p className="detail-padding">{order.shipping_name}</p>
          </Col>
          <Col md={2} sm={6} className="mt-2 mb-2">
            <h5>STATUS</h5>
            <p className="detail-padding">
              {orderStatus === "P"
                ? "Processing"
                : orderStatus === "CO"
                ? "Completed"
                : orderStatus === "OH"
                ? "On Hold"
                : orderStatus === "CA"
                ? "Cancelled"
                : null}
            </p>
          </Col>
        </Row>
        <Row>
          <Col md={9}>
            <div>
              {orderItems
                ? orderItems.map((item) => (
                    <img
                      src={item.product.image}
                      alt=""
                      key={item.id}
                      className="order-item-image"
                    />
                  ))
                : null}
            </div>
          </Col>
          <Col md={3}>
            <div className="order-item-btn-div">
              <Link to={`/orders/${order.id}`}>
                <Button variant="warning" className="order-item-btn">
                  View Order Details
                </Button>
              </Link>
              <ConfirmOrderCancelModal
                btnClass="order-item-btn"
                order={order}
                cancelOrder={cancelOrder}
              />
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default OrdersListItem;
