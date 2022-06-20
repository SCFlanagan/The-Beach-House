import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Form, Row, Col, ListGroup, Button } from "react-bootstrap";
import { stateAbbr, months, expirationYears } from "../constants/formOptions";
import InfoModal from "./InfoModal";

function Checkout({
  setShippingType,
  setIsFormValid,
  sendFormInput,
  checkStock,
}) {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [sameBillingChecked, setSameBillingChecked] = useState(true);
  const [groundShipping, setGroundShipping] = useState(true);
  const [expeditedShipping, setExpeditedShipping] = useState(false);
  const [overnightShipping, setOvernightShipping] = useState(false);

  const userLogIn = useSelector((state) => state.userLogIn);
  const { userInfo } = userLogIn;

  const userCart = useSelector((state) => state.userCart);
  const { cartItems } = userCart;

  const userProfile = useSelector((state) => state.userProfile);
  const { profile } = userProfile;

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [shippingName, setShippingName] = useState("");
  const [shippingAdd1, setShippingAdd1] = useState("");
  const [shippingAdd2, setShippingAdd2] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingState, setShippingState] = useState("");
  const [shippingZip, setShippingZip] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardMonth, setCardMonth] = useState("");
  const [cardYear, setCardYear] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [billingName, setBillingName] = useState("");
  const [billingAdd1, setBillingAdd1] = useState("");
  const [billingAdd2, setBillingAdd2] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingState, setBillingState] = useState("");
  const [billingZip, setBillingZip] = useState("");
  const [shippingCost, setShippingCost] = useState(6.99);

  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo && Object.keys(userInfo).length) {
      setEmail(userInfo.email);
      setShippingName(`${userInfo.first_name} ${userInfo.last_name}`);
      if (profile.phone) setPhone(profile.phone);
      if (profile.address_1) setShippingAdd1(profile.address_1);
      if (profile.address_2) setShippingAdd2(profile.address_2);
      if (profile.address_city) setShippingCity(profile.address_city);
      if (profile.address_state) setShippingState(profile.address_state);
      if (profile.address_zip) setShippingZip(profile.address_zip);
    }
    if (!cartItems.length) {
      navigate("/cart");
    }
  }, [userInfo, cartItems.length, navigate, profile]);

  const handleCheckboxBilling = (e) => {
    if (e.target.checked) {
      setSameBillingChecked(true);
    } else {
      setSameBillingChecked(false);
    }
  };

  const handleShippingChange = (e) => {
    if (e.target.name === "ground-shipping") {
      setGroundShipping(true);
      setExpeditedShipping(false);
      setOvernightShipping(false);
      setShippingType("G");
      setShippingCost(6.99);
    } else if (e.target.name === "expedited-shipping") {
      setGroundShipping(false);
      setExpeditedShipping(true);
      setOvernightShipping(false);
      setShippingType("E");
      setShippingCost(14.99);
    } else if (e.target.name === "overnight-shipping") {
      setGroundShipping(false);
      setExpeditedShipping(false);
      setOvernightShipping(true);
      setShippingType("O");
      setShippingCost(24.99);
    }
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();

    const cartIsValid = await checkStock();
    if (!cartIsValid) {
      navigate("/cart");
      return;
    }

    let phoneCopy = phone.replaceAll("+", "");
    phoneCopy = phoneCopy.replaceAll("-", "");
    phoneCopy = phoneCopy.replaceAll("(", "");
    phoneCopy = phoneCopy.replaceAll(")", "");
    phoneCopy = phoneCopy.replaceAll(" ", "");

    let d = new Date();
    const currMonth = d.getMonth();
    const currYear = d.getFullYear();
    let isExpired;

    if (cardYear < currYear) {
      isExpired = true;
    } else if (currYear === Number(cardYear) && cardMonth <= currMonth + 1) {
      isExpired = true;
    } else {
      isExpired = false;
    }

    if (isNaN(Number(phoneCopy)) || phoneCopy.length !== 10) {
      setMessage("Your phone number must be 10 numbers.");
      setShowModal(true);
    } else if (isNaN(Number(shippingZip)) || shippingZip.length !== 5) {
      setMessage("Your shipping zip code must be 5 numbers.");
      setShowModal(true);
    } else if (
      !sameBillingChecked &&
      (isNaN(Number(billingZip)) || billingZip.length !== 5)
    ) {
      setMessage("Your billing zip code must be 5 numbers.");
      setShowModal(true);
    } else if (
      isNaN(Number(securityCode)) ||
      (securityCode.length !== 3 && securityCode.length !== 4)
    ) {
      setMessage("Your security code must be 3 or 4 numbers");
      setShowModal(true);
    } else if (isExpired) {
      setMessage("Your card is expired.");
      setShowModal(true);
    } else if (
      !sameBillingChecked &&
      (!billingName ||
        !billingAdd1 ||
        !billingCity ||
        !billingState ||
        !billingZip)
    ) {
      setMessage(
        "You must enter a complete billing address or select same as shipping."
      );
      setShowModal(true);
    } else {
      if (sameBillingChecked) {
        setBillingName(shippingName);
        setBillingAdd1(shippingAdd1);
        setBillingAdd2(shippingAdd2);
        setBillingCity(shippingCity);
        setBillingState(shippingState);
        setBillingZip(shippingZip);
      }

      const billName = sameBillingChecked ? shippingName : billingName;
      const billAdd1 = sameBillingChecked ? shippingAdd1 : billingAdd1;
      const billAdd2 = sameBillingChecked ? shippingAdd2 : billingAdd2;
      const billCity = sameBillingChecked ? shippingCity : billingCity;
      const billState = sameBillingChecked ? shippingState : billingState;
      const billZip = sameBillingChecked ? shippingZip : billingZip;

      sendFormInput({
        email,
        phone,
        shippingName,
        shippingAdd1,
        shippingAdd2,
        shippingCity,
        shippingState,
        shippingZip,
        cardName,
        cardMonth,
        cardYear,
        securityCode,
        billName,
        billAdd1,
        billAdd2,
        billCity,
        billState,
        billZip,
        shippingCost,
      });
      setIsFormValid(true);
    }
  };

  return (
    <div className="page-title">
      <InfoModal
        showModal={showModal}
        closeModal={() => setShowModal(false)}
        title="Invalid Input"
        message={message}
      />
      <Form
        id="checkout-form"
        name="checkout-form"
        onSubmit={handleCheckoutSubmit}
      >
        <ListGroup variant="flush">
          <ListGroup.Item>
            <h3>Checkout</h3>
          </ListGroup.Item>
          <ListGroup.Item>
            <h5>Contact Information</h5>
            <Form.Group className="mb-4">
              <Row className="checkout-row">
                <Col md={3}>
                  <Form.Label className="detail-padding">Email:</Form.Label>
                </Col>
                <Col md={9}>
                  <Form.Control
                    value={email}
                    size="sm"
                    type="email"
                    maxLength="50"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  ></Form.Control>
                </Col>
              </Row>

              <Row className="checkout-row">
                <Col md={3}>
                  <Form.Label className="detail-padding">
                    Phone Number:
                  </Form.Label>
                </Col>
                <Col md={9}>
                  <Form.Control
                    value={phone}
                    size="sm"
                    type="tel"
                    maxLength="10"
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  ></Form.Control>
                </Col>
              </Row>
            </Form.Group>
          </ListGroup.Item>

          <ListGroup.Item>
            <h5>Shipping Address</h5>
            <Form.Group className="mb-4">
              <Row className="checkout-row">
                <Col md={3}>
                  <Form.Label className="detail-padding">Full Name:</Form.Label>
                </Col>
                <Col md={9}>
                  <Form.Control
                    value={shippingName}
                    type="text"
                    maxLength="60"
                    size="sm"
                    onChange={(e) => setShippingName(e.target.value)}
                    required
                  ></Form.Control>
                </Col>
              </Row>

              <Row className="checkout-row">
                <Col md={3}>
                  <Form.Label className="detail-padding">
                    Address Line 1:
                  </Form.Label>
                </Col>
                <Col md={9}>
                  <Form.Control
                    value={shippingAdd1}
                    type="text"
                    maxLength="50"
                    size="sm"
                    onChange={(e) => setShippingAdd1(e.target.value)}
                    required
                  ></Form.Control>
                </Col>
              </Row>

              <Row className="checkout-row">
                <Col md={3}>
                  <Form.Label className="detail-padding">
                    Address Line 2:
                  </Form.Label>
                </Col>
                <Col md={9}>
                  <Form.Control
                    value={shippingAdd2}
                    size="sm"
                    type="text"
                    maxLength="50"
                    onChange={(e) => setShippingAdd2(e.target.value)}
                  ></Form.Control>
                </Col>
              </Row>

              <Row className="checkout-row">
                <Col md={3}>
                  <Form.Label className="detail-padding">City:</Form.Label>
                </Col>
                <Col md={9}>
                  <Form.Control
                    value={shippingCity}
                    size="sm"
                    type="text"
                    maxLength="50"
                    onChange={(e) => setShippingCity(e.target.value)}
                    required
                  ></Form.Control>
                </Col>
              </Row>

              <Row className="checkout-row">
                <Col md={3}>
                  <Form.Label className="detail-padding">State:</Form.Label>
                </Col>
                <Col md={4}>
                  <Form.Select
                    as="select"
                    size="sm"
                    onChange={(e) => setShippingState(e.target.value)}
                    required
                    value={shippingState}
                  >
                    <option></option>
                    {stateAbbr.map((state) => (
                      <option value={state} key={state}>
                        {state}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={1}>
                  <Form.Label className="detail-padding">Zip:</Form.Label>
                </Col>
                <Col md={4}>
                  <Form.Control
                    value={shippingZip}
                    size="sm"
                    type="text"
                    maxLength="5"
                    onChange={(e) => setShippingZip(e.target.value)}
                    required
                  ></Form.Control>
                </Col>
              </Row>
            </Form.Group>
          </ListGroup.Item>

          <ListGroup.Item>
            <h5>Payment Method</h5>
            <Form.Group className="mb-4">
              <Row className="checkout-row">
                <Col md={3}>
                  <Form.Label className="detail-padding">
                    Card Number:
                  </Form.Label>
                </Col>
                <Col md={9}>
                  <Form.Control
                    className="center-text"
                    type="text"
                    size="sm"
                    max_length="16"
                    placeholder="** THIS IS A MOCK ECOMMERCE SITE **"
                    disabled
                  ></Form.Control>
                </Col>
              </Row>

              <Row className="checkout-row">
                <Col md={3}>
                  <Form.Label className="detail-padding" value={cardName}>
                    Name on Card:
                  </Form.Label>
                </Col>
                <Col md={9}>
                  <Form.Control
                    type="text"
                    size="sm"
                    onChange={(e) => setCardName(e.target.value)}
                    required
                  ></Form.Control>
                </Col>
              </Row>

              <Row className="checkout-row">
                <Col md={3}>
                  <Form.Label className="detail-padding">Month:</Form.Label>
                </Col>
                <Col md={4}>
                  <Form.Select
                    size="sm"
                    onChange={(e) => setCardMonth(e.target.value)}
                    required
                  >
                    <option></option>
                    {months.map((month) => (
                      <option value={month} key={month}>
                        {month}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={1}>
                  <Form.Label className="detail-padding">Year:</Form.Label>
                </Col>
                <Col md={4}>
                  <Form.Select
                    size="sm"
                    onChange={(e) => setCardYear(e.target.value)}
                    required
                  >
                    <option></option>
                    {expirationYears.map((year) => (
                      <option value={year} key={year}>
                        {year}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={1}></Col>
              </Row>

              <Row className="checkout-row">
                <Col md={3}>
                  <Form.Label className="detail-padding" value={cardName}>
                    Security Code:
                  </Form.Label>
                </Col>
                <Col md={3}>
                  <Form.Control
                    type="text"
                    size="sm"
                    maxLength="4"
                    onChange={(e) => setSecurityCode(e.target.value)}
                    required
                  ></Form.Control>
                </Col>
                <Col md={5}>
                  <Form.Label className="detail-padding">
                    Billing Address Same as Shipping:
                  </Form.Label>
                </Col>
                <Col md={1}>
                  <Form.Check
                    className="detail-padding"
                    checked={sameBillingChecked}
                    onChange={(e) => handleCheckboxBilling(e)}
                  ></Form.Check>
                </Col>
              </Row>
            </Form.Group>
          </ListGroup.Item>

          {!sameBillingChecked ? (
            <ListGroup.Item className="billing-address-form">
              <h5>Billing Address</h5>
              <Form.Group className="mb-4">
                <Row className="checkout-row">
                  <Col md={3}>
                    <Form.Label className="detail-padding">
                      Full Name:
                    </Form.Label>
                  </Col>
                  <Col md={9}>
                    <Form.Control
                      value={billingName}
                      type="text"
                      maxLength="60"
                      size="sm"
                      onChange={(e) => setBillingName(e.target.value)}
                      required={!sameBillingChecked ? true : null}
                    ></Form.Control>
                  </Col>
                </Row>

                <Row className="checkout-row">
                  <Col md={3}>
                    <Form.Label>Address Line 1:</Form.Label>
                  </Col>
                  <Col md={9}>
                    <Form.Control
                      value={billingAdd1}
                      type="text"
                      maxLength="50"
                      size="sm"
                      onChange={(e) => setBillingAdd1(e.target.value)}
                      required={!sameBillingChecked ? true : null}
                    ></Form.Control>
                  </Col>
                </Row>

                <Row className="checkout-row">
                  <Col md={3}>
                    <Form.Label>Address Line 2:</Form.Label>
                  </Col>
                  <Col md={9}>
                    <Form.Control
                      value={billingAdd2}
                      size="sm"
                      type="text"
                      maxLength="50"
                      onChange={(e) => setBillingAdd2(e.target.value)}
                    ></Form.Control>
                  </Col>
                </Row>

                <Row className="checkout-row">
                  <Col md={3}>
                    <Form.Label>City:</Form.Label>
                  </Col>
                  <Col md={9}>
                    <Form.Control
                      value={billingCity}
                      size="sm"
                      type="text"
                      maxLength="50"
                      onChange={(e) => setBillingCity(e.target.value)}
                      required={!sameBillingChecked ? true : null}
                    ></Form.Control>
                  </Col>
                </Row>

                <Row className="checkout-row">
                  <Col md={3}>
                    <Form.Label>State:</Form.Label>
                  </Col>
                  <Col md={4}>
                    <Form.Select
                      size="sm"
                      required={!sameBillingChecked ? true : null}
                      onChange={(e) => setBillingState(e.target.value)}
                    >
                      <option></option>
                      {stateAbbr.map((state) => (
                        <option value={state} key={state}>
                          {state}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={1}>
                    <Form.Label>Zip:</Form.Label>
                  </Col>
                  <Col md={4}>
                    <Form.Control
                      value={billingZip}
                      size="sm"
                      type="text"
                      maxLength="5"
                      onChange={(e) => setBillingZip(e.target.value)}
                      required={!sameBillingChecked ? true : null}
                    ></Form.Control>
                  </Col>
                </Row>
              </Form.Group>
            </ListGroup.Item>
          ) : null}

          <ListGroup.Item>
            <h5>Shipping Options</h5>
            <div className="detail-padding">
              <Row>
                <Col md={2}>
                  <Form.Check
                    className="shipping-radio"
                    inline
                    name="ground-shipping"
                    type="radio"
                    checked={groundShipping}
                    onChange={(e) => handleShippingChange(e)}
                  />
                </Col>
                <Col md={2} className="detail-padding">
                  <p className="inline">$6.99</p>
                </Col>
                <Col md={8} className="detail-padding">
                  <p className="inline">Ground Shipping (5-7 days)</p>
                </Col>
              </Row>

              <Row>
                <Col md={2}>
                  <Form.Check
                    className="shipping-radio"
                    inline
                    name="expedited-shipping"
                    type="radio"
                    checked={expeditedShipping}
                    onChange={(e) => handleShippingChange(e)}
                  />
                </Col>
                <Col md={2} className="detail-padding">
                  <p className="inline">$14.99</p>
                </Col>
                <Col md={8} className="detail-padding">
                  <p className="inline">Expedited Shipping (2-3 days)</p>
                </Col>
              </Row>

              <Row>
                <Col md={2}>
                  <Form.Check
                    className="shipping-radio"
                    inline
                    name="overnight-shipping"
                    type="radio"
                    checked={overnightShipping}
                    onChange={(e) => handleShippingChange(e)}
                  />
                </Col>
                <Col md={2} className="detail-padding">
                  <p className="inline">$24.99</p>
                </Col>
                <Col md={8} className="detail-padding">
                  <p className="inline">Overnight Shipping (1 day)</p>
                </Col>
              </Row>
            </div>
          </ListGroup.Item>
        </ListGroup>
        <div className="flex-center">
          <Button type="submit" className="btn-block order-btn">
            Place Order
          </Button>
        </div>
      </Form>
      <Button className="return-to-cart" onClick={() => navigate("/cart")}>
        Return to Cart
      </Button>
    </div>
  );
}

export default Checkout;
