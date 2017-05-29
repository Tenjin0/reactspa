import React from "react";
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Card, CardTitle } from 'material-ui/Card';

import Auth from "../services/auth";
import Api from "../services/api";

export default class Login extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { error :{},
            user : { email:"" , password: ""}
        };
    }
    
    onChildEmailChanged(e) {
        this.state.user.email = e.target.value;
        this.setState(this.state);  
    }

    onChildPaswordChanged(e) {
        this.state.user.password = e.target.value;
        this.setState(this.state);
    }

    onClickSubmit(e) {
        e.preventDefault();
        const data = this.state.user;
        new Api().send('Post', "/auth/login", data, (status, response) => {
            if (status === 200) {
                Auth.authenticateUser(response.token);
                this.setState({
                    user : response.user
                });
                this.props.setUserContext(response.user);
                this.props.router.replace('/');
            }
            else if (status !== 200) {
                this.setState({
                    user : this.state.user,
                    error: {
                        message: response.message
                    }
                });
            }
            this.props.setLayoutMessage(response.success, response.message);
        });
    }
    
    componentDidMount() {
        this.props.setTitle(this.props.route.title);
    }

    render() {
        return(
            <Card id="login-card">
            <form onSubmit={this.onClickSubmit.bind(this)} action="">
                <div className="field-line">
                    <TextField
                        type="email"
                        floatingLabelText="Email"
                        name="Email"
                        onChange={this.onChildEmailChanged.bind(this) }
                        required
                    />
                </div>
                <div className="field-line">
                    <TextField
                        floatingLabelText="Password"
                        type="password"
                        name="password"
                        onChange={ this.onChildPaswordChanged.bind(this)}
                        required
                    />
                </div>
                <div className="button-line">
                    <RaisedButton type="submit" label="Log in" primary />
                </div>                
            </form>
        </Card>
        );
    }
}