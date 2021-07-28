import React, { Component } from 'react';
import reactAutobind from 'react-autobind';
import { Card, Col, Row, CardBody, CardHeader, Button, Modal, ModalHeader, ModalBody, ModalFooter, Table } from "reactstrap"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMedal } from '@fortawesome/free-solid-svg-icons'
import { connect } from "react-redux"
import InfoIcon from '@material-ui/icons/Info';
import Ice from "../assets/ice.png"
import MenuIcon from '@material-ui/icons/Menu';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import VideogameAssetIcon from '@material-ui/icons/VideogameAsset';
import VideocamIcon from '@material-ui/icons/Videocam';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import LocalPlayIcon from '@material-ui/icons/LocalPlay';

function prizef(balance) {
    if (parseInt(balance) >= 500) {
        return ({
            "next": "soon",
            "pointer": ["gold", <faTrophy />],
            "coupons": [
                {
                    "name": "Uber EATS",
                    "desc": "$10 off on your next UBER EATS purchase",
                    "code": "001",
                    "icon": <MenuIcon />,
                    "logoprop": "icon"
                },
                {
                    "name": "Subway",
                    "desc": "50% off if you purchase at Subway",
                    "code": "002",
                    "icon": <FastfoodIcon />,
                    "logoprop": "icon"
                }
            ]
        })
    }
    else if (parseInt(balance) >= 100) {
        return ({
            "next": 500,
            "pointer": ["silver", <faMedal />],
            "coupons": [
                {
                    "name": "Riot Points",
                    "desc": "10% off on your next purchase",
                    "code": "001",
                    "icon": <VideogameAssetIcon />,
                    "logoprop": "icon"
                },
                {
                    "name": "Steam",
                    "desc": "20% off on your next purchase",
                    "code": "002",
                    "icon": <VideocamIcon />,
                    "logoprop": "icon"
                }
            ]
        })
    }
    else {
        return ({
            "next": 100,
            "pointer": ["#FF5733", <faStar />],
            "coupons": [
                {
                    "name": "GameStop",
                    "desc": "$5 off any purchase",
                    "code": "001",
                    "icon": <SportsEsportsIcon />,
                    "logoprop": "icon"
                },
                {
                    "name": "Dave & Busters",
                    "desc": "Save 10$ when you spend 50 or more ",
                    "code": "002",
                    "icon": <LocalPlayIcon />,
                    "logoprop": "icon"
                }
            ]
        })
    }
}

class Coupons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coupons: [],
            couponsState: [],
            medal: <FontAwesomeIcon icon={faMedal} />,
            level: [],
            next: "",
            memory: "",
            infoModal: false
        }
        reactAutobind(this)
    }

    sync() {
        let prize = prizef(this.props.account_reducer.result.data.accounts[0].balance)
        let temp = prize["coupons"]
        for (let i = 0; i < temp.length; i++) {
            temp["stat"] = false
        }
        this.setState({
            coupons: temp,
            level: prize["pointer"],
            next: prize["next"]
        })
    }

    componentDidMount() {
        this.sync()
    }

    componentWillUnmount() {

    }

    componentDidUpdate(preProps, preState) {
        if (!this.props.account_reducer.loading) {
            if (JSON.stringify(this.props.account_reducer) !== JSON.stringify(this.state.memory))
                this.setState({
                    memory: this.props.account_reducer
                }, this.sync())
        }
    }

    activate(event) {
        let temp = this.state.coupons
        for (let i = 0; i < temp.length; i++) {
            if (temp[i]["code"] === event) {
                temp[i]["stat"] = true
                break
            }
        }
        this.setState({
            coupons: temp
        })
    }



    render() {
        return (
            <div>
                {
                    this.props.account_reducer.result.data.status === "ACT" ?
                        <>
                            <div style={{ WebkitTextStroke: "0.7px black", fontSize: "2rem", color: this.state.level[0] }} >
                                Rank {this.state.medal}
                            </div>
                            <>
                                (next rank
                                {

                                    this.state.next === "soon" ?
                                        <>
                                            {" soon"}
                                        </>
                                        :
                                        <>
                                            {" "}{this.state.next - this.props.account_reducer.result.data.accounts[0].balance
                                            }{this.props.account_reducer.result.data.accounts[0].currency}{" more"}
                                        </>
                                }
                                )
                                {
                                    <InfoIcon onClick={() => {
                                        this.setState({
                                            infoModal: true
                                        })
                                    }} />
                                }
                                {
                                    <Modal isOpen={this.state.infoModal} backdrop={"static"} >
                                        <ModalHeader >Ranking Information</ModalHeader>
                                        <ModalBody>
                                            <Table style={{ fontSize: "0.8rem" }}>
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Bronze</th>
                                                        <th>Silver</th>
                                                        <th>Gold</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <th scope="row">Rewards membership
                                                        </th>
                                                        <td>YES</td>
                                                        <td>YES</td>
                                                        <td>YES</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">online gaming discounts</th>
                                                        <td>NO</td>
                                                        <td>YES</td>
                                                        <td>YES</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">Money
                                                        </th>
                                                        <td>0 - 100</td>
                                                        <td>100 - 500</td>
                                                        <td>+500</td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button style={{ borderRadius: "25px", background: "#2461fb", borderColor: "#2461fb" }} onClick={() => {
                                                this.setState({
                                                    infoModal: false
                                                })
                                            }}>Close</Button>
                                        </ModalFooter>
                                    </Modal>
                                }
                            </>
                            <div style={{ paddingBottom: "20px" }} />
                            {
                                this.state.coupons.map((element, index) => <div key={index}>
                                    <Card style={{ borderStyle:"dashed",borderWidth:"3px",borderColor:"#2461fb",borderRadius: "25px" }} >
                                        <div style={{margin:"10px"}}>
                                        <CardHeader>
                                            <Row md="3">
                                                <Col xs="2">
                                                </Col>
                                                <Col xs="8">
                                                    {element.name}
                                                </Col>
                                                <Col xs="2">
                                                    {
                                                        element.logoprop === "svg" ?
                                                            <img alt="icon" width={"30vh"} src={element.icon} /> :
                                                            element.icon
                                                    }
                                                </Col>
                                            </Row>
                                        </CardHeader>
                                        <CardBody>
                                            {element.desc}
                                        </CardBody>
                                        <Button disabled={element.stat} style={{ borderRadius: "25px", background: "#2461fb", borderColor: "#2461fb" }} onClick={() => this.activate(element.code)}>
                                            {
                                                !element.stat ?
                                                    "Redeem" :
                                                    "Redeemed"
                                            }
                                        </Button>
                                        </div>
                                    </Card>
                                </div>)
                            }
                        </>
                        :
                        <>
                            <img alt="ice" src={Ice} width="90%"></img>
                            <br />
                            <br />
                            <div>
                                <h1>Account  frozen</h1>
                            </div>
                        </>
                }
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

export default connect(mapStateToProps, null)(Coupons);