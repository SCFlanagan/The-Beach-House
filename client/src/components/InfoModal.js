import React from "react";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function InfoModal({ title, message, showModal, closeModal, isLogInModal }) {
  return (
    <Modal show={showModal} onHide={closeModal} className="modal">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Close
        </Button>
        {isLogInModal ? (
          <Link to="/login">
            <Button variant="primary">Log In</Button>
          </Link>
        ) : null}
      </Modal.Footer>
    </Modal>
  );
}

export default InfoModal;
