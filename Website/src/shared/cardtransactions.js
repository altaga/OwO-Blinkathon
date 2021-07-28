import React, { Component } from 'react';
import { Card, Row, Col } from 'reactstrap';
import { connect } from "react-redux"
import Cat from "../assets/notrans.png"
import { Text } from 'domelementtype';

const unirest = require('unirest');

class Cardtransactions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transactions: []
        }

    }

    componentDidMount() {
        if (this.props.account_reducer.result.data.metadata.card_id !== undefined) {
            let _this = this
            unirest('GET', 'https://e9wzhv9k7d.execute-api.us-east-1.amazonaws.com/get-card-transactions')
                .headers({
                    'card': this.props.account_reducer.result.data.metadata.card_id
                })
                .end((res) => {
                    if (res.error) throw new Error(res.error);
                    _this.setState({
                        transactions: JSON.parse(res.raw_body).data
                    })
                });
        }
    }

    componentWillUnmount() {

    }

    render() {
        return (
            <div>
                <Card style={{borderRadius:"25px"}}>
                    <Row md="1">
                        <Col style={{fontSize:"1.2rem"}}>
                            Transactions:
                        </Col>
                    </Row>
                    <br></br>
                    {
                        this.state.transactions.length > 0 ?
                            <>
                                {
                                    this.state.transactions.map(
                                        (elements, index) =>
                                            <Row md="2">
                                                <Col>
                                                    {elements}
                                                </Col>
                                                <Col>
                                                    {index}
                                                </Col>
                                            </Row>
                                    )
                                }
                            </>
                            :
                            <>
                            <Col>
                            <img src={Cat} alt="Cat" height="200vh" width="200vh" />
                            <p></p>
                            <Text style={{fontSize:"1.5rem"}}>
                                No Transactions Yet..
                            </Text>
                            </Col>
                            </>
                    }
                </Card>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        account_reducer: state.account_reducer
    }
}

export default connect(mapStateToProps, null)(Cardtransactions);