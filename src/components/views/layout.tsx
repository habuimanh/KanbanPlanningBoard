import React = require("react");
import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import reducer from "./reducers";
import { updateData } from "./actions";
import { convertData } from "./../convert";
import { KanbanView, WidgetConfigProperty } from "./../interface";
import { AppState } from "../application-state/state"
import Board from "./containers/board";
const mapStateToProps = (state: AppState) => ({
    data: convertData(state.data),
    mapping: state.data.getPropNames()
})
const mapDispatchToProps = (dispatch) => ({
    dispatch: dispatch,
})
export class Layout extends React.Component<{ offlineMode: boolean, data: KanbanView, dispatch, mapping: WidgetConfigProperty }, {}> {
    store;
    constructor(props) {
        super(props);
        this.store = createStore(reducer);
    }
    componentWillReceiveProps(nextProps: { data: KanbanView, dispatch, mapping: WidgetConfigProperty }) {
        if (nextProps.data) {
            try {
                this.store.dispatch(updateData(nextProps.data, nextProps.dispatch, nextProps.mapping));
            } catch (e) {
                console.log(e);
            }
        }
    }

    render() {
        return (
            <Provider store={this.store}>
                <Board />
            </Provider>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout);