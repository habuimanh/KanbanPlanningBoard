import React = require("react")
import { IProgressRate } from "../../../interface"

export const CardBadge = (props: { tooltip: string, text?: string | number, iconClass: string, badgeClass?: string }) => {
    let { tooltip, text, iconClass, badgeClass } = props;
    return <div className={"card-badge " + badgeClass} data-tip={tooltip}>
        <span className={iconClass} aria-hidden="true"></span>
        {text && <span className="card-badge-text">{text}</span >}
    </div>
}

export const SubscribeBadge = (props: { isSubscribed: boolean }) => {
    if (!props.isSubscribed) return <span />
    return <CardBadge tooltip="You are subscribed to this card." iconClass="glyphicon glyphicon-eye-open" />
}

export const DueDateBadge = (props: { dueDate?: number }) => {
    if (!props.dueDate) return <span />
    let remainingTime = props.dueDate - Date.now();
    let text = new Date(props.dueDate).toDateString().split(" ").slice(1, 3).join(" ");
    let badgeClass = "";
    let tooltip = "This card is due later."
    let twentyFourHours = 1000 * 3600 * 24;
    if (remainingTime < 0) {
        badgeClass = "is-due-past";
        tooltip = "This card is over due.";
    } else if (remainingTime < twentyFourHours) {
        badgeClass = "is-due-soon";
        tooltip = "This card is due in less than twenty-four hours.";
    }
    return <CardBadge tooltip={tooltip} badgeClass={badgeClass} iconClass="glyphicon glyphicon-time" text={text} />
}

export const DescriptionBadge = (props: { hasDescription: boolean }) => {
    if (!props.hasDescription) return <span />
    return <CardBadge tooltip="This card has a description." iconClass="glyphicon glyphicon-align-justify" />
}

export const CommentBadge = (props: { number: number }) => {
    if (!props.number) return <span />;
    return <CardBadge tooltip="Comments" text={props.number} iconClass="glyphicon glyphicon-comment" />
}

export const AttachmentBadge = (props: { number: number }) => {
    if (!props.number) return <span />
    return <CardBadge tooltip="Attachments" text={props.number} iconClass="glyphicon glyphicon-paperclip" />
}

export const WorkListBadge = (props: { progressRate: IProgressRate }) => {
    let { totalWorks, doneWorks } = props.progressRate;
    if (totalWorks === 0) return <span />;
    let badgeClass = (totalWorks === doneWorks) ? "is-complete" : "";
    return <CardBadge tooltip="Checklist items" badgeClass={badgeClass} text={`${doneWorks}/${totalWorks}`}
        iconClass="glyphicon glyphicon-check" />
}

export const CardBadges = (props: { children }) => {
    return <div className="card-badges">
        {props.children}
    </div>
}