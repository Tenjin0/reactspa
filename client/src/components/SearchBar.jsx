import React , {Component} from 'react';
import ActionSearch from 'material-ui/svg-icons/action/search';
import {cyan500} from 'material-ui/styles/colors';
import {grey300} from 'material-ui/styles/colors';

export default class SearchBar extends Component {
    constructor() {
        super(...arguments);
        
    }

    render() {

        var style = {"position" : "relative", "borderRadius" : "0 40px 40px 0",
                        "background": grey300, "top": 11, "height": "2.2em", "color": cyan500, "width" : 40, "padding" : 3};
        return (
            <div className="searchbar">
                <input type="text" placeholder="search" value={this.props.search} onChange={this.props.searchCallback}/><ActionSearch style={style}/>
            </div>
        );
    }
}