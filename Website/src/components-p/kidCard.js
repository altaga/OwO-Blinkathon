import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Collapse, Row, Button, Input, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, ModalFooter } from 'reactstrap';
import Transactions from "./transactions"
import { connect } from 'react-redux';
import sol_action from "../redux/actions/asyncActions/solAction"
import account_action from "../redux/actions/asyncActions/accountAction"
import reactAutobind from 'react-autobind';
import Cat from "../assets/42887bd1.png"

const unirest = require('unirest');

function color(inVar) {
    if (inVar === "ACT") {
        return "blue"
    }
    return "red";
}

function myState(inVar) {
    if (inVar === "ACT") {
        return "Freeze"
    }
    return "Unfreeze";
}

class KidCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            buttonD: true,
            inputD: false,
            buttonC: true,
            inputC: true,
            max: "",
            min: "",
            my_color: "white",
            kid_object: {},
            starto: "",
            disFreezze: false,
            transferDisplay: this.props.account_reducer.result.data.accounts[0].balance,
            tcurrency: this.props.account_reducer.result.data.accounts[0].currency,
            solCurrent: "",
            verifyButton: true,
            modalConfirm: false,
            modalButton1: true,
            modalButton2: false,
            modalConfirmed: false,
            request: "",
            requestName: "",
            requestAccount: "",
            requestAmount: "",
            showTransactions: "none",
            buttonValue: "Show",
            cardlist: [],
            cardImage: Cat,
            cardMoney: "0",
            modalCard: false ,
            cardSelection: {},
            cardButtonCancel: false
        }
        reactAutobind(this)
    }

    sync() {
        let _this = this
        unirest('GET', 'https://e9wzhv9k7d.execute-api.us-east-1.amazonaws.com/get-account-balance')
            .headers({
                'ewallet': this.props.kid_object
            })
            .end((res) => {
                if (res.error) throw new Error(res.error);
                _this.setState({
                    kid_object: JSON.parse(res.raw_body)
                })
                _this.setState({
                    transferDisplay: _this.props.account_reducer.result.data.accounts[0].balance
                })
                let __this = _this
                unirest('GET', 'https://e9wzhv9k7d.execute-api.us-east-1.amazonaws.com/get-transactions-ewallet')
                    .headers({
                        'ewallet': _this.props.kid_object
                    })
                    .end((res) => {
                        if (res.error) throw new Error(res.error);
                        __this.setState({
                            transactions: JSON.parse(res.raw_body)
                        })
                        unirest('GET', 'https://e9wzhv9k7d.execute-api.us-east-1.amazonaws.com/get-request')
                            .headers({
                                'account': this.props.kid_object
                            })
                            .end((res) => {
                                if (res.error) throw new Error(res.error);
                                if (JSON.parse(res.raw_body).length > 0) {
                                    if (JSON.parse(res.raw_body)[0].state === "open") {
                                        _this.setState({
                                            request: true,
                                            requestName: _this.state.kid_object.data.first_name,
                                            requestAccount: _this.props.kid_object,
                                            requestAmount: JSON.parse(res.raw_body)[0].amount
                                        })
                                    }
                                }
                            });
                    })
            });

    }

    componentDidMount() {
        this.sync()
        let _this = this
        unirest('GET', 'https://b4l30828t4.execute-api.us-east-1.amazonaws.com/catalog')
            .end((res) => {
                if (res.error) throw new Error(res.error);
                _this.setState({
                    cardlist: JSON.parse(res.raw_body).d
                })
            });

    }

    componentWillUnmount() {

    }

    componentDidUpdate(preProps, preState) {
        if (!this.props.account_reducer.loading) {
            if (preProps.account_reducer.result.data.accounts[0].balance !== this.props.account_reducer.result.data.accounts[0].balance) this.setState({ starto: "" });
        }
    }

    startAccount() {
        this.setState({
            buttonD: true,
            inputD: true
        })
        let _this = this
        unirest('GET', 'https://e9wzhv9k7d.execute-api.us-east-1.amazonaws.com/transfer')
            .headers({
                'ewallets': this.props.account_reducer.result.data.id,
                'ewalletd': this.state.kid_object.data.id,
                'swallets': this.props.account_reducer.result.data.metadata["solana-account"],
                'swalletd': this.state.kid_object.data.metadata["solana-account"],
                'amount': this.state.starto,
                'currency': this.props.account_reducer.result.data.accounts[0].currency
            })
            .end((res) => {
                if (res.error) throw new Error(res.error);
                if (JSON.parse(res.raw_body).status === "ERROR") {
                    alert(JSON.parse(res.raw_body).status.message)
                }
                else {
                    console.log(JSON.parse(res.raw_body))
                    let __this = _this
                    unirest('GET', 'https://e9wzhv9k7d.execute-api.us-east-1.amazonaws.com/transaction-decide')
                        .headers({
                            'id': JSON.parse(res.raw_body).data.id,
                            'status': 'accept'
                        })
                        .end((res) => {
                            if (res.error) throw new Error(res.error);
                            let ___this = __this
                            unirest('GET', 'https://b4l30828t4.execute-api.us-east-1.amazonaws.com/email')
                                .headers({
                                    'email': ___this.state.kid_object.data.email,
                                    'password': ___this.state.kid_object.data.metadata.password
                                })
                                .end((res) => {
                                    if (res.error) throw new Error(res.error);
                                    console.log(res.raw_body);
                                });
                            console.log(JSON.parse(res.raw_body))
                            if (JSON.parse(res.raw_body).status === "ERROR") {
                                console.log(JSON.parse(res.raw_body).status.message)
                            }
                            else {
                                __this.props.account_action(__this.props.account_reducer.result.data.id)
                                __this.sync()
                            }
                        });
                }
            });
    }

    acceptRequest() {
        let _this = this
        unirest('GET', 'https://e9wzhv9k7d.execute-api.us-east-1.amazonaws.com/transfer')
            .headers({
                'ewallets': this.props.account_reducer.result.data.id,
                'ewalletd': this.state.requestAccount,
                'amount': this.state.requestAmount,
                'currency': this.props.account_reducer.result.data.accounts[0].currency
            })
            .end((res) => {
                if (res.error) throw new Error(res.error);
                if (JSON.parse(res.raw_body).status === "ERROR") {
                    alert(JSON.parse(res.raw_body).status.message)
                }
                else {
                    console.log(JSON.parse(res.raw_body))
                    let __this = _this
                    unirest('GET', 'https://e9wzhv9k7d.execute-api.us-east-1.amazonaws.com/transaction-decide')
                        .headers({
                            'id': JSON.parse(res.raw_body).data.id,
                            'status': 'accept'
                        })
                        .end((res) => {
                            if (res.error) throw new Error(res.error);
                            console.log(JSON.parse(res.raw_body))
                            if (JSON.parse(res.raw_body).status === "ERROR") {
                                console.log(JSON.parse(res.raw_body).status.message)
                            }
                            else {
                                let ___this = __this
                                unirest('GET', 'https://e9wzhv9k7d.execute-api.us-east-1.amazonaws.com/put-request')
                                    .headers({
                                        'account': __this.state.requestAccount,
                                        'amount': __this.state.requestAmount,
                                        'state': 'close'
                                    })
                                    .end((res) => {
                                        if (res.error) throw new Error(res.error);
                                        ___this.setState({
                                            request: false
                                        })
                                        ___this.props.account_action(___this.props.account_reducer.result.data.id)
                                        ___this.sync()
                                    });
                            }
                        });
                }
            });
    }

    addToAccount() {
        if (this.state.kid_object.data.status === "ACT") {
            this.setState({
                buttonD: true,
                inputD: true,
                modalButton1: true,
                modalButton2: true
            })
            let _this = this
            unirest('GET', 'https://e9wzhv9k7d.execute-api.us-east-1.amazonaws.com/transfer')
                .headers({
                    'ewallets': this.props.account_reducer.result.data.id,
                    'ewalletd': this.state.kid_object.data.id,
                    'swallets': this.props.account_reducer.result.data.metadata["solana-account"],
                    'swalletd': this.state.kid_object.data.metadata["solana-account"],
                    'amount': this.state.starto,
                    'currency': this.state.tcurrency
                })
                .end((res) => {
                    if (res.error) throw new Error(res.error)
                    else if (this.state.tcurrency === "SOL") {
                        console.log(JSON.parse(res.raw_body))
                        _this.setState({
                            buttonD: false,
                            inputD: false
                        }, () => {
                            _this.props.sol_action(_this.props.account_reducer.result.data.metadata["solana-account"])
                            _this.sync()
                        })
                    }
                    else {
                        if (JSON.parse(res.raw_body).status === "ERROR") {
                            alert(JSON.parse(res.raw_body).status.message)
                        }
                        else {
                            console.log(JSON.parse(res.raw_body))
                            let __this = _this
                            unirest('GET', 'https://e9wzhv9k7d.execute-api.us-east-1.amazonaws.com/transaction-decide')
                                .headers({
                                    'id': JSON.parse(res.raw_body).data.id,
                                    'status': 'accept'
                                })
                                .end((res) => {
                                    if (res.error) throw new Error(res.error);
                                    console.log(JSON.parse(res.raw_body))
                                    if (JSON.parse(res.raw_body).status === "ERROR") {
                                        alert(JSON.parse(res.raw_body).status.message)
                                    }
                                    else {
                                        __this.setState({
                                            buttonD: false,
                                            inputD: false,
                                            modalButton1: true,
                                            modalButton2: false,
                                            modalConfirm: false
                                        },
                                            () => {
                                                __this.props.account_action(__this.props.account_reducer.result.data.id)
                                                __this.sync()
                                                let ___this = __this
                                                __this.setState({
                                                    modalConfirmed: true
                                                }, () => {

                                                    setTimeout(() => {
                                                        ___this.setState({
                                                            modalConfirmed: false
                                                        })
                                                    }, 3000
                                                    )
                                                })
                                            })
                                    }
                                });
                        }
                    }

                });
        }
    }

    toogleCollapse() {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    toogleAccount() {
        this.setState({
            disFreezze: true
        }, () => {
            let temp = this.state.kid_object.data.status
            if (temp === "ACT") {
                temp = "disable"
            }
            else {
                temp = "enable"
            }
            let _this = this
            unirest('GET', 'https://e9wzhv9k7d.execute-api.us-east-1.amazonaws.com/wallet-on-off')
                .headers({
                    'ewallet': this.state.kid_object.data.id,
                    'state': temp
                })
                .end((res) => {
                    if (res.error) throw new Error(res.error);
                    _this.setState({
                        disFreezze: false
                    }, _this.sync())
                });
        })
    }

    giveGift() {
        this.setState({
            buttonC: true,
            inputC: true,
            cardButtonCancel: true
        })
        let _this = this
        unirest('GET', 'https://b4l30828t4.execute-api.us-east-1.amazonaws.com/send-card')
            .headers({
                'from': '14045551212',
                'dest': '17705551234',
                'code': this.state.cardSelection.code,
                'amount': this.state.cardMoney
            })
            .end((res) => {
                if (res.error) throw new Error(res.error);
                let temp = JSON.parse(res.raw_body).d.list
                let temp2 = _this.state.kid_object.data.metadata
                temp2.gifts = []
                temp2.gifts.push(temp[0])
                let __this = _this
                unirest('GET', 'https://e9wzhv9k7d.execute-api.us-east-1.amazonaws.com/update-metadata')
                    .headers({
                        'ewallet': _this.state.kid_object.data.id,
                        'metadata': JSON.stringify(temp2)
                    })
                    .end((res) => {
                        if (res.error) throw new Error(res.error);
                        unirest('GET', 'https://e9wzhv9k7d.execute-api.us-east-1.amazonaws.com/transfer')
                            .headers({
                                'ewallets': this.props.account_reducer.result.data.id,
                                'ewalletd': 'ewallet_e8c1df5bbe11a236239ce9d0187e118c',
                                'swallets': '7JE9DAiLZizaAXTgXgba58KiX7RR8LedyGppwAGBEFqe',
                                'swalletd': '12Myzarwh2XSFtp94XDhMyzaeuEMewUETBMmmgPFfz2v',
                                'amount': this.state.cardMoney,
                                'currency': 'USD'
                            })
                            .end((res) => {
                                if (res.error) throw new Error(res.error);
                                let ___this = __this
                                unirest('GET', 'https://e9wzhv9k7d.execute-api.us-east-1.amazonaws.com/transaction-decide')
                                    .headers({
                                        'id': JSON.parse(res.raw_body).data.id,
                                        'status': 'accept'
                                    })
                                    .end((res) => {
                                        if (res.error) throw new Error(res.error);
                                        console.log(res.raw_body);
                                        ___this.setState({
                                            modalCard: false,
                                            buttonC: false,
                                            inputC: false,
                                            cardButtonCancel: false
                                        }, () => {
                                            ___this.props.account_action(___this.props.account_reducer.result.data.id)
                                            ___this.sync()
                                        })
                                    });
                            });
                    });
            });

    }

    render() {
        if (this.state.kid_object.data === undefined) {
            return (
                <>
                </>
            )
        }
        else if (this.state.kid_object.data.accounts.length === 0) {
            return (
                <>
                    <Card style={{ borderRadius: "25px", }}>
                        <CardHeader>
                            {this.state.kid_object.data.first_name} Account
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col>
                                    <Button style={{ borderRadius: "25px", }} disabled={this.state.buttonD} onClick={this.startAccount}>
                                        Start Account
                                    </Button>
                                </Col>
                                <Col>
                                    <Input disabled={this.state.inputD} onChange={
                                        (event) => {
                                            let but = false
                                            if (event.target.value === "" || parseFloat(event.target.value) < 0 || parseFloat(event.target.value) > this.props.account_reducer.result.data.accounts[0].balance) {
                                                but = true
                                            }
                                            this.setState({
                                                starto: event.target.value,
                                                buttonD: but
                                            })
                                        }
                                    } type="number" name="money" id={parseFloat(0)} placeholder={this.props.account_reducer.result.data.accounts[0].balance + this.props.account_reducer.result.data.accounts[0].currency} />
                                </Col>
                            </Row>
                        </CardBody>
                    </Card >
                </>
            )
        }
        else {
            return (
                <>
                    <Modal isOpen={this.state.modalCard} backdrop={"static"}>
                        <ModalHeader>
                            Select GiftCard <div style={{ fontSize: "0.7rem" }}>powered by BlinkSky</div>
                        </ModalHeader>
                        <ModalBody>
                            <Input defaultValue="Select GiftCard" type="select" onChange={(e) => {
                                let but = true
                                if (this.props.account_reducer.result.data.accounts[0].balance >= this.state.cardlist.find(value => value.caption === e.target.value).min_range) {
                                    but = false
                                }
                                this.setState({
                                    cardImage: this.state.cardlist.find(value => value.caption === e.target.value).logo,
                                    max: this.state.cardlist.find(value => value.caption === e.target.value).max_range,
                                    min: this.state.cardlist.find(value => value.caption === e.target.value).min_range,
                                    my_color: this.state.cardlist.find(value => value.caption === e.target.value).fontcolor,
                                    starto: this.state.cardlist.find(value => value.caption === e.target.value).min_range,
                                    cardMoney: this.state.cardlist.find(value => value.caption === e.target.value).min_range,
                                    inputC: false,
                                    buttonC: but,
                                    cardSelection: this.state.cardlist.find(value => value.caption === e.target.value)
                                })
                            }}>
                                <option disabled>Select GiftCard</option>
                                {this.state.cardlist.map((item) => {
                                    return <option value={item.caption} key={item.caption}>{item.caption}</option>
                                })}
                            </Input>
                            <hr />
                            <div className="image-container">
                                <img src={this.state.cardImage} alt="GiftCard" style={{ width: "100%", borderRadius: "10px" }} />
                                <div className="image-bottom-left" style={{ color: this.state.my_color, fontSize: "1.5rem", WebkitTextStroke: "0.5px black" }}>
                                    {this.state.cardMoney + " " + this.props.account_reducer.result.data.accounts[0].currency}
                                </div>
                            </div>
                            <br />
                            <div>
                                <Button style={{ borderRadius: "25px" }} disabled={this.state.inputC} color="primary" className="center" onClick={() => {
                                    this.setState({
                                        starto: this.state.min,
                                        cardMoney: this.state.min
                                    })
                                }}
                                >
                                    Min
                                </Button>
                                <Button style={{ borderRadius: "25px" }} disabled={this.state.inputC} color="primary" className="center" onClick={() => {
                                    this.setState({
                                        starto: this.state.max,
                                        cardMoney: this.state.max
                                    })
                                }}>
                                    Max
                                </Button>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Row md="2">
                                <Col xs="6">
                                    <Input value={this.state.starto} disabled={this.state.inputC} onChange={
                                        (event) => {
                                            let but = false
                                            if (event.target.value === "" || parseFloat(event.target.value) < 0 || parseFloat(event.target.value) > this.props.account_reducer.result.data.accounts[0].balance || parseFloat(event.target.value) < this.state.min || parseFloat(event.target.value) > this.state.max) {
                                                but = true
                                            }
                                            this.setState({
                                                starto: event.target.value,
                                                buttonC: but,
                                                cardMoney: event.target.value
                                            })
                                        }
                                    } type="number" name="money" id="credit" placeholder={"" + this.props.account_reducer.result.data.accounts[0].balance + " " + this.props.account_reducer.result.data.accounts[0].currency} />
                                </Col>
                                <Col xs="6">
                                    <Row>
                                        <Col xs="6">
                                            <Button style={{ borderRadius: "25px" }} color="primary" disabled={this.state.buttonC} onClick={this.giveGift}>
                                                Give
                                            </Button>
                                        </Col>
                                        <Col xs="6">
                                            <Button
                                                disabled={this.state.cardButtonCancel}
                                                style={{ borderRadius: "25px" }} onClick={() => {
                                                    this.setState({
                                                        modalCard: false
                                                    })
                                                }
                                                }>
                                                Cancel
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </ModalFooter>
                    </Modal>
                    <Modal isOpen={this.state.request} backdrop={"static"}>
                        <ModalHeader>{this.state.requestName} has requested</ModalHeader>
                        <ModalBody style={{ fontSize: "1.5rem" }}>
                            Amount: {this.state.requestAmount} {this.props.account_reducer.result.data.accounts[0].currency}
                        </ModalBody>
                        <ModalFooter>
                            <Button style={{ borderRadius: "25px", background: "#2461fb", borderColor: "#2461fb", color: "white" }} onClick={
                                () => {
                                    this.acceptRequest()
                                    this.setState({
                                        request: false,
                                    })
                                }
                            }>Confirm</Button>
                            <Button style={{ borderRadius: "25px" }} color="secondary" onClick={
                                () => {
                                    let _this = this
                                    unirest('GET', 'https://e9wzhv9k7d.execute-api.us-east-1.amazonaws.com/put-request')
                                        .headers({
                                            'account': this.state.requestAccount,
                                            'amount': this.state.requestAmount,
                                            'state': 'close'
                                        })
                                        .end((res) => {
                                            if (res.error) throw new Error(res.error);
                                            _this.setState({
                                                request: false
                                            })
                                        });
                                }
                            }>Reject</Button>
                        </ModalFooter>
                    </Modal>
                    <Modal isOpen={this.state.modalConfirmed} backdrop={"static"}>
                        <ModalHeader>Good!</ModalHeader>
                        <ModalBody>Succesful OwO transaction</ModalBody>
                    </Modal>
                    <Modal isOpen={this.state.modalConfirm} backdrop={"static"}>
                        <ModalHeader>Confirm Transaction</ModalHeader>
                        <ModalBody>
                            <Form>
                                <FormGroup>
                                    {<>
                                        <Label>Type your password to confirm</Label>
                                        <Input type="password" name="password" id={6} placeholder="Password" autoComplete="off" onChange={
                                            (event) => {
                                                if (event.target.value === this.props.account_reducer.result.data.metadata.password) {
                                                    this.setState({
                                                        modalButton1: false
                                                    })
                                                }
                                                else {
                                                    this.setState({
                                                        modalButton1: true
                                                    })
                                                }
                                            }
                                        } />
                                    </>
                                    }
                                </FormGroup>
                            </Form>
                        </ModalBody>
                        <ModalFooter>
                            <Button disabled={this.state.modalButton1} style={{ borderRadius: "25px", background: "#2461fb", borderColor: "#2461fb", color: "white" }} onClick={this.addToAccount}>Confirm</Button>
                            <Button style={{ borderRadius: "25px" }} disabled={this.state.modalButton2} color="secondary" onClick={
                                () => {
                                    this.setState({
                                        modalConfirm: false,
                                    })
                                }
                            }>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                    <Card style={{ borderWidth: "3px", borderRadius: "25px", }}>
                        <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                            <Row>
                                <Col xs="6" onClick={this.toogleCollapse} style={{ paddingTop: "8px" }}>
                                    {this.state.kid_object.data.first_name} Account
                                </Col>
                                <Col xs="2"></Col>
                                <Col xs="4">
                                    <Button disabled={this.state.disFreezze} style={{ borderRadius: "25px", backgroundColor: color(this.state.kid_object.data.status), borderColor: color(this.state.kid_object.data.status) }} onClick={this.toogleAccount}>
                                        {myState(this.state.kid_object.data.status)}
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                        <CardBody hidden={!this.state.isOpen}>
                            <Collapse isOpen={this.state.isOpen}>
                                <Row md="3">
                                    <Col xs="4">
                                        Ewallet:
                                    </Col>
                                    <Col xs="4">
                                        {
                                            this.state.kid_object.data.accounts[0].balance
                                        }
                                        {" "}
                                        {
                                            this.state.kid_object.data.accounts[0].currency
                                        }
                                    </Col>
                                    <Col xs="4">
                                        <Button style={{ borderRadius: "25px" }} outline color="primary" onClick={() => {
                                            if (this.state.showTransactions === "none") {
                                                this.setState({
                                                    showTransactions: "block",
                                                    buttonValue: "Hide"
                                                })
                                            }
                                            else {
                                                this.setState({
                                                    showTransactions: "none",
                                                    buttonValue: "Show"
                                                })
                                            }
                                        }}>
                                            {this.state.buttonValue}
                                        </Button>
                                    </Col>
                                </Row>
                                <hr />
                                <div style={{ display: this.state.showTransactions }}>
                                    <CardHeader>
                                        Transactions:
                                    </CardHeader>
                                    {
                                        (this.state.transactions !== undefined) &&
                                        <>
                                            {
                                                (this.state.transactions.data !== undefined) ? <Transactions transactions={this.state.transactions.data} /> :
                                                    <>
                                                        Unfreeze to view transactions or transfer money
                                                        <hr />
                                                    </>
                                            }
                                        </>
                                    }
                                </div>

                                <CardBody>
                                    <Row>
                                        <Col>
                                            <Button style={{ borderRadius: "25px", }} disabled={this.state.buttonD} onClick={() => {
                                                this.setState({
                                                    modalConfirm: true
                                                })
                                            }
                                            }>
                                                Transfer
                                            </Button>
                                        </Col>
                                        <Col>
                                            <Input value={this.state.starto} disabled={this.state.inputD} onChange={
                                                (event) => {
                                                    let but = false
                                                    if (event.target.value === "" || parseFloat(event.target.value) < 0 || parseFloat(event.target.value) > this.props.account_reducer.result.data.accounts[0].balance) {
                                                        but = true
                                                    }
                                                    this.setState({
                                                        starto: event.target.value,
                                                        buttonD: but
                                                    })
                                                }
                                            } type="number" name="money" id="credit" placeholder={"" + this.props.account_reducer.result.data.accounts[0].balance} />
                                        </Col>
                                        <Col>
                                            <Input onChange={
                                                (event) => {
                                                    if (event.target.value !== "SOL") {
                                                        this.setState({
                                                            tcurrency: event.target.value,
                                                            transferDisplay: this.props.account_reducer.result.data.accounts[0].balance
                                                        })
                                                        if (this.state.starto === "" || this.state.starto < 0 || this.state.starto > this.props.account_reducer.result.data.accounts[0].balance) {
                                                            this.setState({
                                                                buttonD: true
                                                            })
                                                        }
                                                        else {
                                                            this.setState({
                                                                buttonD: false
                                                            })
                                                        }
                                                    }
                                                    else {
                                                        this.setState({
                                                            tcurrency: event.target.value,
                                                            transferDisplay: parseFloat(this.props.sol_reducer.result.replace(" SOL", ""))
                                                        })
                                                        if (this.state.starto === "" || this.state.starto < 0 || this.state.starto > parseFloat(this.props.sol_reducer.result.replace(" SOL", ""))) {
                                                            this.setState({
                                                                buttonD: true
                                                            })
                                                        }
                                                        else {
                                                            this.setState({
                                                                buttonD: false
                                                            })
                                                        }
                                                    }
                                                }
                                            } type="select" name="select" id="currency">
                                                <option>{this.props.account_reducer.result.data.accounts[0].currency}</option>
                                            </Input>
                                        </Col>
                                    </Row>
                                </CardBody>
                                <hr />
                                <CardBody>
                                    <Row>
                                        <Col>
                                            <Button style={{ borderRadius: "25px" }} color="primary" onClick={() => {
                                                this.setState({
                                                    modalCard: true
                                                })
                                            }
                                            }>
                                                Give GiftCard
                                            </Button>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Collapse>
                        </CardBody>
                    </Card>
                </>
            );
        }
    }
}

const mapStateToProps = (state) => {
    return {
        account_reducer: state.account_reducer,
        sol_reducer: state.sol_reducer
    }
}

const mapDispatchToProps =
{
    sol_action,
    account_action
}

export default connect(mapStateToProps, mapDispatchToProps)(KidCard);