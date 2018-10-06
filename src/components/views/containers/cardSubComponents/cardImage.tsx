import React = require("react");
import { MxImage } from "../image"
import { IAttachment } from "../../../interface"

export class CardImage extends React.Component<{ attachments: IAttachment[] }, { show: boolean }> {
    constructor(props) {
        super(props);
        this.state = {
            show: true
        }
    }

    // componentWillReceiveProps(nextProps: { attachments: IAttachment[] }) {
    //     this.setState({
    //         attachmentId: nextProps.attachments.length - 1
    //     })
    // }

    onError() {
        this.setState({
            show: false,
        })
    }

    render() {
        let attachmentId = this.props.attachments.length - 1;
        return <div style={{ position: "relative" }}>
            {(this.state.show && attachmentId >= 0) && <MxImage imageId={this.props.attachments[attachmentId].fileId} onError={this.onError.bind(this)} />}
        </div >
    }
}