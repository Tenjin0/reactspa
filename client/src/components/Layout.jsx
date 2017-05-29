import React, {Component} from "react";
import { Card, CardTitle } from 'material-ui/Card';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import ActionSearch from 'material-ui/svg-icons/action/search';
import { Link } from 'react-router';
import { FontIcon } from 'material-ui/FontIcon';
import Router from 'react-router';
import Snackbar from 'material-ui/Snackbar';
import Auth from '../services/auth';
import SearchBar from './SearchBar.jsx';
import Api from '../services/api';
import io from 'socket.io-client';
import config from '../config'
const socket = io(config.url);

export default class Layout extends Component {
    constructor(props, context) {
        super(props, context);
        // this.changeUser = this.changeUser.bind(this);
        this.state = {
            title :"",
            success: false,
            message : '',
            user: {},
            isSearch : false,
            search : ""
        };
    }   

    onClickMenuItem(e) {
        Auth.deauthenticateUser();
        this.props.router.replace('/');
        this.state.user = {};
        this.setState(this.state);
    }

    changeUser(event) {
        const field = event.target.name;
        const user = this.state.user;
        user[field] = event.target.value;

        this.setState({
            user,
            title: this.state.title
        });
    }

    setTitle(value) {
        this.state.title = value;
        if (value === "Scrumboard") {
            this.state.isSearch = true;
        } else {
            this.state.isSearch = false;
            this.state.search = "";
        }
        this.setState(this.state);
        var currentLocation = this.props.location.pathname
        socket.emit("url", { url: currentLocation})
    }

    setUserContext(user) {
        // this.context.user = user;
        this.state.user = user;
        this.setState(this.state);
    }

    setLayoutMessage(success, message) {
        this.state.success = success;
        this.state.message = message;
        this.setState(this.state);
    }

    searchCallback(e) {
        this.state.search = e.target.value;
        this.setState(this.state);
    }
        
    componentDidMount() {

        if (Auth.isUserAuthenticated() && !this.state.user.email) {
            new Api().send('GET', '/api/users/profile' , null,(status, response)=> {
                if (status === 200) {
                    this.state.user = response.profile;
                    this.setState(this.state);
                    socket.emit('authentificate', { id : Auth.getAuthenticatedToken()})
                }
            });
        }
        if (navigator.geolocation) { //get lat lon of user  
            navigator.geolocation.getCurrentPosition(function(position) {
                socket.emit('geo', { latitude : position.coords.latitude, longitude : position.coords.longitude})
            }, function(err) {
            }, { 
                enableHighAccuracy: true 
            });
        }
        // const socket = io.connect(process.env.SOCKET_URL || 'http://localhost:4000');
        // socket.on('message', msg => console.log(msg));
        this.state.socket = socket;
        this.setState(this.state);

        socket.on('connect', () => {
            console.warn('connect');
        });
        socket.on('error', (err) => {
        });

    }

    render() {
        const childrenWithProps = React.Children.map(this.props.children,
            (child) => React.cloneElement(child, {
                setTitle: this.setTitle.bind(this), 
                setUserContext: this.setUserContext.bind(this),
                setLayoutMessage: this.setLayoutMessage.bind(this),
                user: this.state.user,
                search : this.state.search,
                socket : this.state.socket
            })
        );

        const errorStyle = {
            "backgroundColor": "#f2dede","borderColor": "#ebcccc","color": "#a94442","textAlign": "center"
        };
        const successStyle = {
            "backgroundColor": "#FFF","borderColor": "#ebcccc","color": "#a94442","textAlign": "center"
        }; 
        var Logged = <IconMenu
            iconButtonElement={
                <IconButton><MoreVertIcon style={{"color" : "white"}}/></IconButton>
                }
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
            >
                 <MenuItem primaryText="Home"
                    containerElement={<Link to="/" />}
                />
                 {  Auth.isUserAuthenticated() && this.state.user.role === "Admin" ?
                    <MenuItem key="admin" primaryText="Admin"
                        containerElement={<Link to="/admin" />}
                 /> : null
                 }
                
                { Auth.isUserAuthenticated() ?
                    [<MenuItem key="board" primaryText="Board"
                        containerElement={<Link to="/kanban" />}
                    />,
                    <MenuItem key="profile" primaryText="Profile"
                        containerElement={<Link to="/profile" />}
                    />,
                    <MenuItem key={2} primaryText="Logout"
                        containerElement={<span>Logout</span>}
                        onClick={this.onClickMenuItem.bind(this)}
                    />]
                : 
                    [<MenuItem key={1} primaryText="Register"
                        containerElement={<Link to="/register" />}
                    />,
                    <MenuItem key={2} primaryText="Login"
                        containerElement={<Link to="/login" />}
                    />]
                }
            </IconMenu>;

        var  iconElementRight;

        if (this.state.isSearch) {
            iconElementRight =<span><SearchBar key="searchbar" search={this.state.search} searchCallback={this.searchCallback.bind(this)}/>{Logged}</span>;
        } else {
            iconElementRight =<span>{Logged}</span>;
        }
        return (
            <div>
                <AppBar
                title="Title"
                id="appBar"
                iconElementRight={iconElementRight}
                />
                <div id="content">
                    <Card className="container">
                        toto
                        <CardTitle title="React Application" subtitle={"This is the " + this.state.title + " page."} />
                    </Card>
                    {childrenWithProps}
                </div>
                    {this.state.message ? 
                    <Snackbar
                        open= {!!this.state.message}
                        message= {this.state.message}
                        autoHideDuration={4000}
                        bodyStyle={this.state.success ? successStyle : errorStyle}
                        onRequestClose={() => this.state.message = null}
                        onActionTouchTap={() => { this.state.message = null; this.setState(this.state)}}
                    /> : null}
            </div>
        );
    }
} 

// Layout.contextTypes = {
//     router: React.PropTypes.func.isRequired,
// };
