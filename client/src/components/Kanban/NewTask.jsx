import React, {Component} from "react";
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

export default class NewTask extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            name: ""
        };
    }

    onNewTaskClick(e) {
        this.props.addTask(this.state.name);
        this.state.name = '';
        this.setState(this.state);
    }
    onChangeName(e) {
        this.state.name = e.target.value;
        this.setState(this.state);
    }

    render() {
        return(
            <div key={-1} className="card__newtask">
            <TextField
                hintText="new task"
                style={{"display":"inline-block"}}
                value= {this.state.name}
                onChange={this.onChangeName.bind(this)}
            />
            <RaisedButton
                icon={<ContentAdd />}
                style={{"display":"inline-block", "minWidth": 40, "marginLeft": 10}}
                onClick={this.onNewTaskClick.bind(this)}
            />
        </div>
        );
    }
}