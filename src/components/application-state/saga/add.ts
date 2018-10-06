import { takeEvery, select } from "redux-saga/effects"
import actions = require("../action")
import { KanbanData, AppState } from "../state"
import * as $ from "./"


export function* watchAddObject() {
    yield takeEvery(actions.ActionType.ADD_OBJECT, function* (action: actions.ADD_OBJECT) {
        try {
            const data: KanbanData = yield select((state: AppState) => state.data);
            let id = yield $.waitForCreating(action.id);
            let containerId = yield $.waitForCreating(action.containerId);
            let object = data.getObjectById(id)!;
            object.addReference(action.association.split("/")[0], containerId);
            yield $.commit(id);

            if (data.isReferenceSetAssociation(action.association)) {
                let container = data.getObjectById(containerId)!;
                container.addReference(action.association.split("/")[0], id);
                yield $.commit(containerId)
            }
        } catch (e) {
            console.log(e);
        }
    })
}