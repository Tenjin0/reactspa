import routes from './routes.jsx';
import React from "react";
import ReactDOM from "react-dom";
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { browserHistory, Router, Route,  hashHistory, IndexRoute } from 'react-router';

import Start from './components/Start.jsx';
import Dashboard from './components/DashBoard.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Admin from './components/Admin.jsx';
import Layout from './components/Layout.jsx';
import kabanBoard from './components/Kanban/Board.jsx';

import Auth from "./services/auth";


// import io from 'socket.io-client';
// import { SocketProvider } from 'socket.io-react';

// import 'bootstrap/dist/css/bootstrap.css';
const app = document.getElementById("app");

// if (module.hot) {
//     module.hot.accept();
// }

/**
 * 
 */
function requireAuth(nextState, replace) {
    if (!Auth.isUserAuthenticated()) {
        replace({
            pathname: '/login',
            state: { nextPathname: nextState.location.pathname }
        });
    }
}

injectTapEventPlugin();

ReactDOM.render((
    
    <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Router history={browserHistory}>
            <Route path='/' component={Layout} >
                <IndexRoute 
                    getComponent={(location, callback) => {
                        if (Auth.isUserAuthenticated()) {
                            callback(null,  props => <Dashboard {...props} title={"Dashboard"} />);
                        } else {
                            callback(null,  props => <Start {...props} title={"Home"} />);
                        }
                    }}
                />
                <Route path='/register' component={Register} title="Register"/>
                <Route path='/login' component={Login} title="Login" />
                <Route path='/admin' component={Admin} title="Admin" onEnter={requireAuth}/>
                <Route path='/profile' component={Register} title="Profile" onEnter={requireAuth}/>
                <Route path='/kanban' component={kabanBoard} title="Kanban Board" onEnter={requireAuth}/>
            </Route>
        </Router>
    </MuiThemeProvider>), app);