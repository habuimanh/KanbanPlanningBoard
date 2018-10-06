import * as React from "react";
export class PopOverList extends React.Component<{
    allowAddCard: boolean,
    allowRemoveList: boolean,
    viewOnProgress: boolean,
    top: number, left: number, deleteList: () => void,
    showPopUp: (event: any) => void, showCreateCard: (event: any) => void
}, { show: boolean }>{
    constructor(props) {
        super(props);
        this.state = {
            show: true
        };
        this.onClose = this.onClose.bind(this);
        this.showPopUp = this.showPopUp.bind(this);
    }
    onClose() {
        this.setState({
            show: false
        })
    }
    showPopUp(event) {
        this.props.showCreateCard(event);
        this.onClose();
    }
    render() {
        const { left, deleteList, top, showPopUp, viewOnProgress, allowRemoveList, allowAddCard } = this.props;
        if (!this.state.show) return <div hidden />
        return (
            <div className="pop-over" style={{ top: top, left: left, width: 280, display: "block" }}>
                <div className="pop-over-header">
                    <span className="pop-over-header-title">List Actions</span>
                    <a href="#" className="pop-over-header-close-btn">
                        <span className="glyphicon glyphicon-remove" onClick={this.onClose} />
                    </a>
                </div>
                <div>
                    <div className="pop-over-content" style={{ maxHeight: 656 }}>
                        <div>
                            <div>
                                <ul className="pop-over-list">
                                    {allowAddCard ? <li onClick={this.showPopUp}><a className="js-add-card" href="#">Add Card…</a></li> : undefined}
                                    <li onClick={showPopUp}><a>Edit List…</a></li>
                                    {allowRemoveList ?
                                        <li><a className="js-close-list" href="#" onClick={viewOnProgress ? this.onClose : deleteList}>Archive This List</a></li> :
                                        undefined}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    componentDidUpdate() {
        this.state.show = true;
    }
}