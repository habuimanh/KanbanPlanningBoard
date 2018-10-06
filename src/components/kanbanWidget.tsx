/// <reference path="./../../typings/index.d.ts" /> 
import * as React from "react";
import { WidgetConfigProperty } from "./interface";
import { newStore } from "./application-state";
import actions = require("./application-state/action");
import { Provider } from 'react-redux';
import Layout from "./views/layout";
export default class KanbanWidgetContainer extends React.Component<WidgetConfigProperty, {}>{
    store
    constructor(props) {
        super(props);
        this.store = newStore(this.props.offlineSupported);
    }
    componentWillReceiveProps(nextProps: WidgetConfigProperty) {
        if (nextProps.mxObject) {
            this.store.dispatch(actions.loadInitialDataAction(nextProps.mxObject, nextProps));
        }
    }
    componentWillUnmount() {
        this.store.dispatch({ type: actions.ActionType.UNMOUNT });
    }
    render() {
        return (
            <Provider store={this.store}>
                <Layout offlineMode={this.props.offlineSupported} />
            </Provider>
        )
    }
    componentDidUpdate() {
        const thisDiv = document.getElementById("kanbanWidget");
        const boardDiv = document.getElementById("board");
        if (thisDiv && boardDiv) {
            window.setTimeout((thisDiv, boardDiv) => {
                thisDiv = document.getElementById("kanbanWidget");
                boardDiv = document.getElementById("board");
                const body = document.body,
                    html = document.documentElement;
                const height = Math.max(body.scrollHeight, body.offsetHeight,
                    html.clientHeight, html.scrollHeight, html.offsetHeight);
                if (thisDiv.getBoundingClientRect().top != 0) {
                    thisDiv.style.top = thisDiv.getBoundingClientRect().top.toString() + "px";
                    boardDiv.style.height = (height - thisDiv.getBoundingClientRect().top).toString() + "px";
                }
            })
        }
    }
}
