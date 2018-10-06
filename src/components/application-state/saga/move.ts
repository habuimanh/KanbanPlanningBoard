import { call, takeLatest, select } from "redux-saga/effects"
import actions = require("../action")
import server = require("../../data-services")
import { AppState, KanbanData } from "../state"

const getData = (state: AppState) => state.data
// const getMapping = (state: AppState) => state.mapping

export function* watchMoveCard() {
    yield takeLatest(actions.ActionType.MOVE_OBJECT, function* (action: actions.MOVE_OBJECT) {
        try {
            const data: KanbanData = yield select(getData);
            let object = data.getObjectById(action.id);
            if (!object) return;
            let attributes = {};
            attributes[data.getOrderProp(object.getEntity())] = data.calculateNewOrder(action.containerId, action.association, action.newOrder);
            let associations = data.calculateNewAssociation(action.containerId, action.association);
            yield call(server.modifyObject, object, attributes, associations);
        } catch (e) {
            console.log(e);
        }
    })
}

