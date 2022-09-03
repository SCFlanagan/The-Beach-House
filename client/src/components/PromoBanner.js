import React from "react";
import { Row, Col } from "react-bootstrap";

function PromoBanner() {
  const colors = ["#ff598f", "#fd8a5e", "#e0e300", "#01dddd", "#00bfaf"];
  const summerText = [];
  for (let i = 0; i < 100; i++) {
    let lastDigit = Number(i.toString().slice(-1));

    if (lastDigit === 0 || lastDigit === 5) {
      summerText.push(colors[0]);
    } else if (lastDigit === 1 || lastDigit === 6) {
      summerText.push(colors[1]);
    } else if (lastDigit === 2 || lastDigit === 7) {
      summerText.push(colors[2]);
    } else if (lastDigit === 3 || lastDigit === 8) {
      summerText.push(colors[3]);
    } else if (lastDigit === 4 || lastDigit === 9) {
      summerText.push(colors[4]);
    }
  }

  return (
    <div className="page-title">
      <div className="banner-container">
        <h3 className="summer-text">
          {summerText.map((text, index) => (
            <span style={{ color: text }} key={index}>
              SUMMER
            </span>
          ))}
        </h3>
        <Row className="fill-space banner-content">
          <Col md={3} xs={12}></Col>
          <Col md={6} xs={12} className="special-banner flex-center">
            <div className="center-text inner-card">
              <h1 className="banner-text">20% OFF</h1>
              <h4 className="banner-subtext">
                USE PROMO CODE <span className="banner-code">'SUMMER20'</span>{" "}
                AT CHECKOUT
              </h4>
            </div>
          </Col>
          <Col md={3} xs={12}></Col>
        </Row>
      </div>
    </div>
  );
}

export default PromoBanner;
