import Start from './components/Start.jsx';
import Dashboard from './components/DashBoard.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Auth from "./services/auth";
const routes = {
  // basxe component (wrapper for the whole application).
    component: Start,
    childRoutes: [
        {
            path: '/',
            getComponent: (location, callback) => {
                if (Auth.isUserAuthenticated()) {
                    callback(null, Dashboard);
                } else {
                    callback(null, Start);
                }
            }
        },
        {
            path: '/login',
            component: Login
        },

        {
            path: '/register',
            component: Register
        }

    ]
};

export default routes;