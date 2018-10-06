/// <reference path="./../../../../typings/index.d.ts" />
import * as React from "react";
import ReactDOM = require("react-dom")
import flow = require('lodash.flow');
import { DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import * as I from "./../interfaces";
import * as $ from "./cardSubComponents";
import { cardSource } from "./utils";
import { KanbanView } from "../../interface";
import { CardQuickEditor } from "./cardQuickEditor";
import CardLabel from "./cardSubComponents/cardLabel"

const dragSource = DragSource('card', cardSource, (connectDragSource, monitor) => ({
    connectDragSource: connectDragSource.dragSource(),
    isDragging: monitor.isDragging(),
    connectDragPreview: connectDragSource.dragPreview(),
}))
class Card extends React.Component<I.ICardProps, {}>{
    constructor(props) {
        super(props);
        this.showPopUp = this.showPopUp.bind(this);
        this.state = {
            inEditorMode: false
        }
    }

    showPopUp(event: any) {
        const { card, onClick } = this.props;
        onClick(card.id);
        event.stopPropagation();
    }

    componentDidMount() {
        const { connectDragPreview } = this.props;
        connectDragPreview(getEmptyImage(), {
            captureDraggingState: true
        })
    }

    onEdit(e?: MouseEvent) {
        e && e.stopPropagation();
        let cardInfo = {
            top: this.cardDiv.getBoundingClientRect().top,
            left: this.cardDiv.getBoundingClientRect().left,
            card: this.props.card,
            width: this.cardDiv.getBoundingClientRect().width,
            listIndex: this.props.listIndex,
            cardIndex: this.props.cardIndex,
        };
        ReactDOM.render(<CardQuickEditor
            allowRemoveCard={this.props.allowRemoveCard}
            cardInfo={cardInfo}
            openForm={this.props.onClick}
            removeOrAddMember={this.props.removeOrAddMember}
            accounts={this.props.accounts}
            deleteCard={this.props.deleteCard}
            changeCardName={this.props.changeCardName}
            showPopup={this.props.showPopup} />,
            document.getElementById("cardQuickEditor") as HTMLElement);
    }

    cardDiv: HTMLDivElement;

    render() {
        const { isDragging, connectDragSource, card, readonly, listIndex, cardIndex, openLabels } = this.props;
        const { showPopUp } = this;
        const display = isDragging ? 0.5 : 1;
        if (!card) return <span />
        return connectDragSource(
            <div className="card created-card" id={card.id} style={{ display }} onClick={readonly ? undefined : showPopUp}
                ref={div => this.cardDiv = div}>
                <$.CardImage attachments={card.attachments} />
                {!readonly && <$.CardEdit onEdit={this.onEdit.bind(this)} />}
                <div className="card-details">
                    <CardLabel labels={card.labels} open={openLabels} changeLabelsDisplay={this.props.changeLabelsDisplay} />
                    <$.CardTitle title={card.name} />
                    <$.CardBadges>
                        {/* <$.SubscribeBadge isSubscribed={true} /> */}
                        <$.DueDateBadge dueDate={card.dueDate} />
                        <$.DescriptionBadge hasDescription={!!card.description} />
                        <$.CommentBadge number={card.comments.length} />
                        <$.AttachmentBadge number={card.attachments.length} />
                        <$.WorkListBadge progressRate={KanbanView.getCardProgressRate(card)} />
                    </$.CardBadges >
                    <$.CardMemberList members={card.members} listIndex={listIndex} cardIndex={cardIndex} readonly={readonly} />
                </div>

            </div >
        );
    }
}
export default flow(dragSource)(Card)