import React, { Component } from 'react';
import '../assets/app-main.css';
import Renders from "../assets/Render2.gif"
import { isMobile } from 'react-device-detect';
import { Redirect } from 'react-router-dom';

class Desktop extends Component {

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    if (isMobile) {
      return <Redirect to="/" />
    }
    else {
      return (
        <div className="Apps" >
          <style>{`body {background: #2461fb;}`}</style>
          <div style={{ padding: "5%" }}>
            <br />
            <div style={{ paddingTop: "30px" }}>
              <img src={Renders} alt="Cat" height="200vh" width="340vh" />
            </div>
            <div style={{ margin: "20px", paddingTop: "30px", fontSize: "3rem", color: "white" }}>
              Open in mobile for a better experience
            </div>
            <br />
          </div>
        </div>
      );
    }
  }
}

export default Desktop;