import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
import autoBind from "react-autobind"
import { Button } from 'reactstrap';
import account_action from '../redux/actions/asyncActions/accountAction';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import Cardtransactions from './cardtransactions';
import Ice from "../assets/ice.png"

const unirest = require('unirest');

class Cardss extends Component {
    constructor(props) {
        super(props);
        autoBind(this);
        this.state = {
            cvc: '',
            expiry: '',
            focus: "number",
            name: '',
            number: '',
            show: true,
            text: "Show Card ",
            icon: <VisibilityIcon />,
            overlays: "none",
            overlays2: "none",
            preIssue: false
        }
    }

    componentDidMount() {
        this.setState({

        })

    }

    componentWillUnmount() {

    }



    turn() {
        if (!this.state.show) {
            if (this.state.focus === "cvc") {
                this.setState({
                    focus: "number"
                })
            }
            else {
                this.setState({
                    focus: "cvc"
                })
            }
        }
    }

    issueCard() {
        this.setState({
            overlays: "block",
            overlays2: "none",
            preIssue: true,
        },
            () => {
                let _this = this
                unirest('GET', 'https://e9wzhv9k7d.execute-api.us-east-1.amazonaws.com/card-issue')
                    .headers({
                        'ewallet_contact': this.props.account_reducer.result.data.contacts.data[0].id,
                        'country': this.props.account_reducer.result.data.contacts.data[0].country
                    })
                    .end((res) => {
                        if (res.error) throw new Error(res.error);
                        let myJSON = JSON.parse(res.raw_body)
                        let temp = _this.props.account_reducer.result.data.metadata
                        temp["cvc"] = myJSON.data.cvv
                        temp["expiry"] = myJSON.data.expiration_month + "/" + myJSON.data.expiration_year
                        temp["number"] = myJSON.data.card_number
                        temp["card_id"] = myJSON.data.card_id
                        let __this = _this
                        unirest('GET', 'https://e9wzhv9k7d.execute-api.us-east-1.amazonaws.com/update-metadata')
                            .headers({
                                'ewallet': _this.props.account_reducer.result.data.id,
                                'metadata': JSON.stringify(temp)
                            })
                            .end((res) => {
                                if (res.error) throw new Error(res.error);
                                let ___this = __this
                                __this.setState({
                                    overlays: "none",
                                    overlays2: "block"
                                },
                                    () => {
                                        setTimeout(() => {
                                            ___this.setState(
                                                {
                                                    overlays: "none",
                                                    overlays2: "none"
                                                },
                                                ___this.props.account_action(___this.props.account_reducer.result.data.id)
                                            )
                                        }, 2000);
                                    })
                            });
                    });
            }
        )
    }

    showCard() {
        if (this.state.show) {
            this.setState({
                show: !this.state.show,
                text: "Hide Card ",
                icon: <VisibilityOffIcon />,
                focus: "number"
            })
        }
        else {
            this.setState({
                show: !this.state.show,
                text: "Show Card ",
                icon: <VisibilityIcon />,
                focus: "number"
            })
        }
    }

    render() {
        return (
            <div style={{paddingTop:"20px"}}>
                <div style={{ display: this.state.overlays }} id="overlay">
                    <div style={{ paddingTop: "34vh" }} id="wrapper">
                        <div id="container">
                            <h1>Issuing...</h1>
                            <h1>____________</h1>
                            <h1>| OwO  Card |</h1>
                            <h1>| 08/24 <>&nbsp;&nbsp;</> ■ |</h1>
                            <h1>‾‾‾‾‾‾‾‾‾‾‾‾‾</h1>
                        </div>
                    </div>
                </div>
                <div style={{ display: this.state.overlays2 }} id="overlay">
                    <div style={{ paddingTop: "34vh" }} id="wrapper">
                        <div id="container">
                            <h1>____________</h1>
                            <h1>| OwO  Card |</h1>
                            <h1>| 08/24 <>&nbsp;&nbsp;</> ■ |</h1>
                            <h1>‾‾‾‾‾‾‾‾‾‾‾‾‾</h1>
                            <h1>Properly issued</h1>
                        </div>
                    </div>
                </div>
                {
                    this.props.account_reducer.result.data.status === "ACT" ?
                        <>
                            {this.props.account_reducer.result.data.accounts.length > 0 ?
                                <>
                                    {this.props.account_reducer.result.data.metadata.cvc ?
                                        <div hidden={this.state.show} onClick={this.turn}><Cards
                                        style={{cursor:'pointer'}}
                                            cvc={this.props.account_reducer.result.data.metadata.cvc}
                                            expiry={this.props.account_reducer.result.data.metadata.expiry}
                                            focused={this.state.focus}
                                            name={this.props.account_reducer.result.data.first_name + " " + this.props.account_reducer.result.data.last_name}
                                            number={this.props.account_reducer.result.data.metadata.number}
                                        />
                                        </div> : <> <Button style={{ borderRadius: "25px", fontSize: "1.5rem", background: "#2461fb", borderColor: "#2461fb" }} onClick={this.issueCard}>Issue Card</Button>
                                            <div hidden={this.state.preIssue} style={{ paddingTop: "10vh" }} id="wrapper">
                                                <div id="container">
                                                    <h1 style={{ fontSize: "3rem" }}> ▲ ▲ </h1>
                                                    <h1 style={{ fontSize: "3rem" }}> Issue your OwO card </h1>
                                                </div>
                                            </div>
                                        </>
                                    }
                                    {
                                        this.props.account_reducer.result.data.metadata.cvc ?
                                            <div><br /><Button style={{ borderRadius: "25px", background: "#2461fb", borderColor: "#2461fb" }} onClick={this.showCard}>{this.state.text}{this.state.icon} </Button></div> : ""
                                    }
                                    <br />
                                    {
                                        this.props.account_reducer.result.data.metadata.cvc ?
                                            <Cardtransactions /> :
                                            <>
                                            </>
                                    }
                                </> :
                                <div>
                                    <div style={{ paddingTop: "25vh" }} id="wrapper">
                                        <div id="container">
                                            <h1> Activate Your </h1>
                                            <h1> OwO Account </h1>
                                        </div>
                                    </div>
                                </div>
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
        account_reducer: state.account_reducer
    }
}

const mapDispatchToProps =
{
    account_action,
}

export default connect(mapStateToProps, mapDispatchToProps)(Cardss);
