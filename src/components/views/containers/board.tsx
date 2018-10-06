/// <reference path="./../../../../typings/index.d.ts" />
import * as React from "react";
import * as ReactDOM from "react-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import * as I from "./../interfaces";
import List from "./list";
import { addList, moveList, onClick, changeNameNewList } from "./../actions";
import flow = require('lodash.flow');
import CustomDragLayer from "./customDragLayer";
import * as II from "../../interface";
const mapStateToProps = (state: I.IViewState) => ({
    state: state
})
const mapDispatchToProps = (dispatch) => ({
    addList: bindActionCreators(addList, dispatch),
    moveList: bindActionCreators(moveList, dispatch),
    onClick: bindActionCreators(onClick, dispatch),
    changeNameNewList: bindActionCreators(changeNameNewList, dispatch)
})
class Board extends React.Component<I.IBoardProps, { showCreateList: boolean }>{
    inputCreateList: HTMLInputElement;
    //keyCreateList to render new DOM when rerender
    keyCreateList: boolean;
    constructor(props) {
        super(props);
        this.moveList = this.moveList.bind(this);
        this.onClickRenderer = this.onClickRenderer.bind(this);
        this.state = {
            showCreateList: false
        }
        this.showCreateList = this.showCreateList.bind(this);
        this.closeCreateList = this.closeCreateList.bind(this);
        this.saveNewList = this.saveNewList.bind(this);
        this.keyCreateList = false;
        this.onPressEnter = this.onPressEnter.bind(this);
    }
    moveList(dragId, dropIndex, commitToServer: boolean) {
        const { lists } = this.props.state;
        const list = lists.filter(list => list.id === dragId)[0];
        let dragIndex = lists.indexOf(list);
        this.props.moveList(dragIndex, dropIndex, commitToServer);
    }
    onClickRenderer() {
        const { onClick } = this.props;
        onClick("");
    }
    componentWillReceiveProps(nextProps: I.IBoardProps) {
        //if don't click to show pop up, pop up will be closed
        if (!nextProps.state.idClicked || nextProps.state.idClicked === "createList") {
            ReactDOM.render(<div hidden />, document.getElementById("popUp") as Element);
        }
        const { changeNameNewList } = this.props;
        //if idClicked is not equal createaList, close generate list
        if (nextProps.state.idClicked != "createList" && this.state.showCreateList) {
            this.setState({
                showCreateList: false
            })
            changeNameNewList(this.inputCreateList.value);
        }
    }
    showCreateList(event) {
        const { onClick } = this.props;
        onClick("createList");
        event.stopPropagation();
        this.setState({
            showCreateList: true
        })
    }
    closeCreateList() {
        this.setState({
            showCreateList: false
        })
    }
    onPressEnter(event: any) {
        const { addList } = this.props;
        const charEnter = 13;
        //if press on enter, addList actions will be actived
        if (this.inputCreateList.value === "" && (event.keyCode === charEnter || event.which === charEnter)) {
            event.preventDefault();
            return;
        }
        else if ((event.keyCode === charEnter || event.which === charEnter)) {
            event.preventDefault();
            addList(this.inputCreateList.value);
            this.keyCreateList = !this.keyCreateList;
        }
    }
    saveNewList(event) {
        //add new list when click on Add button
        const { addList } = this.props;
        if (this.inputCreateList.value != "") {
            addList(this.inputCreateList.value);
        }
        event.preventDefault();
        this.keyCreateList = !this.keyCreateList;
    }
    componentDidUpdate() {
        if (this.inputCreateList && this.inputCreateList.value === "") {
            this.inputCreateList.focus();
        }
    }
    render() {
        const { state } = this.props;
        const readonly = state.setting.readonly;
        const { moveList, onClickRenderer, showCreateList, closeCreateList, saveNewList } = this;
        let lists: II.IList[] = [];
        if (state.viewOnProgress && state.lists.length > 0) {
            let listTodo: II.IList = {
                cards: [],
                id: "1",
                name: "To do",
                order: 1,
                state: II.WorkState.To_do
            }
            let listDone: II.IList = {
                cards: [],
                id: "2",
                name: "Done",
                order: 2,
                state: II.WorkState.Done
            }
            let listProgress: II.IList = {
                cards: [],
                id: "3",
                name: "In Progress",
                order: 3,
                state: II.WorkState.In_Progress
            };
            state.lists.forEach(list => {
                list.cards.forEach(card => {
                    if (card.state === II.WorkState.Done) {
                        listDone.cards.push(card);
                    } else if (card.state === II.WorkState.In_Progress) {
                        listProgress.cards.push(card);
                    } else {
                        listTodo.cards.push(card)
                    }
                })
            })
            lists = [listTodo, listProgress, listDone];
        }
        return (
            <div>
                <div id="kanbanWidget" style={{ position: "fixed", left: 0 }}>
                    <div id="board" className={"board" + (readonly ? " readonly" : "")} onClick={onClickRenderer}>
                        <CustomDragLayer />
                        {state.viewOnProgress ? lists.map((list, i) =>
                            <List list={list} key={list.id} id={list.id} listIndex={i} moveList={moveList} />)
                            : state.lists.map((list, i) =>
                                <List list={list} key={list.id} id={list.id} listIndex={i} moveList={moveList} />
                            )}
                        {state.mapping.allowAddList ? (!readonly &&
                            (this.state.showCreateList && !state.viewOnProgress ?
                                <div className="create-list" onClick={(event) => event.stopPropagation()}>
                                    <form>
                                        <input
                                            defaultValue={state.nameNewList} onKeyPress={readonly ? undefined : this.onPressEnter} key={this.keyCreateList.toString()} ref={(input) => this.inputCreateList = input}
                                            className="addlist-name-input" placeholder="Add a list…" maxlength={512} />
                                        <div className="list-add-controls">
                                            <button onClick={saveNewList} className="btn btn-default" id="addButton">Add</button>
                                            <span onClick={closeCreateList} className="glyphicon glyphicon-remove" id="closeButton" style={{ cursor: "pointer" }} />
                                        </div>
                                    </form>
                                </div> :
                                <div className="addList" >
                                    <span onClick={readonly ? undefined : showCreateList}>
                                        Add a list...
                                     </span>
                                </div>)) : undefined}
                    </div >
                    <div id="popUp" />
                    <div id="cardQuickEditor" />
                </div>
            </div>
        )
    }
}
//connect drag and drop by HTML5Backend with Board is context object
export default flow(connect(mapStateToProps, mapDispatchToProps), (DragDropContext(HTML5Backend)))(Board);
