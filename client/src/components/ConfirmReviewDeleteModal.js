import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";
import { getUserConfig } from "../constants/universalFunctions";

function ConfirmReviewDeleteModal({
  reviewId,
  showModal,
  closeModal,
  showProductReviews,
}) {
  const userLogIn = useSelector((state) => state.userLogIn);
  const { userInfo } = userLogIn;

  const handleDelete = async () => {
    await axios.delete(
      `/api/reviews/${reviewId}/delete/`,
      getUserConfig(userInfo)
    );
    closeModal();
    showProductReviews();
  };

  return (
    <Modal show={showModal} onHide={closeModal} className="modal">
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          Are you sure you want to delete this review? <br /> You can not undo
          this action.
        </p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Cancel
        </Button>
        <Button className="delete-review-btn" onClick={handleDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmReviewDeleteModal;
