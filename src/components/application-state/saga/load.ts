import { takeEvery, call, put, fork } from "redux-saga/effects"
import actions = require("../action")
import server = require("../../data-services/retrieve")
import { KanbanData } from "../state"
import * as $ from "./"

export function* watchLoadInitialData(offlineMode: boolean) {
    yield takeEvery(actions.ActionType.LOAD_INITIAL_DATA, function* (action: actions.LOAD_INITIAL_DATA) {
        try {
            const data: KanbanData = yield call(server.retrieveDataFromContext, action.context, action.mapping, offlineMode);
            yield put(actions.updateData(data, action.mapping));
            for (let id of data.getAllObjectsId()) {
                yield fork($.subscribeObject, id, offlineMode);
            }
            // for (let entity of data.getAllEntities()) {
            //     yield fork($.subscribeEntity, entity);
            // }
        } catch (e) {
            console.log(e);
        }
    })
}