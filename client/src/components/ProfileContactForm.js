import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Form, Button } from "react-bootstrap";
import axios from "axios";
import { updateProfile } from "../actions/profileActions";
import { getUserInfo } from "../actions/userActions";
import { getUserConfig } from "../constants/universalFunctions";
import Message from "./Message";

function ProfileContactForm({ closeForm }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const userLogIn = useSelector((state) => state.userLogIn);
  const { userInfo } = userLogIn;

  const userProfile = useSelector((state) => state.userProfile);
  const { profile } = userProfile;

  useEffect(() => {
    if (userInfo.email) setEmail(userInfo.email);
    if (profile.phone) setPhone(profile.phone);
  }, [userInfo, profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (phone.length === 0 || (phone.length === 10 && !isNaN(Number(phone)))) {
      dispatch(
        updateProfile({
          phone,
        })
      );

      try {
        await axios.put(
          `/api/users/update/`,
          {
            first_name: false,
            last_name: false,
            email,
          },
          getUserConfig(userInfo)
        );
        dispatch(getUserInfo());

        setMessage("");
        closeForm();
      } catch (error) {
        setMessage(error.response.data);
        return;
      }
    } else {
      setMessage("Your phone number must be ten numbers.");
    }
  };

  return (
    <div className="profile-section">
      <Form onSubmit={(e) => handleSubmit(e)}>
        <i
          className="fa-solid fa-circle-xmark  profile-edit-icon"
          onClick={closeForm}
        ></i>
        <h5 className="mb-4">Contact Information</h5>
        {message ? <Message variant="danger">{message}</Message> : null}
        <Row>
          <Col md={3}>
            <p className="detail-padding bold">Email:</p>
          </Col>
          <Col md={8}>
            <Form.Control
              type="email"
              size="sm"
              maxLength="60"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            ></Form.Control>
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <p className="detail-padding bold">Phone:</p>
          </Col>
          <Col md={8}>
            <Form.Control
              type="tel"
              size="sm"
              maxLength="10"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            ></Form.Control>
          </Col>
        </Row>
        <Button type="submit" variant="info" className="save-profile-btn">
          Save
        </Button>
      </Form>
    </div>
  );
}

export default ProfileContactForm;
