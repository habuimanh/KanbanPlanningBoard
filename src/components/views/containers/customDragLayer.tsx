/// <reference path="./../../../../typings/index.d.ts" />
import * as React from "react";
import flow = require('lodash.flow');
import { DragLayer } from 'react-dnd';
import * as I from "./../interfaces";
import * as $ from "./cardSubComponents";
import { KanbanView } from "../../interface";
const styles = {
    display: 'inline-block',
    transform: 'rotate(4deg)',
    WebkitTransform: 'rotate(4deg)',
    width: '',
    height: ''
};
const Card = (props: { card: I.ICardSource }) => {
    const { card, cardIndex, listIndex, clientHeight, clientWidth } = props.card;
    styles.width = `${clientWidth}px`;
    styles.height = `${clientHeight}px`;
    return (
        <div style={styles}>
            <div className="card created-card dragging" style={{ height: "100%", width: "100%" }}>
                <$.CardImage attachments={card.attachments} />
                <div className="card-edit">
                    <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                </div>
                <div className="card-details">
                    <$.CardLabel labels={card.labels} />
                    <$.CardTitle title={card.name} />
                    <$.CardBadges>
                        {/* <$.SubscribeBadge isSubscribed={true} /> */}
                        <$.DueDateBadge dueDate={card.dueDate} />
                        <$.DescriptionBadge hasDescription={!!card.description} />
                        <$.CommentBadge number={card.comments.length} />
                        <$.AttachmentBadge number={card.attachments.length} />
                        <$.WorkListBadge progressRate={KanbanView.getCardProgressRate(card)} />
                    </$.CardBadges >
                    <$.CardMemberList members={card.members} listIndex={listIndex} cardIndex={cardIndex} />
                </div>
            </div >
        </div>
    );
}
const List = (props: { list: I.IListSource }) => {
    const { list } = props;
    styles.width = `${props.list.clientWidth}px`;
    styles.height = `${props.list.clientHeight}px`;
    return (
        <div style={styles}>
            <div className="list">
                <div style={{ height: "100%" }}>
                    <div className="list-name">
                        <textarea className="list-name-input" defaultValue={list.name}>
                        </textarea>
                    </div>
                    <div style={{ height: "100%" }}>
                        <div className="list-card-container">
                            {list.cards.map((card) =>
                                <div className="card created-card">
                                    <$.CardImage attachments={card.attachments} />
                                    <div className="card-edit">
                                        <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                                    </div>
                                    <div className="card-details">
                                        <$.CardLabel labels={card.labels} />
                                        <$.CardTitle title={card.name} />
                                        <$.CardBadges>
                                            {/* <$.SubscribeBadge isSubscribed={true} /> */}
                                            <$.DueDateBadge dueDate={card.dueDate} />
                                            <$.DescriptionBadge hasDescription={!!card.description} />
                                            <$.CommentBadge number={card.comments.length} />
                                            <$.AttachmentBadge number={card.attachments.length} />
                                            <$.WorkListBadge progressRate={KanbanView.getCardProgressRate(card)} />
                                        </$.CardBadges >
                                        <$.CardMemberList members={card.members} />
                                    </div>
                                </div >
                            )}
                        </div>
                        <div>
                            <span className="addCard">Add a card...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
function getItemStyles(props: I.ICustomDragLayer) {
    const { initialOffset, currentOffset } = props;
    if (!initialOffset || !currentOffset) {
        return {
            display: 'none'
        };
    }
    let { x, y } = currentOffset;
    const topLayout = document.getElementById("kanbanWidget")!.getBoundingClientRect().top;
    const transform = `translate(${x}px, ${y - topLayout}px)`;
    return {
        WebkitTransform: transform,
        transform
    };
}
const dragLayer = DragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
}))
class CustomDragLayer extends React.Component<I.ICustomDragLayer, {}>{
    constructor(props) {
        super(props);
    }
    renderItem(type, item) {
        switch (type) {
            case 'card':
                return (
                    <Card card={item} />
                );
            case 'list':
                return (
                    <List list={item} />
                )
            default:
                return <div hidden />;
        }
    }
    render() {
        const { item, itemType, isDragging } = this.props;
        if (!isDragging) {
            return <div hidden />;
        }
        return (
            <div style={{ position: "fixed", pointerEvents: "none", zIndex: 100000 }}>
                <div style={getItemStyles(this.props)}>
                    {this.renderItem(itemType, item)}
                </div>
            </div>
        );
    }
}
export default flow(dragLayer)(CustomDragLayer)