import React, {Component} from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Api from "../services/api";

export default class Admin extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            users : [],
            user : {}
        };
    }

    componentDidMount() {
        this.props.setTitle(this.props.route.title);
        if (this.props.socket) {

        }

        new Api().send('GET', '/api/users/',null,  (status, response)=> {
            if (status === 200) {
                this.state.users  = response.users;
                this.setState(this.state);
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.user.email) {
            this.state.user = nextProps.user;
            this.setState(this.state);
        }
        if (nextProps.socket) {
            nextProps.socket.on('usersAuth', function(data, fn) {
                // console.warn(data);

            }) 
        }
    }

    handleChange(event, key, payload) {
        // console.warn(event.target, key, payload);
    }

    render() {
        // if(this.props.socket) {
        //     this.props.socket.emit('usersAuth')        
        // }
        // console.warn(this.props);
        var users = this.state.users.map((user) => {
            return <TableRow selectable={false} key ={user._id}>
                        <TableRowColumn >{user.email}</TableRowColumn>
                        <TableRowColumn>{user.username}</TableRowColumn>
                        <TableRowColumn> 
                            <SelectField
                                value={user.role}
                                    onChange={this.handleChange.bind(this)}
                                    disabled={user._id === this.state.user._id}
                                >
                                    <MenuItem value="Admin" primaryText="Admin" />
                                    <MenuItem value="Trainer" primaryText="Trainer" />
                                    <MenuItem value="Student" primaryText="Student" />
                            </SelectField>
                        </TableRowColumn>
                    </TableRow>;
        });
        return(
            <Table>
                <TableHeader
                     displaySelectAll={false}
                    adjustForCheckbox={false}
                >
                    <TableRow selectable={false}>
                        <TableHeaderColumn>Email</TableHeaderColumn>
                        <TableHeaderColumn>Username</TableHeaderColumn>
                        <TableHeaderColumn>Role</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                    {users}
                </TableBody>
            </Table>
        );
    }
}
