import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Form, Button } from "react-bootstrap";
import { updateProfile } from "../actions/profileActions";
import { updateUser, getUserInfo } from "../actions/userActions";
import ChangePasswordModal from "./ChangePasswordModal";
import Message from "./Message";

function ProfilePersonalForm({ closeForm }) {
  const dispatch = useDispatch();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [message, setMessage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobDay, setDobDay] = useState("");
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const days = [];
  for (let i = 1; i <= 31; i++) {
    days.push(i.toString());
  }

  const userLogIn = useSelector((state) => state.userLogIn);
  const { userInfo } = userLogIn;

  const userProfile = useSelector((state) => state.userProfile);
  const { profile } = userProfile;

  useEffect(() => {
    if (userInfo.first_name) setFirstName(userInfo.first_name);
    if (userInfo.last_name) setLastName(userInfo.last_name);
    if (profile.dob_month) setDobMonth(profile.dob_month);
    if (profile.dob_day) setDobDay(profile.dob_day);
  }, [userInfo, profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (dobMonth && dobDay) {
      dispatch(
        updateProfile({
          dob_month: dobMonth,
          dob_day: dobDay,
        })
      );
      await dispatch(
        updateUser({
          first_name: firstName,
          last_name: lastName,
        })
      );

      await dispatch(getUserInfo());

      setMessage("");
      closeForm();
    } else if (!dobMonth && !dobDay) {
      dispatch(
        updateProfile({
          dob_month: null,
          dob_day: null,
        })
      );
      await dispatch(
        updateUser({
          first_name: firstName,
          last_name: lastName,
        })
      );

      await dispatch(getUserInfo());

      setMessage("");
      closeForm();
    } else {
      setMessage("You can't enter a partial birth date.");
    }
  };

  return (
    <div>
      <ChangePasswordModal
        showModal={showPasswordModal}
        closeModal={() => setShowPasswordModal(false)}
      />
      <Form onSubmit={handleSubmit}>
        <i
          className="fa-solid fa-circle-xmark  profile-edit-icon"
          onClick={closeForm}
        ></i>
        <h5 className="mb-4">Personal Information</h5>
        {message ? <Message variant="danger">{message}</Message> : null}
        <Row>
          <Col md={3}>
            <p className="detail-padding bold">First Name:</p>
          </Col>
          <Col md={8}>
            <Form.Control
              type="text"
              size="sm"
              maxLength="30"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            ></Form.Control>
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <p className="detail-padding bold">Last Name:</p>
          </Col>
          <Col md={8}>
            <Form.Control
              type="text"
              size="sm"
              maxLength="30"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            ></Form.Control>
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <p className="detail-padding bold">Month of Birth:</p>
          </Col>
          <Col md={4}>
            <Form.Select
              type="select"
              size="sm"
              value={dobMonth}
              onChange={(e) => setDobMonth(e.target.value)}
            >
              <option onChange={() => setDobMonth("")}></option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={1}>
            <p className="detail-padding bold">Day:</p>
          </Col>
          <Col md={3}>
            <Form.Select
              type="select"
              size="sm"
              value={dobDay}
              onChange={(e) => setDobDay(e.target.value)}
            >
              <option onChange={() => setDobDay("")}></option>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <p className="detail-padding bold">Password:</p>
          </Col>
          <Col>
            <Button
              className="btn-block"
              size="sm"
              onClick={() => setShowPasswordModal(true)}
            >
              Change Password
            </Button>
          </Col>
        </Row>
        <Button type="submit" variant="info" className="save-profile-btn">
          Save
        </Button>
      </Form>
    </div>
  );
}

export default ProfilePersonalForm;
