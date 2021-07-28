import '../assets/main.css';
import { Component } from 'react';
import { Button, Row, Col, Form, FormGroup, Input } from 'reactstrap';
import history from "../utils/history";
import reactAutobind from 'react-autobind';
import { country_codes } from "../assets/country"
import { Redirect } from "react-router-dom";
import { isDesktop } from 'react-device-detect';

var validator = require('validator');
const unirest = require('unirest');

function correction(date) {
    var dateObj = new Date(Date.parse(date))
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear().toString();
    if (month < 10) {
        month = "0" + month.toString()
    }
    if (day < 10) {
        day = "0" + day.toString()
    }
    var newdate = month + "/" + day + "/" + year;
    return newdate
}

function validate(data) {
    let keys = Object.keys(data)
    for (let i = 0; i < 13; i++) {
        if (data[keys[i]] === undefined || data[keys[i]] === "") {
            return false
        }
    }
    if (!validator.isEmail(data[11])) {
        alert('Enter valid Email!')
        return false
    };
    return true
}

class Register extends Component {

    constructor() {
        super();
        this.state = {
            data: {},
            phoneprefix: "+",
            buttonDis: false,
            overlays: "none",
            overlays2: "none"
        }
        reactAutobind(this)
    }

    componentDidMount() {

    }


    complete() {
        this.setState({
            buttonDis: true,
            overlays: "block",
            overlays2: "none"
        }, () => {
            let temp = this.state.data
            temp[3] = this.state.phoneprefix + temp[3]
            temp[2] = correction(temp[2])
            if (validate(temp)) {
                let _this = this
                unirest('GET', 'https://e9wzhv9k7d.execute-api.us-east-1.amazonaws.com/create-solana-wallet')
                    .end((res) => {
                        if (res.error) throw new Error(res.error);
                        temp = {
                            'name': temp[0],
                            'lname': temp[1],
                            'solana-account': JSON.parse(res.raw_body)['solana-account'],
                            'solana-sign': JSON.parse(res.raw_body)["solana-sign"],
                            'phone': temp[3],
                            'email': temp[11],
                            'address': temp[6],
                            'city': temp[8],
                            'state': temp[9],
                            'country': temp[10],
                            'zip': temp[7],
                            'id_number': temp[4],
                            'birth': temp[2],
                            'nationality': temp[5],
                            'password': temp[12],
                            'kind': 'adult'
                        }
                        let __this = _this
                        unirest('GET', 'https://e9wzhv9k7d.execute-api.us-east-1.amazonaws.com/create-wallet')
                            .headers(temp)
                            .end((res) => {
                                if (res.error) throw new Error(res.error);
                                if (JSON.parse(res.raw_body).status === "ERROR") {
                                    console.log(JSON.parse(res.raw_body).status.message)
                                }
                                else {
                                    console.log(res.raw_body)
                                    let ___this = __this
                                    unirest('GET', 'https://e9wzhv9k7d.execute-api.us-east-1.amazonaws.com/create-client')
                                        .headers({
                                            'email': temp["email"],
                                            'ewallet': JSON.parse(res.raw_body).data.id,
                                            'name': temp["name"],
                                            'lname': temp["lname"],
                                            'solana-account': temp['solana-account'],
                                            'solana-sign': temp['solana-sign'],
                                            'phone': temp['phone'],
                                            'password': temp['password'],
                                            'kind': 'adult'
                                        })
                                        .end((res) => {
                                            if (res.error) throw new Error(res.error);
                                            console.log(res.raw_body)
                                            if (JSON.parse(res.raw_body).status === "ERROR") {
                                                console.log(JSON.parse(res.raw_body).status.message)
                                            }
                                            else {
                                                console.log(res.raw_body)
                                                let ____this = ___this
                                                ___this.setState({
                                                    overlays: "none",
                                                    overlays2: "block"
                                                }, () => {
                                                    unirest('GET', 'https://e9wzhv9k7d.execute-api.us-east-1.amazonaws.com/send-email')
                                                        .headers({
                                                            'email': temp["email"],
                                                            'password': temp['password']
                                                        })
                                                        .end((res) => {
                                                            if (res.error) throw new Error(res.error);
                                                            console.log(res.raw_body);
                                                        });
                                                    setTimeout(() => {
                                                        ____this.setState(
                                                            {
                                                                buttonDis: true,
                                                                overlays: "none",
                                                                overlays2: "none"
                                                            }, history.push("/"))
                                                    }, 2000);
                                                })
                                            }
                                        });
                                }
                            });
                    });
            }
            else {
                this.setState({
                    buttonDis: false,
                    overlays: "none",
                    overlays2: "none"
                })
            }
        })
    }

    handleChange(event) {
        let temp = this.state.data
        if (parseInt(event.target.id) === 10) {
            let code = ""
            let prefix = ""
            for (let i = 0; i < country_codes().length; i++) {
                if (country_codes()[i]["name"] === event.target.value) {
                    code = country_codes()[i]["iso_alpha2"]
                    prefix = "+" + country_codes()[i]["phone_code"]
                    break
                }
            }
            temp[event.target.id] = code
            this.setState({
                data: temp,
                phoneprefix: prefix
            })
        }
        else if (parseInt(event.target.id) === 5) {
            let code = ""
            for (let i = 0; i < country_codes().length; i++) {
                if (country_codes()[i]["name"] === event.target.value) {
                    code = country_codes()[i]["iso_alpha2"]
                    break
                }
            }
            temp[event.target.id] = code
            this.setState({
                data: temp
            })
        }
        else {
            temp[event.target.id] = event.target.value
            this.setState({
                data: temp
            })
        }
    }

    render() {
        if (isDesktop) {
            return <Redirect to="/desktop" />
        }
        return (
            <div className="App">
                <div style={{ display: this.state.overlays }} id="overlay">
                    <div style={{ paddingTop: "34vh" }} id="wrapper">
                        <div id="container">
                            <h1>Creating...</h1>
                            <h1>OwO Account</h1>
                        </div>
                    </div>
                </div>
                <div style={{ display: this.state.overlays2 }} id="overlay">
                    <div style={{ paddingTop: "34vh" }} id="wrapper">
                        <div id="container">
                            <h1>OwO Account</h1>
                            <h1>Created Successfully</h1>
                        </div>
                    </div>
                </div>
                <div style={{ padding: "5%" }}>
                    <Row md="1">
                        <Col xs="12" style={{ fontSize: "2rem" }}>
                            <div id="wrapper">
                                <div id="container">
                                    <h1>OwO</h1>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <hr />
                    <div style={{
                        height: `64vh`,
                        overflow: "scroll",
                    }}>
                        <Form>
                            <FormGroup onChange={this.handleChange}>
                                <Input type="text" name="name" id={0} placeholder="Name" autoComplete="off" />
                                <Input type="text" name="lname" id={1} placeholder="Last Name" autoComplete="off" />
                                <hr />
                                <Input type="text" name="address" id={6} placeholder="Address" autoComplete="off" />
                                <Input type="number" name="zip" id={7} placeholder="Zip" autoComplete="off" maxLength="5" />
                                <Input type="text" name="city" id={8} placeholder="City" autoComplete="off" />
                                <Input type="text" name="state" id={9} placeholder="State" autoComplete="off" />
                                <Row md="2" style={{ paddingTop: "1px" }}>
                                    <Col xs="4" style={{ paddingTop: "6px" }}>
                                        Country
                                    </Col>
                                    <Col xs="8">
                                        <Input defaultValue="Select" type="select" id={10} name="select" autoComplete="off">
                                            <option key={"none"} disabled>Select</option>
                                            {
                                                country_codes().map((element, index) => (
                                                    <option key={index}>{element.name}</option>
                                                )
                                                )
                                            }
                                        </Input>
                                    </Col>
                                </Row>
                                <hr />
                                <Input type="date" name="date" id={2} placeholder="Birth" autoComplete="off" maxLength="10" />
                                <Row md="2" style={{ paddingTop: "1px" }}>
                                    <Col xs="2" style={{ paddingTop: "6px" }}>
                                        {this.state.phoneprefix}
                                    </Col>
                                    <Col xs="10">
                                        <Input type="tel" name="tel" id={3} placeholder="Telephone" autoComplete="off" maxLength="11" />
                                    </Col>
                                </Row>
                                <Input type="text" name="id" id={4} placeholder="Id number" autoComplete="off" />
                                <Row md="2" style={{ paddingTop: "1px" }}>
                                    <Col xs="4" style={{ paddingTop: "6px" }}>
                                        Nationality
                                    </Col>
                                    <Col xs="8">
                                        <Input defaultValue="Select" type="select" id={5} name="select" autoComplete="off">
                                            <option key={"none"} disabled>Select</option>
                                            {
                                                country_codes().map((element, index) => (
                                                    <option key={index}>{element.name}</option>
                                                )
                                                )
                                            }
                                        </Input>
                                    </Col>
                                </Row>
                                <hr />
                                <Input type="email" name="email" id={11} placeholder="Email" autoComplete="off" />
                                <Input type="password" name="password" id={12} placeholder="Password" autoComplete="off" />
                            </FormGroup>
                        </Form>
                        <hr />
                        <Row>
                            <Col>
                                <Button disabled={this.state.buttonDis} style={{ borderRadius: "25px", background: "#2461fb", borderColor: "#2461fb" }} onClick={this.complete}>
                                    Complete
                                </Button>
                            </Col>
                            <Col>
                                <Button style={{ borderRadius: "25px", }} disabled={this.state.buttonDis} onClick={() => history.push("/")}>
                                    Cancel
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        );
    }
}

export default Register;