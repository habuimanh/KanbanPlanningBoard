import { IList, IListMapping } from "../interface"

export function convertList(list: mendix.lib.MxObject, listMapping: IListMapping): IList {
    return {
        id: list.getGuid(),
        order: list.get(listMapping.order)["toPrecision"](),
        name: list.get(listMapping.name) as string,
        cards: [],
    }
}