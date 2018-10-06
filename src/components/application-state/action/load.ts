import { ActionType, ACTION } from "./"
import { WidgetConfigProperty } from "../../interface"

export interface LOAD_INITIAL_DATA extends ACTION {
    context: mendix.lib.MxObject,
    mapping: WidgetConfigProperty
}

export const loadInitialDataAction = (context: mendix.lib.MxObject, mapping: WidgetConfigProperty) => ({
    type: ActionType.LOAD_INITIAL_DATA,
    context: context,
    mapping: mapping
} as LOAD_INITIAL_DATA)