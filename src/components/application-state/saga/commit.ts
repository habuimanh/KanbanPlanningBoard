import { AppState, KanbanData } from "../state"
import { select, call } from "redux-saga/effects"
import server = require("../../data-services")
import * as $ from "./"

export function* commit(guid: string, attributes?: {}, associations?: {}) {
    let pendingIds: Set<string> = yield select((state: AppState) => state.pendingIds);
    let data: KanbanData = yield select((state: AppState) => state.data);
    let object = data.getObjectById(guid);
    if (!object) throw "Invalid Id";
    yield $.waitForPending(guid);
    pendingIds.add(guid);
    yield call(server.modifyObject, object, attributes, associations);
    pendingIds.delete(guid);
}