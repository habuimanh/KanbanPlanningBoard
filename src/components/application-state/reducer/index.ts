import actions = require("../action")
import { KanbanData, AppState } from "../state"

export function rootReducer(state: AppState, action: actions.ACTION): AppState {
    switch (action.type) {
        case actions.ActionType.INIT: {
            return {
                unsubscribes: new Set(),
                data: new KanbanData(),
                creatingIds: new Map(),
                pendingIds: new Set()
            }
        }
        case actions.ActionType.REMOVE_OBJECT: {
            let removeAction = action as actions.REMOVE_OBJECT
            let data = state.data;
            data.removeObject(removeAction.guid)
            return Object.assign({}, state, { data: data })
        }
        case actions.ActionType.UPDATE_OBJECT: {
            let updateObjectAction = action as actions.UPDATE_OBJECT
            let data = state.data
            data.updateObject(updateObjectAction.object)
            return Object.assign({}, state, { data: data })
        }
        case actions.ActionType.UPDATE_DATA: {
            let updateDataAction = action as actions.UPDATE_DATA
            return Object.assign({}, state, {
                data: updateDataAction.data
            })
        }
    }
    return state
}