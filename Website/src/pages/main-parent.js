// Basic imports
import '../assets/main.css';
import { Component } from 'react';
import { connect } from "react-redux"
import { login_action } from '../redux/actions/syncActions/loginAction';
import { Redirect } from "react-router-dom";
import { Button, Row, Col } from 'reactstrap';
import TabsNav from '../components-p/tabs';
import HomeIcon from "@material-ui/icons/Home"
import FaceIcon from '@material-ui/icons/Face';
import PaymentIcon from '@material-ui/icons/Payment';
import Summary from "../components-p/summary"
import Kids from '../components-p/kids';
import Cardss from "../shared/card"
import { isDesktop } from 'react-device-detect';

class MainParent extends Component {

  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      disable: false
    };
    this.logoutButton = this.logoutButton.bind(this);
  }

  componentDidMount() {

  }

  logoutButton() {
    let response = { "login": "NOPE" }
    this.props.login_action(response)
  }

  render() {
    if (this.props.login_reducer.value.login !== "YES" || this.props.login_reducer.value.kind !== "adult") {
      return <Redirect to="/" />
    }
    if (isDesktop){
      return <Redirect to="/desktop" />
    }
    return (
      <div className="App">
        <div style={{ padding: "5%" }}>
          <Row md="2">
            <Col xs="6" style={{ fontSize: "2rem" }}>
              <div id="wrapper">
                <div id="container">
                  <h1>OwO</h1>
                </div>
              </div>
            </Col>
            <Col xs="6" style={{ textAlign: "right" }}>
              <Button style={{ borderRadius: "25px", background: "#2461fb", borderColor: "#2461fb" }} onClick={this.logoutButton} disabled={this.state.disable}>
                Logout
              </Button>
            </Col>
          </Row>
          <div style={{ paddingBottom: "14px" }}></div>
          <div style={{
                height: `64vh`,
                overflow: "scroll",
            }}>
          <Row>
            {(this.props.account_reducer.result.data !== undefined && !this.props.account_reducer.loading) ?
              <TabsNav
                tabs={[
                  <Summary />,
                  <Kids />,
                  <Cardss />
                ]}
                tabsName={[
                  "Home",
                  "Kids",
                  "Pay"
                ]}
                tabsIcon={[
                  <HomeIcon />,
                  <FaceIcon />,
                  <PaymentIcon />
                ]}
              /> :
              <div style={{ paddingTop: "34vh" }} id="wrapper">
                <div id="container">
                  <h1>Loading...</h1>
                  <h1>OwO</h1>
                </div>
              </div>
            }
          </Row>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    account_reducer: state.account_reducer,
    login_reducer: state.login_reducer
  }
}

const mapDispatchToProps =
{
  login_action,
}

export default connect(mapStateToProps, mapDispatchToProps)(MainParent);