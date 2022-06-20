import React from "react";
import { Spinner } from "react-bootstrap";

function Loader() {
  return (
    <div className="spinner-container">
      <Spinner animation="border" role="status" id="loading-spinner">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </div>
  );
}

export default Loader;
