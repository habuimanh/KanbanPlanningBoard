import { KanbanData, IReferenceAssociation } from "../application-state/state"
import { getDataByAssociations, getDataByEntity, getDataByAttributeOffline, getDataByEntityOffline } from "../utils"
import { WidgetConfigProperty } from "../interface"

export function retrieveDataFromAssociations(object: mendix.lib.MxObject, associations: IReferenceAssociation[], offlineMode: boolean):
    Promise<mendix.lib.MxObject[]> {
    let guid = object.getGuid();
    return new Promise((resolve) => {
        Promise.all(associations.map(association => {
            if (offlineMode) return getDataByAttributeOffline(association.ownerEntity, association.name.split("/")[0], guid);
            return getDataByAssociations(association.ownerEntity, association.name, guid)
        }))
            .then(objectLists => {
                let objects: mendix.lib.MxObject[] = [];
                objectLists.forEach(objectList => {
                    if (objectList) {
                        objects = objects.concat(objectList);
                    }
                });
                resolve(objects);
            })
    })
}

export async function retrieveDataFromContext(context: mendix.lib.MxObject, widgetConfig: WidgetConfigProperty, offlineMode: boolean):
    Promise<any> {
    // make associations of all entities to board
    let listBoard = widgetConfig.listBoardAssociation;
    let cardBoard = widgetConfig.cardListAssociation && listBoard
        && widgetConfig.cardListAssociation.concat("/" + listBoard);
    let commentBoard = widgetConfig.commentCardAssociation && cardBoard
        && widgetConfig.commentCardAssociation.concat("/" + cardBoard);
    let mentionCardBoard = commentBoard && widgetConfig.mentionCardCommentAssociation
        && widgetConfig.mentionCardCommentAssociation.concat("/" + commentBoard);
    let workListBoard = widgetConfig.workListCardAssociation && cardBoard
        && widgetConfig.workListCardAssociation.concat("/" + cardBoard);
    let workBoard = widgetConfig.workWorkListAssociation && workListBoard
        && widgetConfig.workWorkListAssociation.concat("/" + workListBoard);
    let attachmentCommentBoard = widgetConfig.attachmentCommentAssociation && commentBoard
        && widgetConfig.attachmentCommentAssociation.concat("/" + commentBoard);
    let attachmentCardBoard = widgetConfig.attachmentCardAssociation && cardBoard
        && widgetConfig.attachmentCardAssociation.concat("/" + cardBoard);
    let documentCommentBoard = widgetConfig.documentAttachmentAssociation && commentBoard
        && widgetConfig.documentAttachmentAssociation.concat("/" + attachmentCommentBoard);
    let documentCardBoard = widgetConfig.documentAttachmentAssociation && attachmentCardBoard
        && widgetConfig.documentAttachmentAssociation.concat("/" + attachmentCardBoard);
    let objects = [context];
    let boardGuid = context.getGuid();
    let progressId = mx.ui.showProgress();
    return new Promise(async (resolve) => {
        if (offlineMode) {
            const getListFromBoard = async () => {
                //retrieve list from board association
                const lists = await getDataByAttributeOffline(widgetConfig.list, widgetConfig.listBoardAssociation.split("/")[0], boardGuid);
                if (lists.length > 0) objects = objects.concat(lists);
                await Promise.all(lists.map(async list => {
                    const cards = await getDataByAttributeOffline(widgetConfig.card, cardBoard.split("/")[0], list.getGuid());
                    cards.forEach(card => objects = objects.concat(card));
                    const getWorkList = async () => {
                        await Promise.all(cards.map(async card => {
                            const workLists = await getDataByAttributeOffline(widgetConfig.workList, workListBoard.split("/")[0], card.getGuid());
                            if (workLists.length > 0) objects = objects.concat(workLists);
                            workLists.map(async workList => {
                                const works = await getDataByAttributeOffline(widgetConfig.work, workBoard.split("/")[0], workList.getGuid());
                                if (works.length > 0) objects = objects.concat(works);
                            });
                        }));
                    };
                    const getComment = async () => {
                        await Promise.all(cards.map(async card => {
                            const comments = await getDataByAttributeOffline(widgetConfig.comment, commentBoard.split("/")[0], card.getGuid());
                            if (comments.length > 0) objects = objects.concat(comments);
                            await Promise.all(comments.map(async comment => {
                                const attachments = await getDataByAttributeOffline(widgetConfig.attachment, "TodoList.Attachment_Comment", comment.getGuid());
                                if (attachments.length > 0) objects = objects.concat(attachments);
                            }));
                        }));
                    };
                    const getOther = async () => {
                        await Promise.all(cards.map(async card => {
                            let listPromises: any[] = [];
                            listPromises = [
                                getDataByAttributeOffline(widgetConfig.comment, commentBoard.split("/")[0], card.getGuid()),
                                // getDataByAttributeOffline(widgetConfig.label, widgetConfig.labelCardAssociation.split("/")[0], card.getGuid()),
                                getDataByAttributeOffline(widgetConfig.attachment, widgetConfig.attachmentCardAssociation.split("/")[0], card.getGuid())
                            ];
                            listPromises = await Promise.all(listPromises);
                            listPromises.forEach(promise => {
                                if (promise.length > 0)
                                    objects = objects.concat(promise)
                            })
                        }))
                    };
                    await Promise.all([getWorkList(), getComment(), getOther()]);
                }));
            }
            const getAccount = async () => {
                const accounts = await getDataByEntityOffline(widgetConfig.account);
                if (accounts.length > 0) objects = objects.concat(accounts);
                await Promise.all(accounts.map(async account => {
                    const avatars = await getDataByAttributeOffline(widgetConfig.avatar, widgetConfig.accountAvatarAssociation.split("/")[0], account.getGuid());
                    if (avatars.length > 0) objects = objects.concat(avatars);
                }));
            }
            const listPromises = [getListFromBoard(), getAccount()];
            await Promise.all(listPromises);
            try {
                resolve(new KanbanData(objects, widgetConfig));
                mx.ui.hideProgress(progressId);
            } catch (e) {
                mx.ui.hideProgress(progressId);
                console.log(e);
            }
        }
        // load objects by xPaths
        else {
            let listPromises: Promise<(mendix.lib.MxObject[])>[] = [];
            listPromises = [
                getDataByAssociations(widgetConfig.list, listBoard, boardGuid),
                getDataByAssociations(widgetConfig.card, cardBoard, boardGuid),
                getDataByAssociations(widgetConfig.comment, commentBoard, boardGuid),
                getDataByAssociations(widgetConfig.card, mentionCardBoard, boardGuid),
                getDataByAssociations(widgetConfig.workList, workListBoard, boardGuid),
                getDataByAssociations(widgetConfig.work, workBoard, boardGuid),
                getDataByAssociations(widgetConfig.attachment, [attachmentCardBoard, attachmentCommentBoard], boardGuid),
                getDataByAssociations(widgetConfig.document, [documentCardBoard, documentCommentBoard], boardGuid),
                getDataByAssociations(widgetConfig.avatar, widgetConfig.accountAvatarAssociation, ),
                getDataByEntity(widgetConfig.label),
                getDataByEntity(widgetConfig.account),
            ];
            Promise.all(listPromises)
                .then(objectLists => {
                    try {
                        objectLists.forEach(objectList => {
                            objects = objects.concat(objectList)
                        });
                        resolve(new KanbanData(objects, widgetConfig));
                        mx.ui.hideProgress(progressId);
                    } catch (e) {
                        mx.ui.hideProgress(progressId);
                        console.log(e);
                    }
                })
        }
    })
}
