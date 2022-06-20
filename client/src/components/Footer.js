import React from "react";
import { Container, Row, Col } from "react-bootstrap";

function Footer() {
  return (
    <footer>
      <Container>
        <Row>
          <Col className="text-center py-3">
            <p className="footer-line">
              Questions?{" "}
              <a className="contact-link" href="/contact">
                Contact Us
              </a>
            </p>
            <p className="footer-line">Copyright &copy; The Beach House </p>
            <p className="footer-line">
              Mock eCommerce Site by{" "}
              <a
                href="http://www.susan-flanagan.com"
                target="_blank"
                rel="noreferrer"
                className="contact-link"
              >
                Susan Flanagan
              </a>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
