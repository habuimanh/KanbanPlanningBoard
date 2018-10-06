import { KanbanView, WidgetConfigProperty } from "../../interface"

export enum Action {
    AddList,
    MoveList,
    ChangeListName,
    MoveCard,
    SaveNewCard,
    UpdateData,
    ChangeNameNewCard,
    ChangeCardName,
    OnClick,
    ShowPopUp,
    StartEditCard,
    DeleteList,
    DeleteCard,
    RemoveOrAddMember,
    ChangeLabelsDisplay,
    ChangeNameNewList,
    SaveNewList
};
export interface IAction {
    type: Action
};
export interface IAddList {
    type: Action.AddList,
    newName: string
}
export interface IDeleteCard extends IAction {
    listIndex: number;
    cardIndex: number;
}
export interface IUpdateData extends IAction {
    data: KanbanView
    dispatch: (action) => void,
    mapping: WidgetConfigProperty
}
export interface IDeleteList extends IAction {
    listIndex: number
}
export interface IMoveList extends IAction {
    dragIndex: number,
    dropIndex: number,
    commitToServer: boolean
};
export interface IChangeListName extends IAction {
    newName: string,
    indexList: number
};
export interface IMoveCard extends IAction {
    dragListIndex: number,
    dragCardIndex: number,
    dropListIndex: number,
    dropCardIndex: number
};
export interface ISaveNewCard extends IAction {
    listIndex: number,
    newNameCard: string
};
export interface IChangeNameNewCard extends IAction {
    newName: string
}
export interface IOnClick extends IAction {
    idClicked: string
}
export interface IShowPopUp extends IAction {
    idPopUp: string
}

export interface IRemoveOrAddMember extends IAction {
    listIndex: number,
    cardIndex: number,
    memberId: string,
}

export interface IChangeCardName extends IAction {
    listIndex: number;
    cardIndex: number;
    newName: string;
}

export interface IChangeLabelsDisplay extends IAction { }
export interface IChangeNameNewList extends IAction {
    newName: string
}