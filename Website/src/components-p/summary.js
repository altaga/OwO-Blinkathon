import React, { Component } from 'react';
import { connect } from 'react-redux';
import sol_action from "../redux/actions/asyncActions/solAction"
import account_action from '../redux/actions/asyncActions/accountAction';
import { Collapse, Card, CardBody, CardHeader, Button, Row, Col, Input, UncontrolledPopover, PopoverHeader, PopoverBody } from "reactstrap"
import Transactions from "./transactions"
import '../assets/main.css';
import { country_codes } from "../assets/country"
import InfoIcon from '@material-ui/icons/Info';
import reactAutobind from 'react-autobind';
import DoughnutChart from "../shared/charts"

const unirest = require('unirest');

function correctCurrency(code) {
    let currency = "USD"
    for (let i = 0; i < country_codes().length; i++) {
        if (country_codes()[i]["iso_alpha2"] === code) {
            currency = country_codes()[i]["currency_code"]
        }
    }
    return currency
}

class Summary extends Component {
    constructor(props) {
        super(props);
        reactAutobind(this)
        this.state = {
            isOpen: {
                0: false,
                1: false,
                2: false,
                3: false,
            },
            transactions: [],
            addCredit: false,
            buttonCredit: true,
            credit: "",
            currency: "",
            correctionFactor: 0,
            overlays: "none",
            overlays2: "none",
            verifyButton: true,
            linkVerify: false,
            linkSaved: "",
            solValue: 0,
            inputCrypto: "",
            transferCrypto: true,
            transferCryptoInput: false,
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [
                    {
                        label: '# of Votes',
                        data: [12, 19, 3, 5, 2, 3],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                        ],
                        borderWidth: 1,
                    },
                ],
            }
        }
    }

    componentDidMount() {
        if (this.props.account_reducer.result.data.contacts.data[0].verification_status === "not verified") {
            this.setState({
                verifyButton: false
            })
        }
        this.props.sol_action(this.props.account_reducer.result.data.metadata["solana-account"])
        let temp = this.props.account_reducer.result.data.accounts
        if (temp.length > 0) {
            this.setState({
                isOpen: {
                    0: true,
                    1: false,
                    2: false,
                    3: false
                }
            })
        }
        else {
            this.setState({
                isOpen: {
                    0: false,
                    1: false,
                    2: true,
                    3: false
                }
            })
        }
        let _this = this
        unirest('GET', 'https://e9wzhv9k7d.execute-api.us-east-1.amazonaws.com/crypto-value')
            .headers({
                'bucket': 'cryptocoins-value',
                'file': 'response.json'
            })
            .end((res) => {
                if (res.error) throw new Error(res.error);
                _this.setState({
                    solValue: JSON.parse(JSON.parse(res.raw_body)).data[13].quote.USD.price.toString().substring(0, 6)
                })
            });
        unirest('GET', 'https://e9wzhv9k7d.execute-api.us-east-1.amazonaws.com/get-transactions-ewallet')
            .headers({
                'ewallet': this.props.account_reducer.result.data.id
            })
            .end((res) => {
                if (res.error) throw new Error(res.error);
                _this.setState({
                    transactions: JSON.parse(res.raw_body).data
                })
            });
        this.syncTransactions()
    }

    syncTransactions() {
        let _this = this
        unirest('GET', 'https://e9wzhv9k7d.execute-api.us-east-1.amazonaws.com/get-transactions-ewallet')
            .headers({
                'ewallet': this.props.account_reducer.result.data.id
            })
            .end((res) => {
                if (res.error) throw new Error(res.error);
                let temp = {
                    "labels": [],
                    "datasets": [{
                        label: 'Transactions',
                        "data": [],
                        backgroundColor: [
                            '#2461fb',
                            '#fecc8bff',
                        ],
                        borderColor: [
                            '#2461fb',
                            '#fecc8bff',
                        ],
                        borderWidth: 1,
                    }]
                }
                let p2p = 0
                let add = 0
                for (let i = 0; i < JSON.parse(res.raw_body).data.length; i++) {
                    if (parseFloat(JSON.parse(res.raw_body).data[i].amount) >= 0) {
                        add = add + parseFloat(JSON.parse(res.raw_body).data[i].amount)
                    }
                    else {
                        p2p = p2p + parseFloat(JSON.parse(res.raw_body).data[i].amount)
                    }
                }
                temp.datasets[0].data.push(add)
                temp.datasets[0].data.push(p2p)
                temp.labels.push("Earn")
                temp.labels.push("Spend")
                _this.setState({
                    transactions: JSON.parse(res.raw_body).data,
                    data: temp
                })
            });
    }

    componentWillUnmount() {

    }

    toogleCollapse(event) {
        let iop = this.state.isOpen
        iop[event] = !iop[event]
        for (let i = 0; i < 4; i++) {
            if (event === i) {
                continue
            }
            iop[i] = false
        }
        this.setState({
            isOpen: iop
        })
    }

    componentDidUpdate(preProps, preState) {
        if (!this.props.account_reducer.loading) {
            if(this.props.account_reducer.result.data.accounts>0){
                if (preProps.account_reducer.result.data.accounts[0].balance !== this.props.account_reducer.result.data.accounts[0].balance) {
                    this.syncTransactions()
                }
            }

        }
    }


    handleChange(event) {
        if (event.target.id === "currency") {
            if (event.target.value === "SOL") {
                this.setState({
                    currency: event.target.value,
                    credit: 10,
                    buttonCredit: false
                })
            }
            else {
                this.setState({
                    currency: event.target.value
                })
            }
        }
        else {
            if (this.state.currency === "SOL") {
                this.setState({
                    credit: 10,
                    buttonCredit: false
                })
            }
            else {
                if (event.target.value === "") {
                    this.setState({
                        buttonCredit: true
                    })
                }
                else {
                    this.setState({
                        buttonCredit: false
                    })
                }
                this.setState({
                    credit: event.target.value
                })
            }
        }
    }

    addToAccount() {
        this.setState({
            buttonCredit: true,
            addCredit: true,
            overlays: "block"
        }, () => {
            let tempCurrency = this.state.currency
            if (tempCurrency === "") {
                if (this.props.account_reducer.result.data.accounts > 0) {
                    tempCurrency = this.props.account_reducer.result.data.accounts[0].currency
                }
                else {
                    tempCurrency = correctCurrency(this.props.account_reducer.result.data.contacts.data[0].country)
                }
            }
            let _this = this
            unirest('GET', 'https://e9wzhv9k7d.execute-api.us-east-1.amazonaws.com/add-credits-wallet')
                .headers({
                    'ewallet': this.props.account_reducer.result.data.id,
                    'swallet': this.props.account_reducer.result.data.metadata["solana-account"],
                    'amount': this.state.credit,
                    'currency': tempCurrency
                })
                .end((res) => {
                    if (res.error) throw new Error(res.error);
                    if (tempCurrency !== "SOL") {
                        _this.setState({
                            buttonCredit: false,
                            addCredit: false,
                            overlays: "none"
                        }, () => {
                            _this.props.account_action(_this.props.account_reducer.result.data.id)
                            let __this = _this
                            unirest('GET', 'https://e9wzhv9k7d.execute-api.us-east-1.amazonaws.com/get-transactions-ewallet')
                                .headers({
                                    'ewallet': _this.props.account_reducer.result.data.id
                                })
                                .end((res) => {
                                    if (res.error) throw new Error(res.error);
                                    __this.setState({
                                        transactions: JSON.parse(res.raw_body).data,
                                    })
                                });
                        }
                        )
                    }
                    else {
                        _this.setState({
                            buttonCredit: false,
                            addCredit: false,
                            overlays: "none"
                        }, _this.props.sol_action(_this.props.account_reducer.result.data.metadata["solana-account"])
                        )
                    }
                });
        })
    }

    addVerify() {
        let _this = this
        unirest('GET', 'https://e9wzhv9k7d.execute-api.us-east-1.amazonaws.com/create-verification')
            .headers({
                'contact': this.props.account_reducer.result.data.contacts.data[0].id,
                'ewallet': this.props.account_reducer.result.data.id
            })
            .end((res) => {
                if (res.error) throw new Error(res.error);
                _this.setState({
                    linkSaved: JSON.parse(res.raw_body).data.redirect_url,
                    linkVerify: true,
                    verifyButton: true
                })
            });
    }

    transferButtonCrypto(event) {
        let _this = this
        this.setState({
            transferCrypto: true,
            overlays2: "block"
        })
        unirest('GET', 'https://e9wzhv9k7d.execute-api.us-east-1.amazonaws.com/transfer-solana')
            .headers({
                'swallets': this.props.account_reducer.result.data.metadata["solana-account"],
                'swalletd': '49CvdUoiRfyRMwUU3K21T416bqoykX4X32yuBChDjFaL',
                'amount': parseFloat(this.state.inputCrypto).toString()
            })
            .end((res) => {
                if (res.error) throw new Error(res.error);
                let __this = _this
                unirest('GET', 'https://e9wzhv9k7d.execute-api.us-east-1.amazonaws.com/add-credits-wallet')
                    .headers({
                        'ewallet': _this.props.account_reducer.result.data.id,
                        'swallet': _this.props.account_reducer.result.data.metadata["solana-account"],
                        'amount': event,
                        'currency': 'USD'
                    })
                    .end((res) => {
                        if (res.error) throw new Error(res.error);
                        __this.setState({
                            transferCrypto: false,
                            overlays2: "none"
                        })
                        __this.props.sol_action(__this.props.account_reducer.result.data.metadata["solana-account"])
                        __this.props.account_action(__this.props.account_reducer.result.data.id)
                        __this.syncTransactions()
                    });
            });
    }

    render() {
        return (
            <div>
                <div style={{ display: this.state.overlays }} id="overlay">
                    <div style={{ paddingTop: "60vh" }} id="wrapper">
                        <div id="container">
                            <h1>Adding Funds...</h1>
                            <h1>OwO</h1>
                        </div>
                    </div>
                </div>
                <div style={{ display: this.state.overlays2 }} id="overlay">
                    <div style={{ paddingTop: "30vh" }} id="wrapper">
                        <div id="container">
                            <h1>Transferring...</h1>
                            <h1>OwO</h1>
                        </div>
                    </div>
                </div>
                <Card style={{ backgroundColor: "white", borderWidth: "3px", borderRadius: "25px", }}>
                    <div style={{ borderRadius: "25px", backgroundColor: "#2461fb" }} onClick={() => this.toogleCollapse(0)}>
                        <div style={{ marginTop: "10px", marginBottom: "10px", color: "white" }}>
                            Main Account
                        </div>
                    </div>
                    <CardBody hidden={!this.state.isOpen[0]}>
                        <Collapse isOpen={this.state.isOpen[0]}>
                            <Row md="2">
                                <Col xs="6">
                                    Ewallet:
                                </Col>
                                {this.props.account_reducer.result.data.accounts.length > 0 ?
                                    <Col xs="6">
                                        {parseFloat(this.props.account_reducer.result.data.accounts[0].balance) + parseFloat(this.state.correctionFactor)}{" "}{this.props.account_reducer.result.data.accounts[0].currency}
                                    </Col>
                                    :
                                    <Col xs="6">
                                        Add credit to Activate
                                    </Col>
                                }
                            </Row>
                            <hr />
                            <CardHeader>
                                Transactions:
                            </CardHeader>
                            <CardBody>
                                {this.props.account_reducer.result.data.accounts.length > 0 ?
                                    <Transactions transactions={this.state.transactions} />
                                    :
                                    <></>
                                }
                            </CardBody>
                        </Collapse>
                    </CardBody>
                </Card>
                <Card style={{ backgroundColor: "white", borderWidth: "3px", borderRadius: "25px", }}>
                    <div style={{ borderRadius: "25px", backgroundColor: "#2461fb" }} onClick={() => this.toogleCollapse(1)}>
                        <div style={{ marginTop: "10px", marginBottom: "10px", color: "white" }}>
                            Sol Account
                        </div>
                    </div>
                    <CardBody hidden={!this.state.isOpen[1]}>
                        <Collapse isOpen={this.state.isOpen[1]}>
                            <Row md="2">
                                <Col xs="4">
                                    Swallet:
                                </Col>
                                <Col xs="4">
                                    {
                                        this.props.sol_reducer.result
                                    }
                                </Col>
                                <Col xs="4">
                                    <Row>
                                        {
                                            this.state.solValue
                                        }
                                    </Row>
                                    <Row>
                                        {
                                            "SOL in USD"
                                        }
                                    </Row>
                                </Col>
                            </Row>
                            <hr />
                            <CardHeader>
                                Transactions: {<InfoIcon id="PopoverFocus" />}
                                {
                                    <UncontrolledPopover trigger="focus" placement="bottom" target="PopoverFocus">
                                        <PopoverHeader>Solana Explorer</PopoverHeader>
                                        <PopoverBody>
                                            Solana is a fast, secure, and censorship resistant blockchain providing the open infrastructure required for global adoption.
                                            Here you have a Solana Wallet.
                                        </PopoverBody>
                                    </UncontrolledPopover>
                                }
                            </CardHeader>
                            <CardBody>
                                {<a target="_blank" rel="noopener noreferrer" href={`https://explorer.solana.com/address/${this.props.account_reducer.result.data.metadata["solana-account"]}?cluster=devnet`}>
                                    {this.props.account_reducer.result.data.metadata["solana-account"]}
                                </a>}
                            </CardBody>
                            <hr />
                            <CardBody>
                                <Row>
                                    <Col>
                                        <Input value={this.state.inputCrypto} disabled={this.state.transferCryptoInput} onChange={
                                            (event) => {
                                                if (event.target.value === "" || event.target.value < 1 || parseFloat(event.target.value) > parseFloat(this.props.sol_reducer.result)) {
                                                    this.setState({
                                                        transferCrypto: true,
                                                        inputCrypto: event.target.value
                                                    })
                                                }
                                                else {
                                                    this.setState({
                                                        transferCrypto: false,
                                                        inputCrypto: event.target.value
                                                    })
                                                }
                                            }
                                        } type="number" name="money" id="crypto" placeholder="$$$" />
                                    </Col>
                                    <Col>
                                        {
                                            Math.round((this.state.inputCrypto * this.state.solValue + Number.EPSILON) * 100) / 100
                                        }
                                        {
                                            " USD"
                                        }
                                    </Col>
                                    <Col>
                                        <Button style={{ borderRadius: "25px", }} disabled={this.state.transferCrypto} onClick={() => this.transferButtonCrypto(Math.round((this.state.inputCrypto * this.state.solValue + Number.EPSILON) * 100) / 100)}>
                                            Transfer
                                        </Button>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Collapse>
                    </CardBody>
                </Card>
                <Card style={{ backgroundColor: "white", borderWidth: "3px", borderRadius: "25px", }}>
                    <div style={{ borderRadius: "25px", backgroundColor: "#2461fb" }} onClick={() => this.toogleCollapse(2)}>
                        <div style={{ marginTop: "10px", marginBottom: "10px", color: "white" }}>
                            Add Credit
                        </div>
                    </div>
                    <CardBody hidden={!this.state.isOpen[2]}>
                        <Collapse isOpen={this.state.isOpen[2]}>
                            <CardBody>
                                <Row>
                                    <Col>
                                        <Button style={{ borderRadius: "25px", }} disabled={this.state.buttonCredit} onClick={this.addToAccount}>
                                            Add
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Input value={this.state.credit} disabled={this.state.addCredit} onChange={this.handleChange} type="number" name="money" id="credit" placeholder="$$$" />
                                    </Col>
                                    <Col>
                                        {this.props.account_reducer.result.data.accounts.length > 0 ?
                                            <Input onChange={this.handleChange} type="select" name="select" id="currency">
                                                <option>{this.props.account_reducer.result.data.accounts[0].currency}</option>
                                                <option>SOL</option>
                                            </Input>
                                            :
                                            <Input onChange={this.handleChange} type="select" name="select" id="currency">
                                                <option>{correctCurrency(this.props.account_reducer.result.data.contacts.data[0].country)}</option>
                                            </Input>
                                        }
                                    </Col>
                                </Row>
                            </CardBody>
                        </Collapse>
                    </CardBody>
                </Card>
                <Card style={{ backgroundColor: "white", borderWidth: "3px", borderRadius: "25px", }}>
                    <div style={{ borderRadius: "25px", backgroundColor: "#2461fb" }} onClick={() => this.toogleCollapse(3)}>
                        <div style={{ marginTop: "10px", marginBottom: "10px", color: "white" }}>
                            Verify Account
                        </div>
                        </div>
                    <CardBody hidden={!this.state.isOpen[3]}>
                        <Collapse isOpen={this.state.isOpen[3]}>
                            <CardBody>
                                <Row>
                                    <Col>
                                        <Button style={{ borderRadius: "25px", }} disabled={this.state.verifyButton} onClick={this.addVerify}>
                                            Verify
                                        </Button>
                                        {
                                            this.state.linkVerify &&
                                            <>
                                                <br />
                                                <br />
                                                <a target="_blank" rel="noopener noreferrer" href={this.state.linkSaved}>
                                                    Click Here to Verify your Identity
                                                </a>
                                            </>
                                        }
                                    </Col>
                                </Row>
                            </CardBody>
                        </Collapse>
                    </CardBody>
                </Card>
                <DoughnutChart data={this.state.data} />
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
    sol_action,
    account_action,
}

export default connect(mapStateToProps, mapDispatchToProps)(Summary);