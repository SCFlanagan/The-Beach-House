import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { logout } from "../actions/userActions";
import { emptyProductDetails } from "../actions/productActions";

function Header() {
  const dispatch = useDispatch();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const userLogIn = useSelector((state) => state.userLogIn);
  const { userInfo } = userLogIn;

  useEffect(() => {
    if (userInfo && Object.keys(userInfo).length) {
      setIsLoggedIn(true);
    }
  }, [userInfo, setIsLoggedIn]);

  const handleLogout = () => {
    dispatch(logout());
    window.location.reload();
  };

  // Deselect other nav links in other nav containers
  const handleNavClick = (type) => {
    if (location.slice(0, 10) === "/products/") dispatch(emptyProductDetails());
    if (type === "home") {
      const navLinks = document.getElementsByClassName("nav-link");
      navLinks.forEach((elem) => {
        elem.className = "nav-link";
      });
    } else if (type === "product") {
      const iconNavLinks = document.getElementsByClassName("icon-nav-link");
      iconNavLinks.forEach((elem) => {
        elem.className = "nav-link icon-nav-link";
      });
    } else if (type === "icon") {
      const productNavLinks =
        document.getElementsByClassName("product-nav-link");
      productNavLinks.forEach((elem) => {
        elem.className = "nav-link icon-nav-link";
      });
    }
  };

  return (
    <Navbar bg="black" variant="dark" expand="lg" collapseOnSelect fixed="top">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand href="/" onClick={() => handleNavClick("home")}>
            The Beach House
          </Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav>
            <LinkContainer to="/sunglasses">
              <Nav.Link
                className="product-nav-link"
                onClick={() => handleNavClick("product")}
              >
                Sunglasses
              </Nav.Link>
            </LinkContainer>

            <LinkContainer to="/towels">
              <Nav.Link
                className="product-nav-link"
                onClick={() => handleNavClick("product")}
              >
                Towels
              </Nav.Link>
            </LinkContainer>

            <LinkContainer to="/blankets">
              <Nav.Link
                className="product-nav-link"
                onClick={() => handleNavClick("product")}
              >
                Blankets
              </Nav.Link>
            </LinkContainer>

            <LinkContainer to="/umbrellas">
              <Nav.Link
                className="product-nav-link"
                onClick={() => handleNavClick("product")}
              >
                Umbrellas
              </Nav.Link>
            </LinkContainer>

            <NavDropdown
              title="Fun"
              id="basic-nav-dropdown"
              renderMenuOnMount={true}
            >
              <LinkContainer to="/surfboards">
                <NavDropdown.Item onClick={() => handleNavClick("dropdown")}>
                  Surfboards
                </NavDropdown.Item>
              </LinkContainer>

              <LinkContainer to="/floats">
                <NavDropdown.Item onClick={() => handleNavClick("dropdown")}>
                  Floats
                </NavDropdown.Item>
              </LinkContainer>

              <LinkContainer to="/games">
                <NavDropdown.Item onClick={() => handleNavClick("dropdown")}>
                  Games
                </NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>

            <LinkContainer to="/sale">
              <Nav.Link
                className="product-nav-link"
                id="sale"
                onClick={() => handleNavClick("product")}
              >
                Sale
              </Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>

        <Nav className="ms-auto flex-row">
          {isLoggedIn ? (
            <LinkContainer to="/favorites">
              <Nav.Link
                className="icon-nav-link"
                onClick={() => handleNavClick("icon")}
              >
                <i className="fa-regular fa-heart fa-hover-hidden nav-icons"></i>
                <i className="fa-solid fa-heart fa-hover-show nav-icons"></i>
              </Nav.Link>
            </LinkContainer>
          ) : null}
          <NavDropdown
            title={<i className="fas fa-user nav-icons"></i>}
            id="basic-nav-dropdown"
            renderMenuOnMount={true}
          >
            {!isLoggedIn ? (
              <div>
                <LinkContainer to="/login">
                  <NavDropdown.Item>Log In</NavDropdown.Item>
                </LinkContainer>

                <LinkContainer to="/signup">
                  <NavDropdown.Item>Sign Up</NavDropdown.Item>
                </LinkContainer>
              </div>
            ) : null}
            {isLoggedIn ? (
              <div>
                <LinkContainer to="/profile">
                  <NavDropdown.Item>Profile</NavDropdown.Item>
                </LinkContainer>

                <LinkContainer to="/orders">
                  <NavDropdown.Item>Orders</NavDropdown.Item>
                </LinkContainer>

                <LinkContainer to="/reviews">
                  <NavDropdown.Item>Reviews</NavDropdown.Item>
                </LinkContainer>

                <NavDropdown.Item onClick={handleLogout}>
                  Log Out
                </NavDropdown.Item>
              </div>
            ) : null}
          </NavDropdown>

          <LinkContainer to="/cart">
            <Nav.Link
              className="icon-nav-link"
              onClick={() => handleNavClick("icon")}
            >
              <i className="fas fa-shopping-cart nav-icons"></i>
            </Nav.Link>
          </LinkContainer>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;
