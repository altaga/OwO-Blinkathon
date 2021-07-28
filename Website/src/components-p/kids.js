import React, { Component } from 'react';
import { connect } from 'react-redux';
import sol_action from "../redux/actions/asyncActions/solAction"
import account_action from "../redux/actions/asyncActions/accountAction"
import AddKid from "./addkid"
import reactAutobind from 'react-autobind';
import KidCard from './kidCard';

class Kids extends Component {
    constructor(props) {
        super(props);
        this.state = {
            kids: [],
            transactions: [],
            isOpen: {},
            buttonD: {},
            inputD: {},
            starto: {},
            buttonAdd: false
        };
        reactAutobind(this);
    }

    componentDidMount() {
    }

    componentWillUnmount() {

    }


    render() {
        return (
            <div>

                {this.props.account_reducer.result.data.accounts.length > 0 ?
                    <>
                        {

                            this.props.account_reducer.result.data.metadata.kids.length > 0 && <>{
                                this.props.account_reducer.result.data.metadata.kids.map((elements, index) => <KidCard key={index} kid_object={elements} />)
                            }
                            </>
                        }
                        <br />
                        <div hidden={this.state.buttonAdd}>
                            <AddKid /> 
                            <div style={{ fontSize: '1.2rem' }}>
                                Add OwO User
                            </div>
                        </div>

                    </>
                    :
                    <div style={{ paddingTop: "25vh" }} id="wrapper">
                        <div id="container">
                            <h1> Activate Your </h1>
                            <h1> OwO Account </h1>
                        </div>
                    </div>
                }
            </div>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(Kids);