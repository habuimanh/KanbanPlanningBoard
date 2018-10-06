import { ICard, WorkState } from "../interface"
import { ICardMapping } from "../interface"

export function convertCard(card: mendix.lib.MxObject, cardMapping: ICardMapping): ICard {
    return {
        id: card.getGuid(),
        order: card.get(cardMapping.order)["toPrecision"](),
        members: [],
        subscribers: [],
        name: card.get(cardMapping.name) as string,
        description: card.get(cardMapping.description) as string,
        dueDate: card.get(cardMapping.dueDate) ? parseInt(card.get(cardMapping.dueDate) as string) : undefined,
        startDate: (cardMapping.startDate && card.get(cardMapping.startDate)) ? parseInt(card.get(cardMapping.startDate) as string) : undefined,
        workLists: [],
        comments: [],
        attachments: [],
        labels: [],
        state: WorkState[card.get("State") as string]
    }
}