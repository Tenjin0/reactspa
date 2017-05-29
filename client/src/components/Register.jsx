import React, {Component} from "react";
import { Card, CardTitle } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Api from "../services/api";

export default class Register extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = { error :{},
            user : { email:"" , password: "", firstname: "", lastname: "", username:"", confirmPassword: ""}
        };
    }

    componentDidMount() {
        this.props.setTitle(this.props.route.title);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.user.email) {
            this.state.user = nextProps.user;
        }
    }

    onChange(e) {
        this.state.user[e.target.name] = e.target.value;
        if (this.state.error[e.target.name]) {
            this.state.error[e.target.name] = null;
        }
        this.setState(this.state);
    }

    onClickSubmit(e) {
        e.preventDefault();
        var url, method;
        if (this.props.route.title === "Register") {
            url = "/auth/register";
            method = "POST";
        } else {
            method = "PUT";
            url = "/api/users/profile";
        }
        const data = this.state.user;
        new Api().send(method, url, data, (status, response) => {
            var isSuccess = status === 200;
            if (this.props.route.title === "Register") {
                if (isSuccess) {
                    this.props.router.replace('/login');
                } else {
                    var errors = response.errors;
                    this.state.error.message = response.message;
                    for(var i=0; i < errors.length;  i++) {
                        this.state.error[errors[i].param] = errors[i].msg;
                    }
                    this.setState(this.state);
                }
            }
            this.props.setLayoutMessage(isSuccess, response.message);
        });
    }
    render() {

        var isRegister = this.props.route.title === "Register";
        return (
           <Card id="register-card">
            <form onSubmit={this.onClickSubmit.bind(this)}>
                 <div className="field-line inline">
                    <TextField
                        type="text"
                        floatingLabelText="Firstname"
                        onChange={this.onChange.bind(this)}
                        errorText={this.state.error.firstname? this.state.error.firstname : ""}
                        name="firstname"
                        value={this.state.user.firstname}
                    />
                </div>
                <div className="field-line inline right">
                    <TextField
                        type="text"
                        floatingLabelText="Lastname"
                        onChange={this.onChange.bind(this)}
                        errorText={this.state.error.lastname? this.state.error.lastname : ""}
                        name="lastname"
                        value={this.state.user.lastname}
                    />
                </div>
                <div className="field-line">
                    <TextField
                        type="email"
                        floatingLabelText="email"
                        name="email"
                        fullWidth={true}
                        onChange={this.onChange.bind(this)}
                        errorText={this.state.error.email ? this.state.error.email : ""}
                        value={this.state.user.email}
                        required
                    />
                </div>
                <div className="field-line">
                    <TextField
                        type="text"
                        onChange={this.onChange.bind(this)}
                        floatingLabelText="Username"
                        name="username"
                        fullWidth={true}
                        errorText={this.state.error.username? this.state.error.username : ""}
                        value={this.state.user.username}
                        required
                    />
                </div>
                <div className="form-group">
                    <div className="field-line inline ">
                        <TextField
                            type="text"
                            onChange={this.onChange.bind(this)}
                            floatingLabelText="Password"
                            name="password"
                            errorText={this.state.error.password? this.state.error.password : ""}
                            required = {isRegister}
                        />
                    </div>
                    <div className="field-line inline right">
                        <TextField
                            type="text"
                            onChange={this.onChange.bind(this)}
                            floatingLabelText="Confirm password"
                            name="confirmPassword"
                            errorText={this.state.error.confirmPassword? this.state.error.confirmPassword : ""}
                            required = {isRegister}
                        />
                    </div>
                </div>
                <div className="button-line">
                    <RaisedButton type="submit" label={this.props.route.title} primary />
                </div>
            </form>
           </Card>
        );
    }
}