export interface ISetttingMapping {
    openLabels: string,
}

export interface IItemMapping {
    order: string,
    createdTime: string,
}
export interface IBoardMapping {
    openLabels: string,
    readonly: string,
    name: string,
}
export interface IListMapping {
    name: string,
    state: string,
    order: string,
    createdTime: string,
}
export interface ICardMapping {
    createdTime: string,
    name: string,
    description: string,
    dueDate: string,
    progressRate: string,
    startDate: string,
    order: string,
    state: string
}
export interface ICommentMapping {
    text: string
}
export interface IAttachmentMapping {
    text: string,
    attachmentType: string,
    fileId: string,
}

export interface ILabelMapping {
    name: string,
    image: string,
    color: string,
}
export interface IWorkListMapping {
    name: string,
    progressRate: string,
}
export interface IWorkMapping {
    name: string,
    state: string,
}
export interface IAccountMapping {
    fullName: string,
}
