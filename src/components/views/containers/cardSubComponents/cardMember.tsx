import React = require("react");
import ReactDOM = require("react-dom");
import { IAccount } from "../../../interface";
import { ShowPopupButton, RemoveMemberPopup } from "../popup-editor"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import actions = require("../../actions")
import { AccountAvatar } from "../accountAvatar"

export const mapDispatchToProps = (dispatch) => ({
    removeMember: bindActionCreators(actions.removeOrAddMember, dispatch),
    onClick: bindActionCreators(actions.onClick, dispatch)
})

export class DumbCardMember extends React.Component<{
    member: IAccount,
    onClick?: (id: string) => void,
    listIndex: number,
    cardIndex: number,
    removeMember: (listIndex: number, cardIndex: number, memberId: string) => void
}, {}> {
    show() {
        ReactDOM.render(<RemoveMemberPopup
            member={this.props.member}
            top={this.memberAvatar.getBoundingClientRect().top + 35}
            left={this.memberAvatar.getBoundingClientRect().left}
            removeMember={this.props.removeMember}
            listIndex={this.props.listIndex}
            cardIndex={this.props.cardIndex}
            onClick={this.props.onClick!}
        />, document.getElementById("popUp") as HTMLElement);
    }

    memberAvatar: HTMLDivElement;
    render() {
        let { member, listIndex, cardIndex } = this.props;

        return <ShowPopupButton idPopup={`List${listIndex}Card${cardIndex}Member${member.fullName}`} showPopup={this.show.bind(this)}>
            <div className="card-member" ref={div => this.memberAvatar = div}>
                <AccountAvatar account={member} />
            </div>
        </ShowPopupButton>
    }
}

const CardMember = connect(undefined, mapDispatchToProps)(DumbCardMember);

export const CardMemberList = (props: { members: IAccount[], listIndex?: number, cardIndex?: number, readonly?: boolean }) => {
    let { members, listIndex, cardIndex } = props;
    if (members.length === 0) return <span />;
    return <div className="card-member-list">
        {members.map(member => {
            if (props.readonly) {
                return <AccountAvatar account={member} />
            } else {
                return <CardMember member={member} listIndex={listIndex} cardIndex={cardIndex} />
            }
        })}
    </div>
}