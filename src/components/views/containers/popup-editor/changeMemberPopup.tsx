import React = require("react");
import { PopupEditor, MultiSelectList } from "./";
import { AccountAvatar } from "../accountAvatar"
import { IAccount } from "../../../interface"

export class AccountListItem extends React.Component<{ account: IAccount, onSelect: () => void, isSelect: boolean }, { isSelected: boolean }> {
    constructor(props) {
        super(props);
        this.state = {
            isSelected: this.props.isSelect,
        }
    }

    onSelect(e: MouseEvent) {
        e.stopPropagation();
        this.setState({
            isSelected: !this.state.isSelected,
        })
        this.props.onSelect();
    }

    render() {
        let { account } = this.props;
        return <div onClick={this.onSelect.bind(this)} className={"account-list-item"}  >
            <AccountAvatar account={account} />
            <span className="account-full-name">
                {account.fullName}
            </span>
            {this.state.isSelected && <span className="tick">
                <span className="glyphicon glyphicon-ok"></span>
            </span>}
        </div >
    }
}

export const ChangeMemberPopup = (props: {
    onClick: (id: string) => void,
    top: number, left: number,
    accounts: IAccount[],
    selectedIds: string[],
    onChangeMember: (memberId: string) => void
}) => {
    let { top, left, onClick, accounts, selectedIds } = props;
    return <PopupEditor onClick={onClick} top={top} left={left} title="Members">
        <div className="pop-over-content">
            <MultiSelectList placeholder="Search members">
                {accounts.map(account => <AccountListItem account={account}
                    onSelect={() => props.onChangeMember(account.id)}
                    isSelect={selectedIds.indexOf(account.id) >= 0} />)}
            </MultiSelectList>
        </div>
    </PopupEditor>
}