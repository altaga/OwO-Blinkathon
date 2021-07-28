import React, { Component } from 'react';
import autoBind from 'react-autobind';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { connect } from 'react-redux';
import { Button, Form, FormGroup, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row, Col } from 'reactstrap';
import { country_codes } from "../assets/country"
import account_action from "../redux/actions/asyncActions/accountAction"

var validator = require('validator');
const unirest = require('unirest');

function correction(date) {
    var dateObj = new Date(Date.parse(date))
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear().toString();
    if(month<10){
        month = "0" + month.toString()
    }
    if(day<10){
        day = "0"+ day.toString()
    }
    var newdate = month + "/" + day + "/" + year;
    return newdate
}

const classes = {
    root: {
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
    },
    wrapper: {
        position: 'relative',
    }
}

class AddKid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalToogle: false,
            data: {},
            phoneprefix: "+",
            modalButton: false,
            overlays: "none",
            overlays2: "none",
            unmountModal: false
        }
        autoBind(this);
    }

    componentDidMount() {
        let prefix = ""
        for (let i = 0; i < country_codes().length; i++) {
            if (country_codes()[i]["iso_alpha2"] === this.props.account_reducer.result.data.contacts.data[0].address.country) {
                prefix = "+" + country_codes()[i]["phone_code"]
                break
            }
        }
        this.setState({
            phoneprefix: prefix
        })
    }

    handleButtonClick() {
        this.setState({
            modalToogle: true
        })
    };

    modalHandleToogle() {
        this.setState({
            modalToogle: false
        })
    }

    validate(data) {
        let keys = Object.keys(data)
        for (let i = 0; i < keys.length; i++) {
            if (data[keys[i]] === undefined || data[keys[i]] === "") {
                return false
            }
        }
        if (!validator.isEmail(data['email'])) {
            alert('Enter valid Email!')
            return false
        };
        return true
    }

    modalHandleAccept() {
        let last = ""
        if (this.state.data[1] === undefined || this.state.data[1] === "") {
            last = this.props.account_reducer.result.data.last_name
        }
        else {
            last = this.state.data[1]
        }
        
        let temp = {
            'name': this.state.data[0],
            'lname': last,
            'solana-account': '.',
            'solana-sign': '.',
            'phone': this.state.phoneprefix+this.state.data[3],
            'email': this.state.data[5],
            'address': this.props.account_reducer.result.data.contacts.data[0].address.line_1,
            'city': this.props.account_reducer.result.data.contacts.data[0].address.city,
            'state': this.props.account_reducer.result.data.contacts.data[0].address.state,
            'country': this.props.account_reducer.result.data.contacts.data[0].address.country,
            'zip': this.props.account_reducer.result.data.contacts.data[0].address.zip,
            'id_number': this.state.data[4],
            'birth': correction(this.state.data[2]),
            'nationality': this.props.account_reducer.result.data.contacts.data[0].nationality,
            'password': this.state.data[6],
            'kind': 'kid'
        }
        if (this.validate(temp)) {
            let _this = this
            unirest('GET', 'https://e9wzhv9k7d.execute-api.us-east-1.amazonaws.com/create-solana-wallet')
                .end((res) => {
                    if (res.error) throw new Error(res.error);
                    temp['solana-account'] = JSON.parse(res.raw_body)['solana-account']
                    temp['solana-sign'] = JSON.parse(res.raw_body)['solana-sign']
                    let __this = _this
                    unirest('GET', 'https://e9wzhv9k7d.execute-api.us-east-1.amazonaws.com/create-wallet')
                        .headers(temp)
                        .end((res) => {
                            if (res.error) throw new Error(res.error);
                            if (JSON.parse(res.raw_body).status === "ERROR") {
                                console.log(JSON.parse(res.raw_body).status.message)
                            }
                            else {
                                console.log(JSON.parse(res.raw_body))
                                let ewallet = JSON.parse(res.raw_body).data.id
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
                                        'kind': 'kid'
                                    })
                                    .end((res) => {
                                        if (res.error) throw new Error(res.error);
                                        if (JSON.parse(res.raw_body).status === "ERROR") {
                                            console.log(JSON.parse(res.raw_body).status.message)
                                        }
                                        else {
                                            console.log(JSON.parse(res.raw_body))
                                            let temp2 = ___this.props.account_reducer.result.data.metadata
                                            temp2.kids.push(ewallet)
                                            let ____this = ___this
                                            unirest('GET', 'https://e9wzhv9k7d.execute-api.us-east-1.amazonaws.com/update-metadata')
                                                .headers({
                                                    'ewallet': ___this.props.account_reducer.result.data.id,
                                                    'metadata': JSON.stringify(temp2)
                                                })
                                                .end((res) => {
                                                    if (res.error) throw new Error(res.error);
                                                    if (JSON.parse(res.raw_body).status === "ERROR") {
                                                        console.log(JSON.parse(res.raw_body).status.message)
                                                    }
                                                    else {
                                                        console.log(JSON.parse(res.raw_body))
                                                        ____this.setState({
                                                            unmountModal: true
                                                        },
                                                            ____this.setState({
                                                                overlays: "none",
                                                                modalToogle: false,
                                                            },
                                                                ____this.setState({
                                                                    unmountModal: false,
                                                                    overlays: "none",
                                                                    overlays2: "block"
                                                                }, () => {
                                                                    let _____this = ____this
                                                                    ____this.props.account_action(____this.props.account_reducer.result.data.id)
                                                                    setTimeout(() => {
                                                                        _____this.setState(
                                                                            {
                                                                                overlays2: "none",
                                                                                modalButton: false
                                                                            })
                                                                    }, 2000);
                                                                }
                                                                )
                                                            )
                                                        )
                                                    }
                                                });
                                        }
                                    });
                            }
                        });
                });
        }
        else {
            this.setState({
                modalButton: false,
                overlays: "none",
                modalToogle: true,
            })
        }

    }

    handleChange(event) {
        let temp = this.state.data
        temp[event.target.id] = event.target.value
        this.setState({
            data: temp
        })
    }

    render() {

        return (
            <>
                <div style={{ display: this.state.overlays }} id="overlay">
                    <div style={{ paddingTop: "34vh" }} id="wrapper">
                        <div id="container">
                            <h1>Creating...</h1>
                            <h1>OwO Kid Account</h1>
                        </div>
                    </div>
                </div>
                <div style={{ display: this.state.overlays2 }} id="overlay">
                    <div style={{ paddingTop: "34vh" }} id="wrapper">
                        <div id="container">
                            <h1>OwO Kid Account</h1>
                            <h1>Created Successfully</h1>
                        </div>
                    </div>
                </div>
                <Modal unmountOnClose={this.state.unmountModal} isOpen={this.state.modalToogle} backdrop={"static"}>
                    <ModalHeader>Create OwO Account</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup onChange={this.handleChange}>
                                <Input type="text" name="name" id={0} placeholder="Name" autoComplete="off" />
                                <Input defaultValue={this.props.account_reducer.result.data.last_name} type="text" name="lname" id={1} placeholder="Last Name" autoComplete="off" />
                                <hr />
                                <Input type="date" name="date" id={2} placeholder="Birth" autoComplete="off" />
                                <Row md="2" style={{ paddingTop: "1px" }}>
                                    <Col xs="2" style={{ fontWeight: "bold", paddingLeft: "26px", paddingTop: "6px" }}>
                                        {this.state.phoneprefix}
                                    </Col>
                                    <Col xs="10">
                                        <Input type="tel" name="tel" id={3} placeholder="Telephone" autoComplete="off" maxLength="11" />
                                    </Col>
                                </Row>
                                <Input type="email" name="email" id={4} placeholder="Id number" autoComplete="off" />
                                <hr />
                                <Input type="email" name="email" id={5} placeholder="Email" autoComplete="off" />
                                {(this.state.data[6] !== undefined) ? <Input type="password" name="password" id={6} placeholder="Password" autoComplete="off" /> : <Input type="text" name="password" id={6} placeholder="Password" autoComplete="off" />
                                }
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button disabled={this.state.modalButton} style={{ borderRadius:"25px", background: "#2461fb", borderColor: "#2461fb", color: "white" }}
                            onClick={
                                () =>
                                    this.setState({
                                        modalButton: true,
                                        overlays: "block",
                                        modalToogle: false,
                                    },
                                        this.modalHandleAccept
                                    )
                            }
                        >Create</Button>{' '}
                        <Button style={{ borderRadius:"25px"}} disabled={this.state.modalButton} color="secondary" onClick={this.modalHandleToogle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                <div style={classes.root}>
                    <div style={classes.wrapper}>
                        {this.props.account_reducer.result.data.accounts.length > 0 ?
                            <Fab
                                aria-label="save"
                                size="small"
                                onClick={this.handleButtonClick}
                                style={{ background: "#2461fb", borderColor: "#2461fb", color: "white" }}
                            >
                                <AddIcon />
                            </Fab>
                            :
                            "Activate Your Account"
                        }
                    </div>
                </div>
            </>
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
    account_action
}

export default connect(mapStateToProps, mapDispatchToProps)(AddKid);