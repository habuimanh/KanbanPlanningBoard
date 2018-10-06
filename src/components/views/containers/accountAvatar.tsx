import React = require("react")
import { IAccount } from "../../interface"
import { MxImage } from "./image"

export class AccountAvatar extends React.Component<{ account: IAccount, large?: boolean }, { showAvatar: boolean }> {
    constructor(props) {
        super(props);
        this.state = {
            showAvatar: !!this.props.account.avatarId
        }
    }

    onImgError() {
        this.setState({
            showAvatar: false
        })
    }

    render() {
        let { account, large } = this.props;
        let briefName = account.fullName.split(" ").slice(0, 2).map(name => name[0]).join("").toUpperCase();
        return <div className={"account-avatar " + (large ? "large" : "")} data-tip={account.fullName}>
            {
                this.state.showAvatar ?
                    <MxImage imageId={account.avatarId} onError={this.onImgError.bind(this)} />
                    : briefName
            }
        </div >
    }
}