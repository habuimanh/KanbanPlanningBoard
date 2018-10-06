import { IItem } from "../interface"
import { IItemMapping } from "../interface"

export function convertItem(item: mendix.lib.MxObject, itemMapping: IItemMapping): IItem {
    return {
        id: item.getGuid(),
        order: parseInt(item.get(itemMapping.order)["toPrecision"]()),
        createdTime: parseInt(item.get(itemMapping.createdTime) as string)
    }
}