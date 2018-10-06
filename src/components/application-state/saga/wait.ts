import { select } from "redux-saga/effects"
import { AppState, KanbanData } from "../state"
import { delay } from "redux-saga"


export function* waitForCreating(tempId: string) {
    let data: KanbanData = yield select((state: AppState) => state.data);
    if (data.getObjectById(tempId)) return tempId;
    var finished = false;
    while (!finished) {
        let creatingIds: Map<string, string> = yield select((state: AppState) => state.creatingIds);
        let id = creatingIds.get(tempId);
        if (id === undefined) throw "Invalid Id";
        if (id !== "") {
            finished = true;
        } else {
            yield delay(0.1);
        }
    }
}

export function* waitForPending(id: string) {
    let finished = false
    while (!finished) {
        let pendingIds = yield select((state: AppState) => state.pendingIds);
        if (!pendingIds.has(id)) {
            finished = true
        } else {
            yield delay(0.1);
        }
    }
}