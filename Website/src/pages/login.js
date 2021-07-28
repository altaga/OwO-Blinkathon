// Basic imports
import '../assets/main.css';
import { Component } from 'react';
import { connect } from "react-redux"
import { login_action } from '../redux/actions/syncActions/loginAction';
import account_action from '../redux/actions/asyncActions/accountAction';
import { Form, FormGroup, Label, Input, Card, CardBody, CardHeader, Button, Row, Col } from 'reactstrap';
import history from "../utils/history";
import { isDesktop } from 'react-device-detect';
import { Redirect } from "react-router-dom";

class Login extends Component {

  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      disable: false,
      overlays:"none",
    };
    this.loginButton = this.loginButton.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async loginButton() {
    this.setState({
      disable: true,
      overlays:"block",
    })
    const unirest = require('unirest');
    unirest('GET', 'https://e9wzhv9k7d.execute-api.us-east-1.amazonaws.com/login')
      .headers({
        'email': `${this.state.email}`,
        'password': `${this.state.password}`
      })
      .end((res) => {
        if (res.error) throw new Error(res.error);
        this.setState({
          disable: false,
          overlays:"none"
        })
        let response = JSON.parse(res.raw_body)
        if (response.login === "YES" && response.kind === "adult") {
          this.props.login_action(response)
          this.props.account_action(response.data.id)
          history.push("/main");
        }
        else if (response.login === "YES" && response.kind === "kid") {
          this.props.login_action(response)
          this.props.account_action(response.data.id)
          history.push("/main-kid");
        }
      });
  }

  handleChange(event) {
    if (event.target.id === "email") {
      this.setState({
        email: event.target.value
      })
    }
    else if (event.target.id === "password") {
      this.setState({
        password: event.target.value
      })
    }
  }

  render() {
    if (isDesktop){
      return <Redirect to="/desktop" />
    }
    return (
      <div className="App">
        <div style={{ display: this.state.overlays }} id="overlay">
          <div style={{ paddingTop: "34vh" }} id="wrapper">
            <div id="container">
              <h1>Logging in</h1>
              <h1>OwO Account</h1>
            </div>
          </div>
        </div>
        <Row md="3" style={{ paddingTop: "50%" }}>
          <Col xs="1">
          </Col>
          <Col xs="10">
            <>
              <Card style={{backgroundColor:"white", borderRadius:"25px"}}>
                <CardHeader>
                  Login
                </CardHeader>
                <CardBody>
                  <Form onChange={this.handleChange}>
                    <FormGroup>
                      <Label for="exampleEmail">Email</Label>
                      <Input type="email" name="email" id="email" placeholder="OwO Email" />
                    </FormGroup>
                    <FormGroup>
                      <Label for="examplePassword">Password</Label>
                      <Input type="password" name="password" id="password" placeholder="OwO Password" />
                    </FormGroup>
                  </Form>
                  <br />
                  <Row>
                    <Col>
                    <Button style={{ borderRadius:"25px", background: "#2461fb", borderColor: "#2461fb" }} onClick={this.loginButton} disabled={this.state.disable}>
                        Login
                      </Button>
                    </Col>
                    <Col>
                    <Button style={{ borderRadius:"25px"}} onClick={() => history.push("/")} disabled={this.state.disable}>
                        Return
                      </Button>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </>
          </Col>
          <Col xs="1">
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
      account_reducer: state.account_reducer,
      sol_reducer: state.sol_reducer,
      login_reducer: state.login_reducer,

  }
}

const mapDispatchToProps =
{
  account_action,
  login_action
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);