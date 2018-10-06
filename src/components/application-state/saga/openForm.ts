import { takeLatest, select, call } from "redux-saga/effects"
import actions = require("../action")
import server = require("../../data-services")
import { KanbanData, AppState } from "../state"
import * as $ from "./"

const getData = (state: AppState) => state.data;

export function* watchOpenForm() {
    yield takeLatest(actions.ActionType.OPEN_FORM, function* (action: actions.OPEN_FORM) {
        try {
            const data: KanbanData = yield select(getData);
            let id = yield* $.waitForCreating(action.id)
            // id = $.waitForPending(action.id)
            let object = data.getObjectById(id)
            if (!object) throw "Invalid Id"
            let formPath = data.getFormByEntity(object.getEntity())
            yield call(server.openForm, formPath, object);
        } catch (e) {
            console.log(e);
        }
    })
}

