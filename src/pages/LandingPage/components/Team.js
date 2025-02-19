import React from "react";
import { Col, Row } from "reactstrap";
import styled from "styled-components";
import team1 from '../img/team/5.png'
import team2 from '../img/team/6.png'
import team3 from '../img/team/7.png'


const Container = styled.div`

    display: flex;
    flex-direction: column;
    align-items: center;
.row{
width:78%
}
  .section-title {
    margin-bottom: 70px;
    .h2 {
      position: relative;
      
          padding-top: 52px;
      margin-bottom: 15px;
      padding-bottom: 15px;
      &::after {
        position: absolute;
        content: "";
 background: linear-gradient(to right, #f7bb78 0%, #fdfcfb 100%);

  height: 3px;
    width: 250px;
    bottom: 0;
    margin-left: -32px;
    left: 35%;
      }
    }
  }
`;
export const Team = (props) => {
  return (
    <div id="team" className="text-center">
      <Container className="container">
        <Col className="col-md-8 col-md-offset-2 section-title">
          <h2 className="h2">Meet the Team</h2>
          <p>
            "Meet the dynamic team that drives our success,
            combining expertise, creativity, and dedication.
            Together, we work tirelessly to deliver innovative solutions and exceed client expectations.
          </p>
        </Col>
        <Row id="row">
          <Col className="col-md-4 col-sm-6 team">
            <div className="thumbnail">
              {" "}
              <img src={team2} alt="..." className="team-img" />
              <div className="caption">
                <h4 className="h4">Pradeep Tomar</h4>
                <p>Founder & CEO President - Sales & Marketing</p>
              </div>
            </div>
          </Col>
          <Col className="col-md-4 col-sm-6 team">
            <div className="thumbnail">
              {" "}
              <img src={team1} alt="..." className="team-img" />
              <div className="caption">
                <h4 className="h4">Badal Singh</h4>
                <p>Co-Founder, CTO & Director - Technology</p>
              </div>
            </div>
          </Col>

          <Col className="col-md-4 col-sm-6 team">
            <div className="thumbnail">
              {" "}
              <img src={team3} alt="..." className="team-img" />
              <div className="caption">
                <h4 className="h4">Abhay Haria</h4>
                <p>Co-Founder & Vice President - Sales & Marketing</p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
