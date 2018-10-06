import { PopupEditor, IPopUpEditorProps } from "./popupEditor";
import React = require("react")
import { IAccount } from "../../../interface"
import { AccountAvatar } from "../accountAvatar"

interface IRemoveMemberPopUpProps extends IPopUpEditorProps {
    removeMember: (listIndex: number, cardIndex: number, memberId: string) => void,
    member: IAccount,
    listIndex: number,
    cardIndex: number
}

export const RemoveMemberPopup = (props: IRemoveMemberPopUpProps) => {
    let { top, left, onClick, member } = props;
    let removeMember = () => {
        props.onClick("");
        props.removeMember(props.listIndex, props.cardIndex, member.id);
    }
    return <PopupEditor top={top} left={left} width={250} onClick={onClick}>
        <div className="mini-profile">
            <AccountAvatar account={member} large />
            <div className="card-member-fullname">
                {member.fullName}
            </div>
        </div>
        <div className="remove-member" onClick={removeMember}>Remove from Card</div>
    </PopupEditor>
}