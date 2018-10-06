import React = require("react");
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { IViewState } from "../../interfaces";
import { onClick } from "../../actions"

const mapStateToProps = (state: IViewState) => ({
    idClicked: state.idClicked
})

const mapDispatchToProps = (dispatch) => ({
    onClick: bindActionCreators(onClick, dispatch)
})

class DumbShowPopUpButton extends React.Component<{
    idClicked: string,
    showPopup: () => void,
    idPopup: string,
    onClick: (id: string) => void
}, {}> {

    showOrHidePopUp(e: MouseEvent) {
        let { idClicked, idPopup, onClick } = this.props;
        e.stopPropagation();
        if (idClicked === idPopup) {
            onClick(""); // Hide popup
        } else {
            onClick(idPopup);
            this.props.showPopup();
        }
    }

    render() {
        return <span onClick={this.showOrHidePopUp.bind(this)}>
            {this.props.children}
        </span>
    }
}

export const ShowPopupButton = connect(mapStateToProps, mapDispatchToProps)(DumbShowPopUpButton);