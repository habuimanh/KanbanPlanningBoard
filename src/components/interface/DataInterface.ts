// import { TodoListMapping } from "./AppStateInterface"

export const defaultSetting: ISetting = {
    openLabels: false,
    readonly: false,
    id: "default"
}

export class KanbanView {
    constructor(public lists: IList[] = [], public accounts: IAccount[] = [], public setting: ISetting = defaultSetting) { }
    static getCardProgressRate(card: ICard): IProgressRate {
        let totalWorks = 0;
        let doneWorks = 0;
        card.workLists.forEach(workList => {
            doneWorks += parseInt(workList.progressRate.split("/")[0]);
            totalWorks += parseInt(workList.progressRate.split("/")[1]);
        });
        return {
            doneWorks,
            totalWorks
        }
    }

    // static getCardBackgroundId(card: ICard): string {
    //     let backgroundId = "";
    //     // the last attachment of type "Image" is background of the card
    //     card.attachments.forEach(attachment => {
    //         if (attachment.attachmentType === AttachmentType.Image) {
    //             backgroundId = attachment.fileId;
    //         }
    //     })
    //     return backgroundId;
    // }
}

export interface IProgressRate {
    totalWorks: number;
    doneWorks: number;
}

export enum WorkState {
    In_Progress,
    To_do,
    Done
}
// export enum AttachmentType {
//     Image = "Image",
//     File = "File",
//     Computer = "Computer",
//     GoogleDrive = "GoogleDrive",
//     Dropbox = "Dropbox",
//     Box = "Box",
//     OneDrive = "OneDrive",
//     Link = "Link"
// }
export enum Color {
    Green = "Green",
    Blue = "Blue",
    Yellow = "Yellow",
    Orange = "Orange",
    Red = "Red",
    Violet = "Violet",
    Grey = "Grey",
    Black = "Black"
}
export interface IItem {
    id: string,
    order: number,
    createdTime?: number,
}
export interface IBoard {
    id: string,
    name?: string,
    lists: IList[],
    members: IAccount[],
    creator: IAccount,
    openLabels: boolean,
    readonly: boolean,
}
export interface IList extends IItem {
    name: string,
    state?: WorkState,
    cards: ICard[]
}
export interface ICard extends IItem {
    state?: WorkState,
    members: IAccount[],
    subscribers: IAccount[],
    name: string,
    description: string,
    dueDate?: number,
    startDate?: number,
    workLists: IWorkList[],
    comments: IComment[],
    attachments: IAttachment[],
    labels: ILabel[]
}
export interface IComment {
    id: string,
    tagAccounts: IAccount[],
    owner: IAccount,
    cards?: ICard[],
    text: string
    attachments: IAttachment[],
}
export interface IAttachment {
    id: string,
    text: string,
    fileId: string
}
export interface ILabel {
    id: string,
    cards?: ICard[],
    name: string,
    color: Color
}
export interface IWorkList {
    id: string,
    name: string,
    progressRate: string,
    works: IWork[],
}
export interface IWork {
    id: string,
    name: string,
    state: WorkState
}
export interface IAccount {
    id: string,
    fullName: string,
    cards?: ICard[],
    boards?: IBoard[],
    comment?: IComment[],
    avatarId: string,
}

export interface IImage {
    id: string,
    path: string
}

export interface ISetting {
    id: string,
    openLabels: boolean,
    readonly: boolean,
}