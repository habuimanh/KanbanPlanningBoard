/// <reference path="./../../../../typings/index.d.ts" /> 
import * as React from "react";
import * as ReactDOM from "react-dom";
import flow = require('lodash.flow');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DropTarget } from 'react-dnd';
import { saveNewCard, changeNameNewCard, onClick, showPopUp, moveCard, deleteCard, changeCardName, removeOrAddMember } from "./../actions";
import * as I from "./../interfaces";
import { cardContainerTarget } from "./utils";
import Card from "./card";
import { CreateCard } from "./createCard";
const mapDispatchToProps = (dispatch) => ({
    saveNewCard: bindActionCreators(saveNewCard, dispatch),
    changeNameNewCard: bindActionCreators(changeNameNewCard, dispatch),
    onClick: bindActionCreators(onClick, dispatch),
    showPopUp: bindActionCreators(showPopUp, dispatch),
    moveCard: bindActionCreators(moveCard, dispatch),
    deleteCard: bindActionCreators(deleteCard, dispatch),
    changeCardName: bindActionCreators(changeCardName, dispatch),
    removeOrAddMember: bindActionCreators(removeOrAddMember, dispatch),
})
const mapStateToProps = (state: I.IViewState) => ({
    idClicked: state.idClicked,
    nameNewCard: state.nameNewCard,
    readonly: state.setting.readonly,
    // cards: state.lists[ownProps.listIndex].cards,
    accounts: state.accounts,
    viewOnProgress: state.viewOnProgress,
    allowAddCard: state.mapping.allowAddCard,
    allowRemoveCard: state.mapping.allowRemoveCard
})
const dropTarget = DropTarget('card', cardContainerTarget, (connectDragSource, monitor) => ({
    connectDropTarget: connectDragSource.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    item: monitor.getItem()
}))
export class CardContainer extends React.Component<I.ICardContainerProps, I.ICardContainerStates> {
    heightCards: number[];
    keyCreateCard: number;
    constructor(props) {
        super(props);
        this.state = {
            placeHolderIndex: -1,
            hoverHeight: 0
        };
        this.onShowCreateCard = this.onShowCreateCard.bind(this);
        this.onSaveCreateCard = this.onSaveCreateCard.bind(this);
        this.closeCreateCard = this.closeCreateCard.bind(this);
        //list height of cards in this list
        this.heightCards = [];
        this.keyCreateCard = 1;
    }
    onShowCreateCard(event: any) {
        const { onClick, listId } = this.props;
        onClick("listcard" + listId);
        event.stopPropagation();
    }
    closeCreateCard(event: any) {
        const { onClick } = this.props;
        onClick("");
        event.stopPropagation();
    }
    onSaveCreateCard(textarea: any, event: any) {
        const { listIndex, saveNewCard } = this.props;
        if (textarea === "") return;
        saveNewCard(listIndex, textarea);
        event.stopPropagation();
        this.keyCreateCard = -this.keyCreateCard;
    }
    onCardClick(cardId: string) {
        const { showPopUp } = this.props;
        showPopUp(cardId);
    }
    render() {
        const { connectDropTarget, cards, isOver, canDrop, listIndex, idClicked, nameNewCard,
            changeNameNewCard, listId, readonly, deleteCard, changeCardName, allowAddCard, allowRemoveCard } = this.props;
        /*
            placeHolderIndex is index of card target in list cards when hover
            hoverHeight is height of card drag source when starting hover
        */
        const { placeHolderIndex, hoverHeight } = this.state;
        const { onShowCreateCard, onSaveCreateCard, closeCreateCard } = this;
        let isPlaceHold = false;
        let cardList: JSX.Element[] = [];
        cards.forEach((card, i) => {
            if (isOver && canDrop) {
                isPlaceHold = false;
                if (i === 0 && placeHolderIndex === -1) {
                    cardList.push(<div key="placeholder" className="card placeholder" style={{ minHeight: hoverHeight, backgroundColor: "#d0d0d0" }} />);
                } else if (placeHolderIndex > i) {
                    isPlaceHold = true;
                }
            }
            if (card !== undefined) {
                cardList.push(
                    <Card
                        allowRemoveCard={allowRemoveCard}
                        viewOnProgress={this.props.viewOnProgress}
                        removeOrAddMember={this.props.removeOrAddMember}
                        accounts={this.props.accounts}
                        card={cards[i]}
                        deleteCard={deleteCard} changeCardName={changeCardName}
                        readonly={readonly}
                        key={card.id}
                        ref={i.toString()}
                        listIndex={listIndex}
                        cardIndex={i}
                        onClick={this.onCardClick.bind(this)}
                        showPopup={this.props.onClick} />
                );
            }
            if (isOver && canDrop && placeHolderIndex === i) {
                cardList.push(<div key="placeholder" className="card placeholder" style={{ minHeight: hoverHeight, backgroundColor: "#d0d0d0" }} />);
            }
        })
        // if placeholder index is greater than array.length, display placeholder as last
        if (isPlaceHold) {
            cardList.push(<div key="placeholder" className="card placeholder" style={{ minHeight: hoverHeight, backgroundColor: "#d0d0d0" }} />);
        }
        // if there is no items in cards currently, display a placeholder anyway
        if (isOver && canDrop && cards.length === 0) {
            cardList.push(<div key="placeholder" className="card placeholder" style={{ minHeight: hoverHeight, backgroundColor: "#d0d0d0" }} />);
        }
        return connectDropTarget(
            <div style={{ height: "100%" }}>
                <div className="list-card-container" ref="this">
                    {cardList}
                </div>
                {allowAddCard ? (!readonly && <div key={this.keyCreateCard.toString()} onClick={readonly ? undefined : onShowCreateCard} className="add-card-container">
                    <CreateCard idClicked={idClicked} onClose={closeCreateCard} cardName={nameNewCard} readOnly={readonly}
                        changeNameCard={changeNameNewCard} saveNewCard={onSaveCreateCard} listId={listId} />
                </div>) : undefined}
            </div>
        );
    }
    componentDidMount() {
        this.heightCards = [];
        const { setListHeight } = this.props;
        //push height of each card in list card into array heightCards
        for (let i = 0; i < this.props.cards.length; ++i) {
            let refDOM = ReactDOM.findDOMNode(this.refs[i]);
            if (refDOM && refDOM.clientHeight != 0)
                this.heightCards.push(refDOM.clientHeight);
        }
        //get height of list card then post to class parent to set new height
        let listDOM = ReactDOM.findDOMNode(this.refs["this"]);
        if (listDOM && listDOM.clientHeight != 0)
            setListHeight(listDOM.clientHeight);
        else {
            setListHeight(0);
        }
    }
    componentDidUpdate() {
        this.heightCards = [];
        const { setListHeight } = this.props;
        //push height of each card in list card into array heightCards
        for (let i = 0; i < this.props.cards.length; ++i) {
            let refDOM = ReactDOM.findDOMNode(this.refs[i]);
            if (refDOM && refDOM.clientHeight != 0) {
                this.heightCards.push(refDOM.clientHeight);
            }
        }
        //get height of list card then post to class parent to set new height
        let listDOM = ReactDOM.findDOMNode(this.refs["this"]);
        if (listDOM && listDOM.clientHeight != 0) {
            const { idClicked, listId } = this.props;
            //if list too long and user click on create card, it will be pushed to top
            const topBoard = document.getElementById("board")!.getBoundingClientRect().top;
            const body = document.body.scrollHeight;
            if (idClicked === "listcard" + listId && listDOM.clientHeight > body - topBoard - 191) {
                listDOM['style'].maxHeight = "76%";
                listDOM.scrollTop = listDOM.scrollHeight - listDOM.clientHeight;
            } else {
                listDOM['style'].maxHeight = "88%";
            }
            setListHeight(listDOM.clientHeight);
        }
        else {
            setListHeight(0);
        }
    }
}
export default flow(dropTarget, connect(mapStateToProps, mapDispatchToProps))(CardContainer)