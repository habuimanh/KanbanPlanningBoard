import { ActionType, ACTION } from "./"

export interface OPEN_FORM extends ACTION {
    id: string,
}

export const openForm = (id: string) => ({
    type: ActionType.OPEN_FORM,
    id,
} as OPEN_FORM)