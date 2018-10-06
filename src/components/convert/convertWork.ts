import { IWorkMapping, WorkState, IWork } from "../interface"

export function convertWork(work: mendix.lib.MxObject, workMapping: IWorkMapping): IWork {
    return {
        id: work.getGuid(),
        name: workMapping.name && work.get(workMapping.name) as string,
        state: WorkState[work.get(workMapping.state) as string]
    }
}