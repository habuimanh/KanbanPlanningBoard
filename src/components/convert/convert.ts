import { KanbanData } from "../application-state/state"
import { KanbanView, ISetting } from "../interface"
import map = require("../interface/MappingInterface")
import $ = require("./")

export function convertData(data: KanbanData): KanbanView {
    let mapping = data.getPropNames();
    let boardMapping: map.IBoardMapping = {
        name: mapping.boardName,
        openLabels: mapping.boardOpenLabels,
        readonly: mapping.boardReadonly,
    }
    let listMapping: map.IListMapping = {
        createdTime: mapping.listCreatedTime,
        order: mapping.listOrder,
        name: mapping.listName,
        state: mapping.listState
    };
    let cardMapping: map.ICardMapping = {
        createdTime: mapping.cardCreatedTime,
        order: mapping.cardOrder,
        name: mapping.cardName,
        description: mapping.cardDescription,
        dueDate: mapping.cardDueDate,
        startDate: mapping.cardStartDate,
        progressRate: mapping.cardProgressRate,
        state: mapping.workState
    };
    let workListMapping: map.IWorkListMapping = {
        name: mapping.workListName,
        progressRate: mapping.workListProgressRate,
    };
    let workMapping: map.IWorkMapping = {
        name: mapping.workName,
        state: mapping.workState
    };
    let commentMapping: map.ICommentMapping = {
        text: mapping.commentText
    };
    let labelMapping: map.ILabelMapping = {
        name: mapping.labelName,
        image: "",
        color: mapping.labelColor,
    }
    let attachmentMapping: map.IAttachmentMapping = {
        text: mapping.attachmentText,
        attachmentType: mapping.attachmentType,
        fileId: mapping.attachmentFileId,
    }
    let accountMapping: map.IAccountMapping = {
        fullName: mapping.accountFullName,
    }
    if (!mapping.mxObject) {
        return new KanbanView();
    }
    try {
        let board = $.convertBoard(data.getObjectsByEntity(mapping.board)[0], boardMapping);
        let setting: ISetting = {
            id: board.id,
            openLabels: board.openLabels,
            readonly: board.readonly,
        }
        let accounts = data.getObjectsByEntity(mapping.account)
            .map(accountObject => {
                let account = $.convertAccount(accountObject, accountMapping);
                let avatars = data.getObjectsByAssociation(account.id, mapping.accountAvatarAssociation);
                account.avatarId = avatars[0] && avatars[0].get(mapping.fileId) as string;
                return account;
            });
        let lists = data.getObjectsByAssociation(board.id, mapping.listBoardAssociation)
            .map(list => $.convertList(list, listMapping))
        lists.forEach(list => {
            list.cards = data.getObjectsByAssociation(list.id, mapping.cardListAssociation)
                .map(cardObject => {
                    let card = $.convertCard(cardObject, cardMapping);
                    card.comments = data.getObjectsByAssociation(card.id, mapping.commentCardAssociation)
                        .map(commentObject => $.convertComment(commentObject, commentMapping));
                    card.workLists = data.getObjectsByAssociation(card.id, mapping.workListCardAssociation)
                        .map(workListObject => {
                            let worklist = $.convertWorkList(workListObject, workListMapping);
                            worklist.works = data.getObjectsByAssociation(worklist.id, mapping.workWorkListAssociation)
                                .map(workObject => $.convertWork(workObject, workMapping));
                            return worklist;
                        })
                    card.labels = data.getObjectsByAssociation(card.id, mapping.labelCardAssociation)
                        .map(labelObject => $.convertLabel(labelObject, labelMapping));
                    card.attachments = data.getObjectsByAssociation(card.id, mapping.attachmentCardAssociation)
                        .map(attachmentObject => {
                            let attachment = $.convertAttachment(attachmentObject, attachmentMapping)
                            return attachment;
                        })
                    card.members = data.getObjectsByAssociation(card.id, mapping.memberCardAssociation)
                        .map(memberObject => {
                            let member = $.convertAccount(memberObject, accountMapping);
                            let avatars = data.getObjectsByAssociation(member.id, mapping.accountAvatarAssociation);
                            member.avatarId = avatars[0] && avatars[0].get(mapping.fileId) as string;
                            return member;
                        })
                    return card;
                })
        })
        return new KanbanView(lists, accounts, setting);
    } catch (e) {
        console.log(e);
        return new KanbanView();
    }
}