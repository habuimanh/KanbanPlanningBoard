import { IImage } from "../interface"

export function convertImage(image: mendix.lib.MxObject): IImage {
    return {
        id: image.getGuid(),
        path: "",
    }
}