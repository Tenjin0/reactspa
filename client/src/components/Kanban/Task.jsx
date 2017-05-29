import React, {Component} from 'react';
import Checkbox from 'material-ui/Checkbox';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';

export default class Task extends Component {

    constructor() {
        super(...arguments);
    }

    handleToggle(e) {
        this.props.taskCallback.toggleTask(e.target.checked, this.props.idCard, this.props.id);
    }
    
    render() {
        const styles = {
            smallIcon: {
                width: 18,
                height: 18,
                paddingBottom : 2
            },
            small: {
                width: 15,
                height: 15,
                padding: 5
            }
        };
        
        return(
            <div className="task">
                <div className="task__check">
                    <Checkbox
                        iconStyle={ {"top": "1px"}}
                        checked={this.props.done}
                        onCheck= {this.handleToggle.bind(this)}
                />
                </div>
                <div className="task__name">
                    {this.props.name}
                </div>
                <div className="task__delete">
               
                    <IconButton tooltip="SVG Icon"
                        iconStyle={styles.smallIcon}
                        style={styles.small}
                        onClick={this.props.taskCallback.deleteTask.bind(null, this.props.idCard, this.props.id)}
                    >
                        <ActionDelete />
                    </IconButton>
                </div>
            </div>
        );
    }
}
