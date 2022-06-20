import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import { getUserConfig } from "../constants/universalFunctions";
import { getOrderDetails } from "../actions/orderActions";

function ConfirmOrderCancelModal({ order, btnClass, cancelOrder }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [canBeCancelled, setCanBeCancelled] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const userLogIn = useSelector((state) => state.userLogIn);
  const { userInfo } = userLogIn;

  useEffect(() => {
    if (userInfo && Object.keys(userInfo).length) {
      if (order && Object.keys(order).length && order.status === "P") {
        setCanBeCancelled(isWithinAnHour(order.date_created));
      }
    } else {
      navigate(-1);
    }
  }, [order, navigate, userInfo]);

  const isWithinAnHour = (date) => {
    date = new Date(date.slice(0, 19));
    return new Date() - date < 60 * 60 * 1000;
  };

  const handleCancelOrder = async () => {
    const { data } = await axios.put(
      `/api/orders/${order.id}/cancel/`,
      {},
      getUserConfig(userInfo)
    );
    if (data) {
      setCancelSuccess(true);
      dispatch(getOrderDetails(Number(order.id)));
      if (cancelOrder) cancelOrder();
    }
  };

  const closeModal = () => {
    setCanBeCancelled(false);
    setShowModal(false);
  };

  return (
    <div>
      {canBeCancelled && order.status === "P" ? (
        <Button
          variant="danger"
          className={btnClass}
          onClick={() => setShowModal(true)}
        >
          Cancel Order
        </Button>
      ) : null}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className="modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Cancel Order?</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p className="full-padding">
            {cancelSuccess
              ? "Your order has been cancelled"
              : "Are you sure you want to cancel your order? This action can not be reversed."}
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          {!cancelSuccess ? (
            <Button variant="primary" onClick={handleCancelOrder}>
              Cancel Order
            </Button>
          ) : null}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ConfirmOrderCancelModal;
