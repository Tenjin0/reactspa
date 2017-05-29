import React, {Component} from "react";
import Api from "../../services/api";
import RaisedButton from 'material-ui/RaisedButton';
import ActionAndroid from 'material-ui/svg-icons/action/android';
import List from "./List.jsx";
import NewCard from "./NewCard.jsx";

export default class Board extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            title : "board",
            cards : [],
            open : false,
            category : "todo"
        };
        
    }

    init(callback) {
        (new Api()).send("GET", "/api/cards",null, (status, response)=> {
            callback(response.cards);
        });
    }

    addTask(idCard, name) {
        new Api().send('POST', '/api/cards/' + idCard + '/tasks', { name }, (status, response)=> {
            // TODO STATUS !== 200
            if (status === 201) {
                var indexCard = this.state.cards.findIndex((card)=> {
                    return card._id === response.card._id;
                });
                // TODO indexCard <0
                if (indexCard >= 0) {
                    this.state.cards[indexCard] = response.card;
                    this.setState(this.state);
                }
            }
            this.props.socket.emit('update card', { card : response.card })
            this.props.setLayoutMessage(response.success, response.message);
        });
    }

    deleteTask(idCard, id) {
        new Api().send('DELETE', '/api/cards/' + idCard + '/tasks/'+ id, null, (status, response)=> {
            // TODO STATUS !== 200
            if (status === 200) {
                var indexCard = this.state.cards.findIndex((card)=> {
                    return card._id === response.card._id;
                });
                // TODO indexCard <0
                if (indexCard >= 0) {
                    this.state.cards[indexCard] = response.card;
                    this.setState(this.state);
                }
            }
            this.props.socket.emit('update card', { card : response.card })
            this.props.setLayoutMessage(response.success, response.message);
        });
    }
    
    deleteCard(idCard) {
        new Api().send('DELETE', '/api/cards/' + idCard, null, (status, response)=> {
            // TODO STATUS !== 200
            if (status === 200) {
                var indexCard = this.state.cards.findIndex((card)=> {
                    return card._id === response.card._id;
                });
                // TODO indexCard <0
                if (indexCard >= 0) {
                    this.state.cards.splice(indexCard,1);
                    this.setState(this.state);
                }
            }
            this.props.socket.emit('delete card', { card : response.card})
            this.props.setLayoutMessage(response.success, response.message);
        });
    }

    editCard(idCard, title, description) {
        var card = {
            title,
            description
        };
        new Api().send('PUT', '/api/cards/' + idCard, card, (status, response)=> {
            var indexCard = this.state.cards.findIndex((card)=> {
                return card._id === response.card._id;
            });

            this.state.cards[indexCard] =response.card ;
            this.props.socket.emit('update card', { card : response.card})
            this.setState(this.state);

        });
    }

    toggleTask(checked, idCard, id) {
        var task = {
            done : checked
        };
        new Api().send('PUT', '/api/cards/' + idCard + '/tasks/' + id, task, (status, response)=> {
            var indexCard = this.state.cards.findIndex((card)=> {
                return card._id === idCard;
            });

            var card = this.state.cards[indexCard];
            var indexTask = card.tasks.findIndex((task)=> {
                return task._id === id;
            });

            card.tasks[indexTask] = response.task;
            this.setState(this.state);
        });
    }

    handleClose(title, description, status) {
        if (title && description && status) {
            new Api().send('POST', '/api/cards/', {title, description, status}, (status, response)=> {
                this.state.cards.push(response.card);
                this.state.open = false;
                this.props.socket.emit('add card', { card : response.card})
                this.setState(this.state);
            });
        } else {
            this.state.open = false;
            this.setState(this.state);
        }
    }

    openNewCard(category) {
        this.state.open = true;
        this.state.category = category;
        this.setState(this.state);
    }

    componentDidMount() {
        this.props.setTitle("Scrumboard");
        this.init((cards)=> {
            this.state.cards = cards;
            this.setState(this.state);
        });
    }
    
    search(card) {
        if (this.props.search.length > 0) {
            var contain = false;
            if (card.title.includes(this.props.search)) {
                return true;
            }
            if (card.description.includes(this.props.search)) {
                return true;
            }
            for (var i = 0; i < card.tasks.length; i++) {
                var element = card.tasks[i];
                if (element.name.includes(this.props.search)) {
                    return true;
                }
            }
        } else {
            return true;
        }

        return contain;
    }

    componentWillReceiveProps(nextProps) {
        // console.warn(nextProps);
        if (nextProps.socket) {
            nextProps.socket.on('update card', function(data) {
                for(var i = 0; i < this.state.cards.length; i++ ) {
                    if (this.state.cards[i]._id = data.card._id) {
                        this.state.cards[i] = data.card;
                        this.setState(this.state);
                        break;
                    }
                }
            }.bind(this));
            nextProps.socket.off('added card').on('added card', function(data) {
                this.state.cards.push(data.card);
                this.setState(this.state);
            }.bind(this));
            nextProps.socket.on('delete card', function(data) {
                for(var i = 0; i < this.state.cards.length; i++ ) {
                    if (this.state.cards[i]._id === data.card._id) {
                        var removed = this.state.cards.splice(i,1);
                        // this.state.cards[i] = data.card;
                        this.setState(this.state);
                        break;
                    }
                }
            }.bind(this));
        }
    }

    render() {
        var taskCallback = {
            addTask : this.addTask.bind(this),
            deleteTask: this.deleteTask.bind(this),
            toggleTask: this.toggleTask.bind(this)
        };

        var cardCallback = {
            deleteCard: this.deleteCard.bind(this),
            editCard : this.editCard.bind(this)
        };

        var categories = {
            "todo" : "Todo",
            "in-progress" : "In progress",
            "done" : "Done"
        };


        var list = Object.keys(categories).map((category) => {
            return <List
                        key={category} id={category} title={categories[category]}
                        cards={this.state.cards.filter((card) => { return card.status === category && this.search(card); })}
                        taskCallback={taskCallback} cardCallback={cardCallback} openNewCard={this.openNewCard.bind(this)}
                    />;
        });
        return(
            <div className="scrumboard">
                <NewCard open={this.state.open} category={this.state.category} handleClose={this.handleClose.bind(this)}/> 
                {list}
            </div>
        );
    }
}
