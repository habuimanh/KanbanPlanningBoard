import React = require("react");
import { ILabel } from "../../../interface"
import { IViewState } from "../../interfaces"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { changeLabelsDisplay } from "../../actions"

const mapStateToProps = (state: IViewState) => ({
    open: state.setting.openLabels
})

const mapDispatchToProps = (dispatch) => ({
    changeLabelsDisplay: bindActionCreators(changeLabelsDisplay, dispatch),
})

export class CardLabel extends React.Component<{ labels: ILabel[], open?: boolean, changeLabelsDisplay?: () => void }, {}> {
    onClick(e: MouseEvent) {
        e.stopPropagation();
        this.props.changeLabelsDisplay && this.props.changeLabelsDisplay();
    }

    render() {
        let labels = this.props.labels;
        let open = this.props.open !== undefined ? this.props.open : false;
        if (labels.length === 0) return <span />;
        return <div className={"card-label-list" + (open ? " card-label-list-focused" : "")} onClick={this.onClick.bind(this)}>
            {labels.map(label => {
                return <div
                    data-tip={label.name}
                    className={"card-label"
                        + ` card-label-${label.color && label.color.toLowerCase()}`
                        + (open ? ` card-label-focused` : "")}>
                    {(open && label.name) ? label.name : "\u00A0"}
                </div>
            })}
        </div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardLabel);