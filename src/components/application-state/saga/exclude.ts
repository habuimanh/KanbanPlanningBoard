import { takeEvery, select } from "redux-saga/effects"
import actions = require("../action")
import { KanbanData, AppState } from "../state"
import * as $ from "./"


export function* watchExcludeObject() {
    yield takeEvery(actions.ActionType.EXCLUDE_OBJECT, function* (action: actions.EXCLUDE_OBJECT) {
        try {
            const data: KanbanData = yield select((state: AppState) => state.data);
            let id = yield $.waitForCreating(action.guid);
            let containerId = yield $.waitForCreating(action.containerId);
            let object = data.getObjectById(id)!;
            object.removeReferences(action.association.split("/")[0], containerId);
            data.removeAssociation(containerId, id, action.association.split("/")[0])
            yield $.commit(id);
            if (data.isReferenceSetAssociation(action.association)) {
                let container = data.getObjectById(containerId)!;
                container.removeReferences(action.association.split("/")[0], id);
                yield $.commit(containerId);
            }
        } catch (e) {
            console.log(e);
        }
    })
}