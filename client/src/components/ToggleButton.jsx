import React from "react";

export default class ToggleButton extends React.Component {
    constructor({ initialChecked }) {
        super();
        this.state = { checked: initialChecked }
    }
    onTextChanged() {
        const newState = !this.state.checked;
        this.setState({ checked: newState }); // we update our state
        this.props.callbackParent(newState); // we notify our parent
    }
    render() {
        return <div className="form-group"><label><input className="form-control" type="checkbox"
                    checked={this.state.checked}
                    onChange={() => this.onTextChanged()}/>{this.props.text}</label></div>;
    }
}
