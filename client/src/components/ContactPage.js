import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";

function ContactPage() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(e);
    const { data } = await axios.post("/api/contacts/create/", {
      subject,
      content,
      email,
    });
    if (data) {
      setShowConfirmation(true);
    }
  };

  return (
    <div className="contact-page">
      <h1 className="center-text page-title">Contact Us</h1>
      {showConfirmation ? (
        <div
          className="flex-center center-text"
          style={{ width: "60%", margin: "5rem auto" }}
        >
          <p>
            Your message has been sent. <br /> We will get back to you as soon
            as possible.
          </p>
        </div>
      ) : (
        <Form onSubmit={handleSubmit} className="contact-form">
          <Form.Label className="bold">Your Email Address</Form.Label>
          <Form.Control
            type="email"
            maxLength="50"
            required
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
          <Form.Label className="detail-padding bold">Subject</Form.Label>
          <Form.Control
            type="text"
            maxLength="50"
            onChange={(e) => setSubject(e.target.value)}
          ></Form.Control>
          <Form.Label className="detail-padding bold">
            How can we help?
          </Form.Label>
          <Form.Control
            as="textarea"
            maxLength="1000"
            className="contact-content"
            onChange={(e) => setContent(e.target.value)}
            required
          ></Form.Control>
          <div className="flex-center full-padding">
            <Button
              type="submit"
              style={{ width: "10rem" }}
              className="btn-block"
            >
              Send
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
}

export default ContactPage;
