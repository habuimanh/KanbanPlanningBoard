import { takeEvery, call, put } from "redux-saga/effects"
import actions = require("../action")
import server = require("../../data-services")

export function* watchRemoveObject() {
    yield takeEvery(actions.ActionType.REMOVE_OBJECT_VIEW, function* (action: actions.REMOVE_OBJECT) {
        try {
            yield call(server.removeObject, action.guid);
            yield put(actions.removeObject(action.guid));
        } catch (e) {
            console.log(e);
        }
    })
}