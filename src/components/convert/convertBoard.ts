import { IBoard } from "../interface"
import { IBoardMapping } from "../interface"
import * as $ from "./"

export function convertBoard(board: mendix.lib.MxObject, boardMapping: IBoardMapping): IBoard {
    return {
        id: board.getGuid(),
        openLabels: board.get(boardMapping.openLabels) as boolean,
        readonly: board.get(boardMapping.readonly) as boolean,
        members: [],
        lists: [],
        creator: $.AnonymousAccount
    }
}