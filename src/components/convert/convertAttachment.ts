import { IAttachment, IAttachmentMapping } from "../interface"

export function convertAttachment(attachment: mendix.lib.MxObject, attachmentMapping: IAttachmentMapping): IAttachment {
    return {
        id: attachment.getGuid(),
        text: attachmentMapping.text && attachment.get(attachmentMapping.text) as string,
        fileId: attachment.get(attachmentMapping.fileId) as string,
    }
}