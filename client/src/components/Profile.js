import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ListGroup, Row, Col } from "react-bootstrap";
import ProfilePersonalForm from "./ProfilePersonalForm";
import ProfileContactForm from "./ProfileContactForm";
import ProfileAddressForm from "./ProfileAddressForm";

function Profile() {
  const navigate = useNavigate();
  const [showPersonalForm, setShowPersonalForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const userLogIn = useSelector((state) => state.userLogIn);
  const { userInfo } = userLogIn;

  const userProfile = useSelector((state) => state.userProfile);
  const { profile } = userProfile;

  useEffect(() => {
    if (userInfo && !Object.keys(userInfo).length) {
      navigate(-1);
    }
  }, [userInfo, navigate]);

  return (
    <div className="profile-page">
      <h1 className="text-center">Profile</h1>
      <Row>
        <Col lg={2}></Col>
        <Col>
          <ListGroup variant="flush" style={{ marginTop: "4rem" }}>
            {showPersonalForm ? (
              <ListGroup.Item className="profile-section">
                <ProfilePersonalForm
                  closeForm={() => setShowPersonalForm(false)}
                  profile={profile}
                  userInfo={userInfo}
                />
              </ListGroup.Item>
            ) : (
              <ListGroup.Item className="profile-section">
                <i
                  className="fas fa-edit profile-edit-icon"
                  onClick={() => setShowPersonalForm(true)}
                ></i>
                <h5 className="mb-4">Personal Information</h5>
                <Row>
                  <Col md={4}>
                    <p className="profile-line bold">Name:</p>
                  </Col>
                  <Col>
                    <p className="profile-line">
                      {`${userInfo.first_name} ${userInfo.last_name}`}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <p className="profile-line bold">Date of Birth:</p>
                  </Col>
                  <Col>
                    <p className="profile-line">
                      {profile && profile.dob_month && profile.dob_day ? (
                        `${[profile.dob_month]} ${profile.dob_day}`
                      ) : (
                        <i className="half-opacity">None</i>
                      )}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <p className="profile-line bold">Password:</p>
                  </Col>
                  <Col>
                    <p className="profile-line">********</p>
                  </Col>
                </Row>
              </ListGroup.Item>
            )}

            {showContactForm ? (
              <ListGroup.Item>
                <ProfileContactForm
                  closeForm={() => setShowContactForm(false)}
                />
              </ListGroup.Item>
            ) : (
              <ListGroup.Item className="profile-section">
                <i
                  className="fas fa-edit profile-edit-icon"
                  onClick={() => setShowContactForm(true)}
                ></i>
                <h5 style={{ marginBottom: "2rem" }}>Contact Information</h5>
                <Row>
                  <Col md={4}>
                    <p className="profile-line bold">Email:</p>
                  </Col>
                  <Col>
                    <p className="profile-line">{userInfo.email}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <p className="profile-line bold">Phone Number:</p>
                  </Col>
                  <Col>
                    {profile && profile.phone ? (
                      profile.phone
                    ) : (
                      <i className="half-opacity">None</i>
                    )}
                  </Col>
                </Row>
              </ListGroup.Item>
            )}

            {showAddressForm ? (
              <ListGroup.Item className="profile-section">
                <ProfileAddressForm
                  closeForm={() => setShowAddressForm(false)}
                />
              </ListGroup.Item>
            ) : (
              <ListGroup.Item className="profile-section">
                <i
                  className="fas fa-edit profile-edit-icon"
                  onClick={() => setShowAddressForm(true)}
                ></i>
                <h5>Address</h5>
                <div className="flex-center">
                  {profile &&
                  profile.address_1 &&
                  profile.address_city &&
                  profile.address_state &&
                  profile.address_zip ? (
                    <div>
                      <p className="profile-address">{profile.address_1}</p>
                      <p className="profile-address">{profile.address_2}</p>
                      <p className="profile-address">{`${profile.address_city}, ${profile.address_state} ${profile.address_zip}`}</p>
                    </div>
                  ) : (
                    <i className="half-opacity large-text">None</i>
                  )}
                </div>
              </ListGroup.Item>
            )}
          </ListGroup>
        </Col>
        <Col lg={2}></Col>
      </Row>
    </div>
  );
}

export default Profile;
