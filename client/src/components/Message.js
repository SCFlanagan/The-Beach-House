import React from "react";
import { Alert } from "react-bootstrap";

function Message({ variant, children, isPageMessage }) {
  return (
    <Alert
      variant={variant}
      style={{ textAlign: "center" }}
      className={isPageMessage ? "page-title" : null}
    >
      {children}
    </Alert>
  );
}

export default Message;
