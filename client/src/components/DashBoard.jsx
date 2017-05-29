import React, {Component} from "react";

export default class DashBoard extends Component {
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        this.props.setTitle("Dashboard");
    }

    render() {
        if (this.props.socket) {
            this.props.socket.on("users", function(data, fn) {
                console.warn(data);
            });
            this.props.socket.emit("users")
        }
        return(
            <div>
                <div>User online : this.props</div>             
            </div>
        );
    }
}
