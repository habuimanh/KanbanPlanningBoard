import createSagaMiddleware from "redux-saga"
import { all } from "redux-saga/effects"
import { createStore, applyMiddleware } from "redux"
import { rootReducer } from "../reducer"
import * as $ from "./"


export function newStore(offlineMode: boolean) {
    const sagaMiddleware = createSagaMiddleware();
    let store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
    offlineMode ? sagaMiddleware.run(rootSagaOfflineMode) : sagaMiddleware.run(rootSaga);
    return store;
}


function* rootSagaOfflineMode() {
    yield all([
        $.watchAddObject(),
        $.watchLoadInitialData(true),
        $.watchMoveCard(),
        $.watchCreateObject(true),
        $.watchUpdateAttribute(),
        $.watchUnmount(),
        $.watchRemoveObject(),
        $.watchOpenForm(),
        $.watchExcludeObject()
    ])
}
function* rootSaga() {
    yield all([
        $.watchAddObject(),
        $.watchLoadInitialData(false),
        $.watchMoveCard(),
        $.watchCreateObject(false),
        $.watchUpdateAttribute(),
        $.watchUnmount(),
        $.watchRemoveObject(),
        $.watchOpenForm(),
        $.watchExcludeObject()
    ])
}
