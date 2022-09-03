import React from "react";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import PromoBanner from "./PromoBanner";
import LandingItem from "./LandingItem";

function Landing() {
  const categoryInfo = [
    {
      category: "Sunglasses",
      image:
        "https://thebeachhouse-photo-bucket.s3.amazonaws.com/ombreroundsunglasses.png",
    },
    {
      category: "Towels",
      image:
        "https://thebeachhouse-photo-bucket.s3.amazonaws.com/candystripetowel.webp",
    },
    {
      category: "Blankets",
      image:
        "https://thebeachhouse-photo-bucket.s3.amazonaws.com/redwhiteplaidblanket.jpeg",
    },
    {
      category: "Umbrellas",
      image:
        "https://thebeachhouse-photo-bucket.s3.amazonaws.com/classiccoralumbrella.png",
    },
    {
      category: "Surfboards",
      image:
        "https://thebeachhouse-photo-bucket.s3.amazonaws.com/oahusufboard.jpeg",
    },
    {
      category: "Floats",
      image:
        "https://thebeachhouse-photo-bucket.s3.amazonaws.com/loungefloat.png",
    },
    {
      category: "Games",
      image:
        "https://thebeachhouse-photo-bucket.s3.amazonaws.com/retrocornhole.png",
    },
    {
      category: "Sale",
      image:
        "https://thebeachhouse-photo-bucket.s3.amazonaws.com/rainbowfloat.png",
    },
  ];

  return (
    <div>
      <PromoBanner />
      <div>
        <Row>
          {categoryInfo.map((item) => (
            <Col key={item.category} sm={12} md={12} lg={6} xl={6}>
              <Link to={`/${item.category}`}>
                <LandingItem category={item.category} image={item.image} />
              </Link>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

export default Landing;
