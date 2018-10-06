export interface ACTION {
    type: string
}

export enum ActionType {
    UNMOUNT = "Unmount",
    ADD_OBJECT = "AddObject",
    CREATE_OBJECT = "CreateObject",
    LOAD_INITIAL_DATA = "LoadTodoList",
    MOVE_OBJECT = "MoveObject",
    UPDATE_DATA = "UpdateData",
    INIT = "@@redux/INIT",
    UPDATE_OBJECT = "UpdateObject",
    UPDATE_ATTRIBUTE = "UpdateAttribute",
    REMOVE_OBJECT_VIEW = "RemoveObjectRequest",
    REMOVE_OBJECT = "RemoveObject",
    EXCLUDE_OBJECT = "ExcludeObject",
    OPEN_FORM = "OpenForm",
}

export * from "./load"
export * from "./move"
export * from "./update"
export * from "./add"
export * from "./remove"
export * from "./create"
export * from "./openForm"
export * from "./exclude"
