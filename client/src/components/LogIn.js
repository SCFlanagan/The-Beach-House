import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../actions/userActions";
import Message from "./Message";
import Loader from "./Loader";
import { addToCart } from "../actions/cartActions";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const userLogIn = useSelector((state) => state.userLogIn);
  const { error, loading, userInfo } = userLogIn;

  const userCart = useSelector((state) => state.userCart);
  const { cartItems } = userCart;

  useEffect(() => {
    if (userInfo && Object.keys(userInfo).length) {
      navigate(-1);
    }
    document.getElementById("email-login").focus();
  }, [userInfo, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(login(email, password));

    // Move items from anonymous user's cart to logged in user's cart
    cartItems.forEach((item) => {
      let color = item.product_color ? item.product_color.id : false;
      dispatch(addToCart(item.product.id, item.qty, color));
    });
  };

  return (
    <div>
      <h1 className="center-text page-title">Log In</h1>
      <div className="login-form">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Row>
              <Col md={12}>
                {error && <Message variant="danger">{error}</Message>}
                {loading && <Loader />}
              </Col>
            </Row>
            <Row>
              <Col md={3}>
                <Form.Label className="login-label" htmlFor="email-login">
                  Email:
                </Form.Label>
              </Col>
              <Col md={9}>
                <Form.Control
                  size="sm"
                  className="login-input"
                  id="email-login"
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
              <Col md={3}>
                <Form.Label className="login-label" htmlFor="password-login">
                  Password:
                </Form.Label>
              </Col>
              <Col md={9}>
                <Form.Control
                  size="sm"
                  className="login-input"
                  id="password-login"
                  type="password"
                  autoComplete="current-password"
                  maxLength="50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></Form.Control>
              </Col>
            </Row>
          </Form.Group>
          <div className="form-btns">
            <Button className="btn-block form-btn center" type="submit">
              Log In
            </Button>
          </div>
        </Form>
        <p className="center-text full-padding">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
