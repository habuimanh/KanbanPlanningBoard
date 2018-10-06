import { commit } from "../utils"
import * as $ from "./"

export function modifyObject(object: mendix.lib.MxObject, attributes?: { [name: string]: string | number },
    associations?: { [name: string]: string | number }) {
    let backUpAttributes = {}
    try {
        if (attributes) {
            for (let attributeName in attributes) {
                backUpAttributes[attributeName] = object["getOriginalValue"](attributeName);
                object.set(attributeName, attributes[attributeName]);
            }
        }
        if (associations)
            for (let associationName in associations) {
                backUpAttributes[associationName] = object["getOriginalValue"](associationName);
                object.addReference(associationName, associations[associationName]);
            }
        return new Promise((resolve, reject) => {
            commit(object)
                .then(() => resolve())
                .catch((e) => {
                    for (let attribute in backUpAttributes) {
                        object.set(attribute, backUpAttributes[attribute]);
                    }
                    $.update(object.getGuid());
                    reject(e);
                })
        })

    } catch (e) {
        console.log(e);
    }
}