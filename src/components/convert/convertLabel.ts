import { ILabel } from "../interface"
import { ILabelMapping, Color } from "../interface"

export function convertLabel(label: mendix.lib.MxObject, labelMapping: ILabelMapping): ILabel {
    return {
        id: label.getGuid(),
        name: label.get(labelMapping.name) as string,
        color: Color[label.get(labelMapping.color) as string]
    }
}