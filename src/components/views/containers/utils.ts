import * as ReactDOM from "react-dom";
import * as I from "./../interfaces"
export const listSource = {
    beginDrag(props: I.IListProps, monitor, component): I.IListSource {
        monitor;
        props.onClick("");
        const { clientWidth, clientHeight } = ReactDOM.findDOMNode(component);
        return {
            id: props.id,
            listIndex: props.listIndex,
            name: props.list.name,
            cards: props.list.cards,
            clientHeight: clientHeight,
            clientWidth: clientWidth
        };
    },
    canDrag(props: I.IListProps): boolean {
        return !(props.readonly || props.viewOnProgress)
    }
};
export const listTarget = {
    hover(props: I.IListProps, monitor) {
        const { id: dragId } = monitor.getItem();
        const { id: dropId } = props;
        if (dragId !== dropId) {
            props.moveList(dragId, props.listIndex, false);
        }
    },
    drop(props: I.IListProps, monitor) {
        const { id: dragId } = monitor.getItem();
        props.moveList(dragId, props.listIndex, true);
    }
};
export const cardContainerTarget = {
    drop(props: I.ICardContainerProps, monitor, component) {
        document.getElementById(monitor.getItem().id)!.style.display = 'block';
        const { placeHolderIndex } = component.state;
        const dragListIndex = monitor.getItem().listIndex;
        const dragCardIndex = monitor.getItem().cardIndex;
        const dropListIndex = props.listIndex;
        let dropCardIndex = placeHolderIndex;
        if (dragCardIndex > dropCardIndex) { // move top
            dropCardIndex += 1;
        }
        else if (dragListIndex !== dropListIndex) { // insert into another list
            dropCardIndex += 1;
        }
        if (dragListIndex === dropListIndex && dragCardIndex === dropCardIndex) { // if position equel
            return;
        }
        props.moveCard(dragListIndex, dropListIndex, dragCardIndex, dropCardIndex);
        //rerender card container to get new height
        component.render();
    },
    hover(props: I.ICardContainerProps, monitor, component) {
        const item = monitor.getItem();
        let hoverHeight = item.clientHeight;
        // defines where placeholder is rendered
        let placeHolderIndex;
        const scrollY = ReactDOM.findDOMNode(component.refs["this"]).scrollTop;
        const topLayout = document.getElementById("kanbanWidget")!.getBoundingClientRect().top;
        if (monitor.getClientOffset().y - topLayout - 35 + scrollY < component.heightCards[0] / 2) {
            placeHolderIndex = -1;
        } else {
            placeHolderIndex = 0;
            let top = component.heightCards[0];
            for (let i = 0; i < props.cards.length; ++i) {
                const height = component.heightCards[i];
                if (monitor.getClientOffset().y - topLayout - 35 + scrollY > top + height / 2 + 6) {
                    top += height + 6;
                    placeHolderIndex++;
                }
            }
        }
        //set state list target to rerender when dragging
        component.setState({ placeHolderIndex, hoverHeight });
        // when drag begins, hide the card and only display card
        document.getElementById(item.id)!.style.display = 'none';
    }
};
export const cardSource = {
    canDrag(props: I.ICardProps): boolean {
        return !(props.readonly || props.viewOnProgress)
    },
    beginDrag(props: I.ICardProps, monitor, component): I.ICardSource {
        props.onClick("");
        monitor;
        const { card, listIndex, cardIndex } = props;
        const { id, name } = card;
        const { clientWidth, clientHeight } = ReactDOM.findDOMNode(component);
        return { id, name, card, listIndex, cardIndex, clientWidth, clientHeight };
    },
    endDrag(props, monitor) {
        props;
        document.getElementById(monitor.getItem().id)!.style.display = 'block';
    },
    isDragging(props, monitor) {
        const isDragging = props.card && props.card.id === monitor.getItem().id;
        return isDragging;
    }
};