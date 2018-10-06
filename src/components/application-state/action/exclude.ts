import { ActionType, ACTION } from "./"

export interface EXCLUDE_OBJECT extends ACTION {
    guid: string,
    containerId: string,
    association: string,
}

export const excludeObject = (guid: string, containerId: string, association: string) => ({
    type: ActionType.EXCLUDE_OBJECT,
    guid,
    containerId,
    association
} as EXCLUDE_OBJECT)