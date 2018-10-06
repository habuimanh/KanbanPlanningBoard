import { ActionType, ACTION } from "./"

export interface REMOVE_OBJECT extends ACTION {
    guid: string,
}

export const removeObjectView = (guid: string) => ({
    type: ActionType.REMOVE_OBJECT_VIEW,
    guid
} as REMOVE_OBJECT)

export const removeObject = (guid: string) => ({
    type: ActionType.REMOVE_OBJECT,
    guid
})