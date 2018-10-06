import { IWorkList } from "../interface"
import { IWorkListMapping } from "../interface"

export function convertWorkList(workList: mendix.lib.MxObject, workListMapping: IWorkListMapping): IWorkList {
    return {
        id: workList.getGuid(),
        name: workListMapping.name && workList.get(workListMapping.name) as string,
        works: [],
        progressRate: workList.get(workListMapping.progressRate) as string,
    }
}