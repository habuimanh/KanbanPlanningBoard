import * as store from "./../interfaces"
import * as I from "../../interface"
import serverActions = require('../../application-state/action')

const reducer = (state: store.IViewState = {
    lists: [],
    dispatch: () => void 0,
    mapping: Object.create(Map),
    nameNewCard: "",
    nameNewList: "",
    idClicked: "",
    accounts: [],
    setting: I.defaultSetting,
    viewOnProgress: false,
    dragIndexToCommit: -1,
    idListToCommit: "",
    isDraggingList: false
},
    action: store.IAction | store.IMoveList | store.IChangeListName) => {
    switch (action.type) {
        case store.Action.UpdateData: {
            let updateDataAction = action as store.IUpdateData;
            return {
                ...state,
                // if server doesn't configure "setting", skip updating setting
                setting: (!updateDataAction.data.setting.openLabels && !updateDataAction.data.setting.readonly
                    && state.setting) ? state.setting : updateDataAction.data.setting,
                accounts: updateDataAction.data.accounts,
                lists: updateDataAction.data.lists,
                dispatch: updateDataAction.dispatch,
                mapping: updateDataAction.mapping
            } as store.IViewState
        }
        case store.Action.AddList: {
            const { newName } = action as store.IAddList;
            let newList: I.IList = {
                createdTime: Date.now(),
                order: 0,
                id: "",
                cards: [],
                name: newName,
                state: I.WorkState.To_do
            }
            state.lists.push(newList)
            let attributes = {}
            attributes[state.mapping.listName] = newList.name
            state.dispatch(serverActions.createObjectAction(
                state.mapping.mxObject!.getGuid(),
                state.mapping.list,
                state.mapping.listBoardAssociation,
                newList.name, attributes))
            state.nameNewList = "";
            return {
                ...state
            }
        }
        case store.Action.MoveList: {
            const moveList = action as store.IMoveList;
            const { dropIndex, dragIndex, commitToServer } = moveList;
            if (commitToServer) {
                state.dispatch(serverActions.moveObjectAction(
                    state.idListToCommit,
                    dropIndex > state.dragIndexToCommit ? dropIndex + 1 : dropIndex,
                    state.mapping.mxObject!.getGuid(),
                    state.mapping.listBoardAssociation
                ))
                state.isDraggingList = false;
            }
            else if (!state.isDraggingList) {
                state.isDraggingList = true;
                state.dragIndexToCommit = dragIndex;
                state.idListToCommit = state.lists[dragIndex].id;
            }
            state.lists.splice(dropIndex, 0, state.lists.splice(dragIndex, 1)[0]);
            return {
                ...state
            }
        }
        case store.Action.MoveCard: {
            const moveCard = action as store.IMoveCard;
            const { dropCardIndex, dropListIndex, dragCardIndex, dragListIndex } = moveCard;
            state.dispatch(serverActions.moveObjectAction(
                state.lists[dragListIndex].cards[dragCardIndex].id,
                (dropListIndex === dragListIndex && dropCardIndex > dragCardIndex) ? dropCardIndex + 1 : dropCardIndex,
                state.lists[dropListIndex].id,
                state.mapping.cardListAssociation
            ))
            if (dragListIndex === dropListIndex) {
                state.lists[dragListIndex].cards.splice(dropCardIndex, 0, state.lists[dragListIndex].cards.splice(dragCardIndex, 1)[0]);
            } else {
                // move element to new place
                state.lists[dropListIndex].cards.splice(dropCardIndex, 0, state.lists[dragListIndex].cards[dragCardIndex]);
                // delete element from old place
                state.lists[dragListIndex].cards.splice(dragCardIndex, 1);
            }
            return {
                ...state
            }
        }
        case store.Action.ChangeNameNewCard: {
            const changeNameNewCard = action as store.IChangeNameNewCard;
            state.nameNewCard = changeNameNewCard.newName;
            return { ...state };
        }
        case store.Action.SaveNewCard: {
            const saveNewCard = action as store.ISaveNewCard;
            let { listIndex, newNameCard } = saveNewCard;
            let first = 0, last = newNameCard.length;
            while (newNameCard[first] === " ") first++;
            while (newNameCard[last] === " ") last--;
            newNameCard = newNameCard.slice(first, last);
            if (first != last) {
                let idNewCard = 0;
                state.lists.forEach((list) => {
                    idNewCard += list.cards.length;
                })
                let attributes = {}
                attributes[state.mapping.cardName] = newNameCard;
                const newCard: I.ICard = {
                    name: newNameCard,
                    id: idNewCard.toString(),
                    attachments: [],
                    comments: [],
                    createdTime: Date.now(),
                    description: "",
                    labels: [],
                    members: [],
                    order: 0,
                    subscribers: [],
                    workLists: []
                };
                if (state.viewOnProgress) {
                    switch (listIndex) {
                        case 0: {
                            newCard.state = I.WorkState.To_do;
                            break;
                        } case 1: {
                            newCard.state = I.WorkState.In_Progress;
                            break
                        } case 2: {
                            newCard.state = I.WorkState.Done;
                        }
                    }
                }
                state.lists[listIndex] = {
                    ...state.lists[listIndex],
                    cards: state.lists[listIndex].cards.concat(newCard),
                };
                state.nameNewCard = "";
                state.dispatch(serverActions.createObjectAction(
                    state.lists[listIndex].id,
                    state.mapping.card,
                    state.mapping.cardListAssociation,
                    idNewCard.toString(), attributes
                ))
            }
            return {
                ...state
            }
        }
        case store.Action.ChangeListName: {
            const changeListName = action as store.IChangeListName;
            state.lists[changeListName.indexList].name = changeListName.newName;
            state.dispatch(serverActions.updateAttribute(state.lists[changeListName.indexList].id, state.mapping.listName, changeListName.newName))
            return {
                ...state
            }
        }
        case store.Action.OnClick: {
            const onClick = action as store.IOnClick;
            state.idClicked = onClick.idClicked;
            return {
                ...state
            }
        }
        case store.Action.ShowPopUp: {
            const showPopUp = action as store.IShowPopUp;
            state.idClicked = showPopUp.idPopUp;
            state.dispatch(serverActions.openForm(showPopUp.idPopUp));
            state.idClicked = "";
            return {
                ...state
            }
        }
        case store.Action.DeleteList: {
            const deleteList = action as store.IDeleteList;
            state.dispatch(serverActions.removeObjectView(state.lists[deleteList.listIndex].id));
            state.lists.splice(deleteList.listIndex, 1);
            return {
                ...state
            }
        }
        case store.Action.DeleteCard: {
            const deleteCard = action as store.IDeleteCard;
            let { listIndex, cardIndex } = deleteCard;
            state.dispatch(serverActions.removeObjectView(state.lists[listIndex].cards[cardIndex].id))
            state.lists[listIndex].cards.splice(cardIndex, 1);
            return { ...state };
        }
        case store.Action.RemoveOrAddMember: {
            const removeMember = action as store.IRemoveOrAddMember;
            let { listIndex, cardIndex, memberId } = removeMember;
            let card = state.lists[listIndex].cards[cardIndex];
            let account = state.accounts.find(account => account.id === memberId);
            if (!account) return state;
            let memberIndex = card.members.findIndex(member => member.id === memberId);
            if (memberIndex === -1) {
                card.members.push(account);
                state.dispatch(serverActions.addObjectAction(memberId, card.id, state.mapping.memberCardAssociation))
            } else {
                card.members = card.members.filter(member => member.id !== memberId);
                state.dispatch(serverActions.excludeObject(memberId, card.id, state.mapping.memberCardAssociation));
            }

            return {
                ...state
            }
        }
        case store.Action.ChangeCardName: {
            const changeCardName = action as store.IChangeCardName;
            let { listIndex, cardIndex, newName } = changeCardName;
            let list = JSON.parse(JSON.stringify(state.lists[listIndex]));
            list.cards[cardIndex].name = newName;
            state.lists[listIndex] = list;
            state.dispatch(serverActions.updateAttribute(state.lists[listIndex].cards[cardIndex].id, state.mapping.cardName, newName));
            return { ...state };
        }
        case store.Action.ChangeLabelsDisplay: {
            const setting = Object.assign({}, state.setting);
            setting.openLabels = !setting.openLabels;
            state.setting = setting;
            !state.setting.readonly &&
                state.dispatch(serverActions.updateAttribute(setting.id, state.mapping.boardOpenLabels, setting.openLabels))
            return {
                ...state
            };
        }
        case store.Action.ChangeNameNewList: {
            const changeNameNewList = action as store.IChangeListName;
            state.nameNewList = changeNameNewList.newName;
            return { ...state };
        }
        default:
            return state
    }
}
export default reducer