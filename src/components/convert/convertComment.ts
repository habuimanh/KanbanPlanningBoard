import { IComment } from "../interface"
import { ICommentMapping } from "../interface"
import * as $ from "./"

export function convertComment(comment: mendix.lib.MxObject, commentMapping: ICommentMapping): IComment {
    return {
        id: comment.getGuid(),
        text: commentMapping.text && comment.get(commentMapping.text) as string,
        tagAccounts: [],
        owner: $.AnonymousAccount,
        attachments: []
    }
}