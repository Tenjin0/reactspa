import React, {Component} from 'react';
import Task from './Task.jsx';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import Toggle from 'material-ui/Toggle';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import ImageEdit from 'material-ui/svg-icons/image/edit';
import ActionDelete from 'material-ui/svg-icons/action/delete';

import ActionDone from 'material-ui/svg-icons/action/done';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

import NewTask from './NewTask.jsx';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class MyCard extends Component {

    constructor() {
        super(...arguments);
        this.state = {
            expanded: true,
            edit: false,
            title: "",
            description : "",
            hover: false
        };

        if (this.props.title) {
            this.state.title = this.props.title;
        }

        if (this.props.description) {
            this.state.description = this.props.description;
        }
    }

    onChange(e) {
        this.state[e.target.name] = e.target.value;
        this.setState(this.state);
    }

    handleToggle(e) {
        this.state.expanded = !this.state.expanded;
        this.setState(this.state);
    }

    onNewTaskClick(name) {
        this.props.taskCallback.addTask(this.props.id, name);
    }
    
    onEditClick(e) {
        this.state.edit=true;
        this.state.expanded=true;
        this.setState(this.state);
    }
    
    onDeleteClick(e) {
        this.props.cardCallback.deleteCard(this.props.id);
    }

    onCancelClick(e) {
        this.state.edit = false;
        this.setState(this.state);
    }

    onDoneClick(e) {
        this.state.edit = false;
        this.setState(this.state);
        this.props.cardCallback.editCard(this.props.id, this.state.title, this.state.description);
    }

    onHandleHover(e) {
        this.state.hover= true;
        this.setState(this.state);
    }
    onHandleBlur(e) {
        this.state.hover= false;
        this.setState(this.state);
        
    }
    render() {
        var  zIndex = this.props.type ===  'Todo' ? 3 : this.props.type ===  'In progress' ? 2 : 1;
        var tasks = this.props.tasks.map((task) => {
            return <Task key={task._id} idCard={this.props.id} id={task._id} name={task.name} done={task.done} taskCallback={this.props.taskCallback}/>;
        });

        var description = 
            <div key={0} className="card__description">
                { this.state.edit ? 
                    <TextField
                        type="text"
                        floatingLabelText="Description"
                        onChange={this.onChange.bind(this)}
                        name="description"
                        value={this.state.description}
                    />
                :
                    this.props.description
                }
            </div>;
        
      
        var title = this.state.edit ?
             <TextField
                    type="text"
                    floatingLabelText="Title"
                    onChange={this.onChange.bind(this)}
                    name="title"
                    value={this.state.title}
                />
            : this.props.title;
        
        var actionsCard = [<RaisedButton
                key={0}
                icon={<ImageEdit />}
                style={{"display": "block","width": 40,"minWidth": 40}}
                onClick={this.onEditClick.bind(this)}
            />,<RaisedButton
                key={1}
                icon={<ActionDelete />}
                style={{"display": "block","width": 40,"minWidth": 40}}
                onClick={this.onDeleteClick.bind(this)}
            />];

        var content;
        if (this.state.expanded ) {
            if (!this.state.edit) {
                content=  <div className="card__content">
                    {description}
                    <ReactCSSTransitionGroup 
                        transitionName="task"
                        transitionEnterTimeout={300}
                        transitionLeaveTimeout={300}
                    >
                        {tasks}
                    </ReactCSSTransitionGroup>
                    <NewTask addTask={this.onNewTaskClick.bind(this)}/>
                </div>;
            } else {
                content=  <div className="card__content">
                    {description}
                    <div className="card__edit">
                        <RaisedButton
                            icon={<NavigationClose />}
                            style={{"display": "inline-block","width": 40,"minWidth": 40}}
                            onClick={this.onCancelClick.bind(this)}
                        />
                        <RaisedButton
                            icon={<ActionDone />}
                            style={{"display": "inline-block","width": 40,"minWidth": 40}}
                            onClick={this.onDoneClick.bind(this)}
                        />
                    </div>
                </div>;
            }
        }
            
        return (
            <div className="card-wrapper" onMouseEnter={this.onHandleHover.bind(this)} onMouseLeave={this.onHandleBlur.bind(this)}>
                <Card style={{"padding" : 0, "zIndex" : zIndex}} containerStyle={{"padding" : 0 }} className="card">
                    <ReactCSSTransitionGroup
                        transitionName="cardaction"
                        transitionEnterTimeout={300}
                        transitionLeaveTimeout={300}
                    >
                        {this.state.hover && !this.state.edit ?
                            <div className="card__actions">
                                {actionsCard}
                            </div>
                            : null
                        }
                    </ReactCSSTransitionGroup>
                    <div className="card__header">
                        <div className="card__title">
                            {title}
                        </div>
                        {!this.state.edit ?
                            <div className="card__toggle">
                                <Toggle
                                    toggled={this.state.expanded}
                                    onToggle={this.handleToggle.bind(this)}
                                />
                            </div> : null
                        }
                    </div>
                    <ReactCSSTransitionGroup
                        transitionName="cardcontent"
                        transitionEnterTimeout={300}
                        transitionLeaveTimeout={300}
                     >
                        {content}
                    </ReactCSSTransitionGroup>
                </Card>
            </div>  
        );
    }
}
