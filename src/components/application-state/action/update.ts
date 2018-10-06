import { ActionType, ACTION } from "./"
import { KanbanData } from "../state"
import { WidgetConfigProperty } from "../../interface"

export interface UPDATE_OBJECT extends ACTION {
    object: mendix.lib.MxObject | mendix.lib.MxObject[];
}

export interface UPDATE_DATA extends ACTION {
    data: KanbanData,
    mapping: WidgetConfigProperty
}

export interface UPDATE_ATTRIBUTE extends ACTION {
    guid: string,
    attributeName: string,
    value: string | number
}

export const updateData = (data: KanbanData, mapping: WidgetConfigProperty) => ({
    type: ActionType.UPDATE_DATA,
    data,
    mapping
} as UPDATE_DATA)

export const updateObject = (object: mendix.lib.MxObject | mendix.lib.MxObject[]) => ({
    type: ActionType.UPDATE_OBJECT,
    object
} as UPDATE_OBJECT)

export const updateAttribute = (guid: string, attributeName: string, value: string | number | boolean) => ({
    type: ActionType.UPDATE_ATTRIBUTE,
    guid,
    attributeName,
    value
})