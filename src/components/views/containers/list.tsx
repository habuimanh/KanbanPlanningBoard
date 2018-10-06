/// <reference path="./../../../../typings/index.d.ts" /> 
import * as React from "react";
import * as ReactDOM from "react-dom";
import { DropTarget, DragSource } from 'react-dnd';
import flow = require('lodash.flow');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getEmptyImage } from 'react-dnd-html5-backend';
import * as I from "./../interfaces";
import { changeListName, moveCard, onClick, deleteList, showPopUp } from "./../actions";
import CardContainer from "./cardContainer";
import { listSource, listTarget } from "./utils";
import { PopOverList } from "./popOverList";
import ReactTooltip = require("react-tooltip");

const mapDispatchToProps = (dispatch) => ({
    changeListName: bindActionCreators(changeListName, dispatch),
    moveCard: bindActionCreators(moveCard, dispatch),
    onClick: bindActionCreators(onClick, dispatch),
    deleteList: bindActionCreators(deleteList, dispatch),
    showPopUp: bindActionCreators(showPopUp, dispatch)
})
const mapStateToProps = (state: I.IViewState) => ({
    idClicked: state.idClicked,
    readonly: state.setting.readonly,
    viewOnProgress: state.viewOnProgress,
    allowRemoveList: state.mapping.allowRemoveList,
    allowAddCard: state.mapping.allowAddCard
})
const dragSource = DragSource('list', listSource, (connectDragSource, monitor) => ({
    connectDragSource: connectDragSource.dragSource(),
    isDragging: monitor.isDragging(),
    connectDragPreview: connectDragSource.dragPreview()
}))
const dropTarget = DropTarget('list', listTarget, connectDragSource => ({
    connectDropTarget: connectDragSource.dropTarget(),
}))
class List extends React.Component<I.IListProps, {}>{
    listName: HTMLTextAreaElement;
    listHeight: number;
    edittingName: boolean;
    keyTextArea: number;
    constructor(props) {
        super(props);
        this.listHeight = 0;
        this.edittingName = false;
        this.onPressEnter = this.onPressEnter.bind(this);
        this.setListHeight = this.setListHeight.bind(this);
        this.onClickList = this.onClickList.bind(this);
        this.showOverHeader = this.showOverHeader.bind(this);
        this.deleteList = this.deleteList.bind(this);
        this.showPopUpList = this.showPopUpList.bind(this);
        this.showCreateCard = this.showCreateCard.bind(this);
        this.keyTextArea = 1;
    }
    onPressEnter(event: any) {
        const { changeListName, listIndex } = this.props;
        const charEnter = 13;
        if ((event.keyCode === charEnter || event.which === charEnter)) {
            this.edittingName = false;
            event.preventDefault();
            changeListName(this.listName.value, listIndex);
        }
        else return;
    }
    setListHeight(newHeight: number) {
        //if card is swapped, get height of new list card from card container
        const heightRedundancy = 35.2 + 35.2;
        this.listHeight = newHeight + heightRedundancy;
    }
    onClickList(event: any) {
        const { onClick, list } = this.props;
        onClick(list.id);
        this.edittingName = true;
        event.stopPropagation();
        event.preventDefault();
    }
    componentWillReceiveProps(nextProps: I.IListProps) {
        this.keyTextArea = -this.keyTextArea;
        const { list, changeListName, listIndex } = this.props;
        if (this.edittingName && nextProps.idClicked != list.id) {
            changeListName(this.listName.value, listIndex);
            this.edittingName = false;
        }
    }
    componentDidMount() {
        const { connectDragPreview } = this.props;
        connectDragPreview(getEmptyImage(), {
            captureDraggingState: true
        })
    }
    deleteList() {
        const { deleteList, listIndex, onClick } = this.props;
        deleteList(listIndex);
        onClick("");
    }
    showPopUpList(event: any) {
        const { showPopUp, id } = this.props;
        showPopUp(id);
        event.stopPropagation();
    }
    showCreateCard(event: any) {
        const { onClick, id } = this.props;
        onClick("listcard" + id);
        event.stopPropagation();
    }
    showOverHeader(event: any) {
        const { onClick, idClicked, listIndex, viewOnProgress, allowRemoveList, allowAddCard } = this.props;
        //if still click on showPopUp, popup will be closed 
        if (idClicked === "showOverList" + listIndex.toString()) {
            onClick("");
            event.stopPropagation();
            return;
        }
        onClick("showOverList" + listIndex.toString());
        event.stopPropagation();
        //if popup larger than client screen, displace to left 
        const tittleDOM = ReactDOM.findDOMNode(this.refs["tittleDOM"]);
        let left = tittleDOM.getBoundingClientRect().left + 270 - 30;
        let top = tittleDOM.getBoundingClientRect().top + 30;
        const boardDiv = document.getElementById("board");
        if (boardDiv) {
            const { clientWidth } = boardDiv;
            const widthRedundancy = left + 280 - (clientWidth);
            if (widthRedundancy > 0) {
                left -= widthRedundancy + 5;
            }
        }
        ReactDOM.render(<PopOverList allowAddCard={allowAddCard} allowRemoveList={allowRemoveList} viewOnProgress={viewOnProgress} left={left} top={top} deleteList={this.deleteList} showPopUp={this.showPopUpList}
            showCreateCard={this.showCreateCard} />, document.getElementById("popUp") as Element);
    }
    componentDidUpdate() {
        const { readonly } = this.props;
        if (!this.props.isDragging) {
            ReactTooltip.rebuild();
        }
        if (!readonly && this.listName) {
            this.listName.disabled = false;
        }
        if (this.edittingName === true) {
            this.listName.focus();
        }
    }
    render() {
        const { connectDragSource, connectDropTarget, list, onClick,
            listIndex, isDragging, readonly, viewOnProgress } = this.props;
        let { listHeight } = this;
        const { onClickList, setListHeight, onPressEnter, showOverHeader } = this;
        return connectDragSource(connectDropTarget(
            <div className="list" style={isDragging ? { background: "rgba(0,0,0,.12)", height: listHeight, top: 5 } : {}}>
                {isDragging ? undefined :
                    <div style={{ height: "100%" }}>
                        <div ref="tittleDOM" className="list-name">
                            <textarea key={this.keyTextArea.toString()} className="list-name-input" ref={input => this.listName = input} spellCheck={false}
                                disabled={readonly || viewOnProgress} defaultValue={list.name} onClick={readonly ? undefined : onClickList}
                                onKeyPress={readonly ? undefined : onPressEnter}>
                            </textarea>
                            {!readonly && <div className="list-header-extras" onClick={showOverHeader}>
                                <a className="list-header-extras-menu" href="#" style={{ color: "#999" }}>
                                    <span className="glyphicon glyphicon-option-horizontal"></span>
                                </a>
                            </div>}
                        </div>
                        <CardContainer offlineMode={true} cards={list.cards} viewOnProgress={viewOnProgress} listId={list.id} listIndex={listIndex} setListHeight={setListHeight}
                            onClick={onClick} />
                        <ReactTooltip place="bottom" delayShow={500} className="special-tooltip" />
                    </div>}
            </div>
        ));
    }
}
//get result from dragSource and dropTarget into List by using lodash flow
export default flow(dragSource, dropTarget, connect(mapStateToProps, mapDispatchToProps))(List)