import React, {Component} from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

export default class NewCard extends Component {


    constructor() {
        super(...arguments);
        this.state = {
            title :"",
            description: ""
        };
    }

    onChange(e) {
        this.state[e.target.name] = e.target.value;
        this.setState(this.state);
    }

    onClickSubmit(e) {
        if (this.state.title.length > 0 && this.state.description.length > 0) {
            this.props.handleClose(this.state.title, this.state.description, this.props.category);
            // this.props.socket.emit('add card')
        }
    }

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.props.handleClose}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.onClickSubmit.bind(this)}
            />,
        ];

        return (
            <Dialog
                title="Create a new Card"
                actions={actions}
                modal={false}
                open={this.props.open}
                autoDetectWindowHeight={false}
                onRequestClose={this.props.handleClose}
                contentStyle={{"maxWidth": 300}}
                bodyStyle={{"height": 300}}
            >
                <form onSubmit={this.onClickSubmit.bind(this)}>
                    <div className="field-line">
                        <TextField
                            type="text"
                            floatingLabelText="Title"
                            onChange={this.onChange.bind(this)}
                            name="title"
                            required
                        />
                    </div>
                    <div className="field-line">
                        <TextField
                            type="text"
                            floatingLabelText="Description"
                            onChange={this.onChange.bind(this)}
                            name="description"
                            required
                        />
                    </div>
                </form>
            </Dialog>
        );
    }
}
