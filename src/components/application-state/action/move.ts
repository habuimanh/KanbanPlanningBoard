import { ActionType, ACTION } from "./"

export interface MOVE_OBJECT extends ACTION {
    id: string,
    newOrder: number,
    containerId: string,
    association: string
}

export const moveObjectAction = (id: string, newOrder: number, containerId: string, association: string) => ({
    type: ActionType.MOVE_OBJECT,
    id,
    newOrder,
    containerId,
    association
} as MOVE_OBJECT)