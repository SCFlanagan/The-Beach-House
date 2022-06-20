import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import CartItem from "./CartItem";
import { getCart } from "../actions/cartActions";

function CartChangedModal({ showModal, closeModal, changedItems }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const userLogIn = useSelector((state) => state.userLogIn);
  const { userInfo } = userLogIn;

  const handleClose = () => {
    if (Object.keys(userInfo).length) dispatch(getCart());
    closeModal();
    if (location === "/checkout") navigate("/cart");
  };

  return (
    <Modal show={showModal} onHide={closeModal} className="modal">
      <Modal.Header closeButton>
        <Modal.Title>Items Have Changed</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          The following items are no longer available in the quantity you
          requested. Your cart has been adjusted accordingly:
        </p>
        {changedItems.map((item, index) => (
          <CartItem cartItem={item} key={index} fromCartChangedModal={true} />
        ))}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CartChangedModal;
