import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import Message from "./Message";
import { getUserConfig } from "../constants/universalFunctions";

function ChangePasswordModal({ showModal, closeModal }) {
  const [message, setMessage] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  const userLogIn = useSelector((state) => state.userLogIn);
  const { userInfo } = userLogIn;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      if (oldPassword === newPassword) {
        setMessage("You can not change to the same password.");
      } else {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
        let data;
        try {
          data = await axios.post(
            "/api/users/login/",
            {
              username: userInfo.username,
              password: oldPassword,
            },
            config
          );
          data = data.data;
        } catch (error) {
          setMessage("Current password is incorrect.");
        }

        if (data) {
          const response = await axios.put(
            "/api/users/changepassword/",
            {
              password: newPassword,
            },
            getUserConfig(userInfo)
          );
          if (response) {
            setPasswordUpdated(true);
          }
        }
      }
    } else {
      setMessage("Your new passwords do not match.");
    }
  };

  const closeAndReset = () => {
    setPasswordUpdated(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage("");
    closeModal();
  };

  return (
    <Modal show={showModal} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Change Password</Modal.Title>
      </Modal.Header>
      {passwordUpdated ? (
        <div>
          <Modal.Body className="flex-center" style={{ padding: "4rem 0" }}>
            <h5 className="detail-padding">Password Updated</h5>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeAndReset}>
              Close
            </Button>
          </Modal.Footer>
        </div>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {message ? <Message variant="danger">{message}</Message> : null}
            <input
              hidden
              type="text"
              autoComplete="username"
              value=""
              onChange={() => {}}
            />
            <Row>
              <Col md={5}>
                <Form.Label className="detail-padding">
                  Current Password:
                </Form.Label>
              </Col>
              <Col md={7}>
                <Form.Control
                  type="password"
                  id="old-password"
                  autoComplete="current-password"
                  maxLength="30"
                  required
                  onChange={(e) => setOldPassword(e.target.value)}
                ></Form.Control>
              </Col>
            </Row>
            <Row className="detail-padding">
              <Col md={5}>
                <Form.Label className="detail-padding">
                  New Password:
                </Form.Label>
              </Col>
              <Col md={7}>
                <Form.Control
                  type="password"
                  autoComplete="new-password"
                  maxLength="20"
                  minLength="8"
                  required
                  onChange={(e) => setNewPassword(e.target.value)}
                ></Form.Control>
              </Col>
            </Row>
            <Row className="detail-padding">
              <Col md={5}>
                <Form.Label className="detail-padding">
                  Confirm Password:
                </Form.Label>
              </Col>
              <Col md={7}>
                <Form.Control
                  type="password"
                  autoComplete="new-password"
                  maxLength="30"
                  minLength="8"
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                ></Form.Control>
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={closeAndReset}>
              Close
            </Button>

            <Button variant="primary" type="submit">
              Change Password
            </Button>
          </Modal.Footer>
        </Form>
      )}
    </Modal>
  );
}

export default ChangePasswordModal;
