// Basic imports
import '../assets/app-main.css';
import { Component } from 'react';
import { Button, Row, Col } from 'reactstrap';
import history from "../utils/history";
import Renders from "../assets/Render2.gif"
import { isDesktop } from 'react-device-detect';
import { Redirect } from "react-router-dom";

class Index extends Component {

  render() {
    if (isDesktop){
      return <Redirect to="/desktop" />
    }
    return (
      <div className="Apps" >
        <style>{`body {background: #2461fb;}`}</style>
        <div style={{ padding: "5%" }}>
          <br />
          <div style={{paddingTop:"30px"}}>
          <img src={Renders} alt="Cat" height="200vh" width="340vh" />
          </div>
          <div style={{margin:"20px",paddingTop:"30px",fontSize:"1rem",color:"white"}}>
            Super App that grants young people financial power, incorporating the next generations to finance.
          </div>
          <br />
          <Row style={{paddingTop:"30px"}}>
            <Col>
            <Button style={{ paddingBottom: "10px", borderRadius: "25px", fontSize: "1.5rem", background: "white", borderColor: "white", color:"black" }} onClick={() => history.push("/login")}>
                <div style={{ paddingRight: "13px", paddingLeft: "13px" }}>Login</div>
              </Button>
            </Col>
            <Col>
              <Button style={{ paddingBottom: "10px", borderRadius: "25px", fontSize: "1.5rem", background: "white", borderColor: "white", color:"black" }} onClick={() => history.push("/register")}>
                Sign Up
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default Index;