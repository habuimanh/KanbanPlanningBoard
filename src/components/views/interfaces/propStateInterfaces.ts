import { IList, ICard, IAccount, ISetting } from "../../interface";
import { WidgetConfigProperty } from "../../interface";
export interface IViewState {
    lists: IList[],
    dispatch: (action) => void,
    mapping: WidgetConfigProperty
    nameNewCard: string,
    idClicked: string,
    editingCard?: IEditingCard,
    accounts: IAccount[],
    setting: ISetting,
    nameNewList: string,
    viewOnProgress: boolean,
    isDraggingList: boolean,
    idListToCommit: string,
    dragIndexToCommit: number
}
export interface IBoardProps {
    allowAddList: boolean,
    readOnly: boolean,
    state: IViewState,
    addList: (newName: string) => void,
    onClick: (idClicked: string) => void,
    moveList: (dragIndex: number, hoverIndex: number, commitToServer: boolean) => void,
    changeNameNewList: (newName: string) => void,
}
export interface IListProps {
    allowAddCard: boolean,
    allowRemoveList: boolean,
    viewOnProgress: boolean,
    showPopUp: (idPopUp: string) => void,
    deleteList: (listIndex: number) => void,
    readonly: boolean,
    idClicked: string,
    onClick: (idClicked: string) => void,
    connectDragSource(any): any,
    connectDropTarget(any): any,
    listIndex: number,
    id: string,
    list: IList,
    moveList: (dragIndex: number, hoverIndex: number, commitToServer: boolean) => void,
    isDragging: boolean,
    changeListName: (newName: string, indexList: number) => void,
    connectDragPreview(any1: any, any2: any): any
}
export interface ICardContainerProps {
    allowRemoveCard: boolean,
    allowAddCard: boolean,
    viewOnProgress: boolean,
    accounts: IAccount[],
    removeOrAddMember: (listIndex: number, cardNumber: number, memberId: string) => void,
    deleteCard: (listIndex: number, cardIndex: number) => void,
    changeCardName: (listIndex: number, cardIndex: number, newName: string) => void,
    readonly: boolean,
    showPopUp: (idPopUp: string) => void,
    listId: string,
    onClick: (idClicked: string) => void
    changeNameNewCard: (newName: string) => void,
    idClicked: string,
    nameNewCard: string,
    saveNewCard: (listIndex: number, textarea: any) => void,
    setListHeight: (newHeight: number) => void,
    cards: ICard[],
    connectDropTarget(any): any,
    isOver: boolean,
    canDrop: boolean,
    item: any,
    moveCard: (hoverListIndex: number, dragListIndex: number, hoverCardIndex: number, dragCardIndex: number) => void,
    listIndex: number
}
export interface ICardContainerStates {
    placeHolderIndex: number,
    hoverHeight: number
}
export interface ICardProps {
    allowRemoveCard,
    viewOnProgress: boolean,
    openLabels: boolean,
    changeLabelsDisplay: () => void,
    removeOrAddMember: (listIndex: number, cardNumber: number, memberId: string) => void,
    accounts: IAccount[],
    readonly: boolean,
    onClick: (idClicked: string) => void,
    card: ICard,
    listIndex: number,
    cardIndex: number,
    isDragging: boolean,
    connectDragSource(any): any,
    connectDragPreview(any1: any, any2: any): any,
    showPopup: (idClicked: string) => void,
    deleteCard: (listIndex: number, cardIndex: number) => void,
    changeCardName: (listIndex: number, cardIndex: number, newName: string) => void,
}
export interface ICreateCardProps {
    // viewOnProgress: boolean,
    listId: string,
    idClicked: string,
    readOnly: boolean,
    cardName: string,
    onClose: (event: any) => void,
    changeNameCard: (newName: string) => void,
    saveNewCard: (newNameCard: string, event: any) => void
}
export interface IEditingCard {
    card: ICard,
    top: number,
    left: number,
    width: number,
    listIndex: number,
    cardIndex: number
}

export interface IQuickCardEditor {
    allowRemoveCard: boolean,
    removeOrAddMember: (listIndex: number, cardNumber: number, memberId: string) => void,
    accounts: IAccount[],
    cardInfo: IEditingCard,
    showPopup: (idClicked: string) => void,
    openForm: (id: string) => void,
    changeCardName: (listIndex: number, cardIndex: number, newName: string) => void,
    deleteCard: (listIndex: number, cardIndex: number) => void,
}