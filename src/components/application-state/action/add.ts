import { ActionType, ACTION } from "./"

export interface ADD_OBJECT extends ACTION {
    id: string,
    containerId: string,
    association: string,
}

export const addObjectAction = (containerId: string | number, id: string, association: string) => ({
    type: ActionType.ADD_OBJECT,
    id,
    containerId,
    association
} as ADD_OBJECT)