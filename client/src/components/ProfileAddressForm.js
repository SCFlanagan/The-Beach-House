import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Row, Col, Button } from "react-bootstrap";
import { stateAbbr } from "../constants/formOptions";
import { updateProfile } from "../actions/profileActions";
import InfoModal from "./InfoModal";
import Message from "./Message";

function ProfileAddressForm({ closeForm }) {
  const dispatch = useDispatch();
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  const userProfile = useSelector((state) => state.userProfile);
  const { profile } = userProfile;

  useEffect(() => {
    if (profile.address_1) setAddress1(profile.address_1);
    if (profile.address_2) setAddress2(profile.address_2);
    if (profile.address_city) setCity(profile.address_city);
    if (profile.address_state) setState(profile.address_state);
    if (profile.address_zip) setZip(profile.address_zip);
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (zip && (isNaN(Number(zip)) || zip.length !== 5)) {
      setMessage("Your zip code must be 5 numbers long.");
    } else if (
      (address1 && city && state && zip) ||
      (!address1 && !address2 && !city && !state && !zip)
    ) {
      await dispatch(
        updateProfile({
          address_1: address1,
          address_2: address2,
          address_city: city,
          address_state: state,
          address_zip: zip,
        })
      );
      setMessage("");
      closeForm();
    } else {
      setMessage("You can not enter a partial address.");
    }
  };

  return (
    <div>
      <InfoModal
        showModal={showModal}
        closeModal={() => setShowModal(false)}
        title="Invalid Input"
        message={message}
      />
      <Form onSubmit={handleSubmit}>
        <i
          className="fa-solid fa-circle-xmark  profile-edit-icon"
          onClick={closeForm}
        ></i>
        <h5>Address</h5>
        {message ? <Message variant="danger">{message}</Message> : null}
        <Row>
          <Col md={3}>
            <p className="detail-padding bold">Address Line 1:</p>
          </Col>
          <Col md={8}>
            <Form.Control
              type="text"
              size="sm"
              maxLength="50"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
            ></Form.Control>
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <p className="detail-padding bold">Address Line 2:</p>
          </Col>
          <Col md={8}>
            <Form.Control
              type="text"
              size="sm"
              maxLength="50"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
            ></Form.Control>
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <p className="detail-padding bold">City</p>
          </Col>
          <Col md={8}>
            <Form.Control
              type="text"
              size="sm"
              maxLength="50"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            ></Form.Control>
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <p className="detail-padding bold">State:</p>
          </Col>
          <Col md={3}>
            <Form.Select
              type="select"
              size="sm"
              value={state}
              onChange={(e) => setState(e.target.value)}
            >
              <option onChange={() => setState("")}></option>
              {stateAbbr.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={1}>
            <p className="detail-padding bold">Zip:</p>
          </Col>
          <Col md={4}>
            <Form.Control
              type="text"
              size="sm"
              maxLength="5"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
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

export default ProfileAddressForm;
