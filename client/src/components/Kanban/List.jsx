import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import ActionAndroid from 'material-ui/svg-icons/action/android';
import ContentAdd from 'material-ui/svg-icons/content/add';
import MyCard from './MyCard.jsx';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class List extends Component {

    constructor(props, context) {
        super(props, context);
    }

    onNewCardClick(e) {
        this.props.openNewCard(this.props.id);
    }

    render () {
        var cards = this.props.cards.map((card) => {
            return <MyCard type={this.props.title}
                key={card._id} id= {card._id} title={card.title} description={card.description} tasks={card.tasks}
                taskCallback={this.props.taskCallback}
                cardCallback={this.props.cardCallback}
            />;
        });
        return (
            <div className="col-xs-4">
                <h2 className="list__title">{this.props.title}</h2>
                <RaisedButton
                    icon={<ContentAdd />}
                    style={{"display":"inline-block", "minWidth": 40, "marginLeft": 10, "float": "right","marginTop": 10}}
                    onClick={this.onNewCardClick.bind(this)}
                />
                <ReactCSSTransitionGroup 
                    transitionName="card"
                    transitionEnterTimeout={300}
                    transitionLeaveTimeout={300}
                >
                    {cards}
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}
