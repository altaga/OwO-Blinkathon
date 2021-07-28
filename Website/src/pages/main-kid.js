// Basic imports
import '../assets/main.css';
import { Component } from 'react';
import { connect } from "react-redux"
import { login_action } from '../redux/actions/syncActions/loginAction';
import { Redirect } from "react-router-dom";
import { Button, Row, Col } from 'reactstrap';
import TabsNav from '../components-k/tabs';
import HomeIcon from "@material-ui/icons/Home"
import PaymentIcon from '@material-ui/icons/Payment';
import Summary from "../components-k/summary"
import Cardss from "../shared/card"
import Coupons from "../components-k/coupons"
import GamesIcon from '@material-ui/icons/Games';
import { isDesktop } from 'react-device-detect';

class MainKid extends Component {

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
    if (this.props.login_reducer.value.login !== "YES" || this.props.login_reducer.value.kind !== "kid") {
      return <Redirect to="/" />
    }
    if (isDesktop){
      return <Redirect to="/desktop" />
    }
    if (this.props.login_reducer.value.data.accounts.length === 0) {
      setTimeout(
        () => this.logoutButton(),
        3000
      );
      return <>
        <div className="App">
          <div style={{ display: this.state.overlays2 }} id="overlay">
            <div style={{ paddingTop: "34vh" }} id="wrapper">
              <div id="container">
                <h1>OwO Kid Account</h1>
                <h1>Active this Account First</h1>
              </div>
            </div>
          </div>
        </div>
      </>
    }
    else {
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
                    <Coupons />,
                    <Cardss />
                  ]}
                  tabsName={[
                    "Home",
                    "Rewards",
                    "Pay"
                  ]}
                  tabsIcon={[
                    <HomeIcon />,
                    <GamesIcon />,
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

export default connect(mapStateToProps, mapDispatchToProps)(MainKid);