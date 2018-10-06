import { call, put, select, takeLatest } from "redux-saga/effects"
import actions = require("../action")
import server = require("../../utils")
import { retrieveDataFromAssociations } from "../../data-services"
import { AppState, KanbanData } from "../state"

function createSource(path: string | number, subscribe: (path: string | number, callback: (value) => void) => any) {
    let deferred;
    let callback = (value) => {
        if (deferred) {
            deferred.resolve(value);
            deferred = null;
        }
    }
    let unsubscribe = subscribe(path, callback);
    return {
        unsubscribe,
        nextSubscribe() {
            if (!deferred) {
                deferred = {};
                deferred.promise = new Promise(resolve => deferred.resolve = resolve);
            }
            return deferred.promise;
        }
    }
}

export function* subscribeObject(guid: string, offlineMode: boolean) {
    let data: KanbanData = yield select((state: AppState) => state.data);
    let source = createSource(guid, server.subscribeObject);
    let unsubscribes: Set<number> = yield select((state: AppState) => state.unsubscribes);
    unsubscribes.add(source.unsubscribe);
    let guidChanged = yield call(source.nextSubscribe);
    while (guidChanged) {
        const object: mendix.lib.MxObject = yield call(server.getDataByGuid, guidChanged);
        let associations = data.getReferenceAssociations(object);
        data.deleteReferenceAssociations(object);
        let willUpdateObjects = yield retrieveDataFromAssociations(object, associations, offlineMode);
        willUpdateObjects.push(object);
        yield put(actions.updateObject(willUpdateObjects))
        guidChanged = yield call(source.nextSubscribe);
    }
}

export function* watchUnmount() {
    yield takeLatest(actions.ActionType.UNMOUNT, function* () {
        let unsubscribes: Set<number> = yield select((state: AppState) => state.unsubscribes);
        unsubscribes.forEach(unsub => mx.data.unsubscribe(unsub));
    })
}