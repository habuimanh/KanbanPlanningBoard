import { ICard } from "../../interface"
export interface IListSource {
    id: string,
    listIndex: number,
    name: string,
    cards: ICard[],
    clientHeight: number,
    clientWidth: number
}
export interface ICardSource {
    id: string,
    name: string,
    card: ICard,
    listIndex: number,
    cardIndex: number,
    clientWidth: number,
    clientHeight: number
}
export interface ICustomDragLayer {
    item: IListSource | ICardSource,
    itemType: string,
    initialOffset: __ReactDnd.ClientOffset,
    currentOffset: __ReactDnd.ClientOffset,
    isDragging: boolean
}