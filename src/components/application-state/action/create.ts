import { ActionType, ACTION } from "./"

export interface CREATE_OBJECT extends ACTION {
    entity: string,
    association: string,
    containerId: string,
    tempId: string | number,
    attributes: {
        [name: string]: string | number
    }
}

export const createObjectAction = (containerId: string | number, entity: string, association: string, tempId: string, attributes?: {
    [name: string]: string | number
}) => ({
    type: ActionType.CREATE_OBJECT,
    entity,
    association,
    containerId,
    tempId,
    attributes
} as CREATE_OBJECT)