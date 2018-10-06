import { takeEvery, fork, call, select } from "redux-saga/effects"
import actions = require("../action")
import { KanbanData, AppState } from "../state"
import server = require("../../data-services")
import * as $ from "./"

export function* watchCreateObject(offlineMode: boolean) {
    yield takeEvery(actions.ActionType.CREATE_OBJECT, function* (action: actions.CREATE_OBJECT) {
        try {
            // create new object and subcribe
            const data: KanbanData = yield select((state: AppState) => state.data);
            const creatingIds: Map<string | number, string> = yield select((state: AppState) => state.creatingIds);
            creatingIds.set(action.tempId, "");
            const newObject: mendix.lib.MxObject = yield call(server.createEmptyObject, action.entity);
            data.updateObject(newObject);
            creatingIds.set(action.tempId, newObject.getGuid());
            yield fork($.subscribeObject, newObject.getGuid(), offlineMode);

            // modify attributes
            let containerId = yield* $.waitForCreating(action.containerId);
            let attributes = { ...action.attributes };
            attributes[data.getOrderProp(newObject.getEntity())] = data.calculateNewOrder(containerId, action.association);
            let associations = data.calculateNewAssociation(containerId, action.association);

            // commit to server
            yield* $.commit(newObject.getGuid(), attributes, associations);
        } catch (e) {
            console.log(e);
        }
    })
}
