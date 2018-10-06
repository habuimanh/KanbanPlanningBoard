import { takeLatest } from "redux-saga/effects"
import actions = require("../action")
import * as $ from "./"

export function* watchUpdateAttribute() {
    yield takeLatest(actions.ActionType.UPDATE_ATTRIBUTE, function* (action: actions.UPDATE_ATTRIBUTE) {
        try {
            let attributes = {};
            attributes[action.attributeName] = action.value;
            yield $.commit(action.guid, attributes, undefined);
        } catch (e) {
            console.log(e);
        }
    })
}

