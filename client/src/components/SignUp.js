import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Row, Col, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../actions/userActions";
import Message from "./Message";
import Loader from "./Loader";
import { addToCart } from "../actions/cartActions";

function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();
  let navigate = useNavigate();

  const userSignUp = useSelector((state) => state.userSignUp);
  const { error, loading, userInfo } = userSignUp;

  const userCart = useSelector((state) => state.userCart);
  const { cartItems } = userCart;

  useEffect(() => {
    if (userInfo != null) {
      navigate(-1);
    }
    document.getElementById("first-name-signup").focus();
  }, [userInfo, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
    } else {
      await dispatch(signup(firstName, lastName, email, password));
      cartItems.forEach((item) =>
        dispatch(addToCart(item.product.id, item.qty))
      );
    }
  };
  return (
    <div>
      <h1 className="center-text page-title">Sign Up</h1>
      <div className="login-form">
        <Form onSubmit={(e) => handleSubmit(e)}>
          <Form.Group className="mb-4">
            <Row>
              <Col md={12}>
                {message && <Message variant="danger">{message}</Message>}
                {error && <Message variant="danger">{error}</Message>}
                {loading && <Loader />}
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Label className="signup-label">First Name:</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Control
                  required
                  size="sm"
                  id="first-name-signup"
                  className="signup-input"
                  type="name"
                  maxLength="50"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                ></Form.Control>
              </Col>
            </Row>
          </Form.Group>

          <Form.Group className="mb-4">
            <Row>
              <Col md={4}>
                <Form.Label className="signup-label">Last Name:</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Control
                  required
                  size="sm"
                  id="last-name-signup"
                  type="name"
                  maxLength="50"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                ></Form.Control>
              </Col>
            </Row>
          </Form.Group>

          <Form.Group className="mb-4">
            <Row>
              <Col md={4}>
                <Form.Label className="signup-label">Email Address:</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Control
                  required
                  size="sm"
                  id="email-signup"
                  type="email"
                  autoComplete="username email"
                  maxLength="50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
              </Col>
            </Row>
          </Form.Group>

          <Form.Group className="mb-4">
            <Row>
              <Col md={4}>
                <Form.Label className="signup-label">Password:</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Control
                  required
                  size="sm"
                  className="signup-input"
                  type="password"
                  autoComplete="new-password"
                  minLength="8"
                  maxLength="30"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></Form.Control>
              </Col>
            </Row>
          </Form.Group>

          <Form.Group className="mb-4">
            <Row>
              <Col md={4}>
                <Form.Label className="signup-label">
                  Confirm Password:
                </Form.Label>
              </Col>
              <Col md={8}>
                <Form.Control
                  required
                  size="sm"
                  className="signup-input"
                  type="password"
                  autoComplete="new-password"
                  minLength="8"
                  maxLength="30"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                ></Form.Control>
              </Col>
            </Row>
          </Form.Group>
          <div className="form-btns">
            <Button className="btn-block form-btn center" type="submit">
              Submit
            </Button>
          </div>
        </Form>
        <p className="center-text full-padding">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
