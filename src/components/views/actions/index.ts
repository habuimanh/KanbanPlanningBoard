import * as I from "./../interfaces"
import { KanbanView, WidgetConfigProperty } from "../../interface"
export function addList(newName: string): I.IAddList {
    return {
        type: I.Action.AddList,
        newName: newName
    }
}
export function moveList(dragIndex: number, dropIndex: number, commitToServer: boolean): I.IMoveList {
    return {
        type: I.Action.MoveList,
        dropIndex: dropIndex,
        dragIndex: dragIndex,
        commitToServer: commitToServer
    }
}
export function updateData(data: KanbanView, dispatch: (action) => void, mapping: WidgetConfigProperty): I.IUpdateData {
    return {
        type: I.Action.UpdateData,
        data,
        dispatch,
        mapping
    }
}
export function moveCard(dragListIndex: number, dropListIndex: number, dragCardIndex: number, dropCardIndex: number): I.IMoveCard {
    return {
        type: I.Action.MoveCard,
        dropCardIndex: dropCardIndex,
        dropListIndex: dropListIndex,
        dragCardIndex: dragCardIndex,
        dragListIndex: dragListIndex
    }
}
export function changeListName(newName: string, indexList: number): I.IChangeListName {
    return {
        type: I.Action.ChangeListName,
        newName: newName,
        indexList: indexList
    }
}
export function saveNewCard(listIndex: number, newNameCard: string): I.ISaveNewCard {
    return {
        type: I.Action.SaveNewCard,
        newNameCard: newNameCard,
        listIndex: listIndex
    }
}
export function changeNameNewCard(newName: string): I.IChangeNameNewCard {
    return {
        type: I.Action.ChangeNameNewCard,
        newName: newName
    }
}
export function onClick(idClicked: string): I.IOnClick {
    return {
        type: I.Action.OnClick,
        idClicked: idClicked
    }
}
export function showPopUp(idPopUp: string): I.IShowPopUp {
    return {
        type: I.Action.ShowPopUp,
        idPopUp: idPopUp
    }
}
export function deleteList(listIndex: number): I.IDeleteList {
    return {
        type: I.Action.DeleteList,
        listIndex: listIndex
    }
}
export function deleteCard(listIndex: number, cardIndex: number): I.IDeleteCard {
    return {
        type: I.Action.DeleteCard,
        listIndex,
        cardIndex
    }
}

export function removeOrAddMember(listIndex: number, cardIndex: number, memberId: string): I.IRemoveOrAddMember {
    return {
        type: I.Action.RemoveOrAddMember,
        listIndex,
        cardIndex,
        memberId
    }
}

export function changeCardName(listIndex: number, cardIndex: number, newName: string): I.IChangeCardName {
    return {
        type: I.Action.ChangeCardName,
        listIndex,
        cardIndex,
        newName
    }
}

export function changeLabelsDisplay(): I.IChangeLabelsDisplay {
    return {
        type: I.Action.ChangeLabelsDisplay,
    }
}
export function changeNameNewList(newName: string): I.IChangeNameNewList {
    return {
        newName: newName,
        type: I.Action.ChangeNameNewList
    }
}