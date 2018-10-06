import React = require("react");

export interface IPopUpEditorProps {
    title?: string,
    top: number,
    left: number,
    width?: number,
    height?: number,
    onClick: (id: string) => void
}

export class PopupEditor extends React.Component<IPopUpEditorProps, {}> {

    render() {
        let { top, left, width, height } = this.props;
        return <div className="pop-over" style={{ top, left, width, height, display: "block" }}>
            {this.props.title && <div className="pop-over-header">
                <span className="pop-over-header-title">{this.props.title}</span>
            </div>}
            <a href="#" className="pop-over-header-close-btn">
                <span className="glyphicon glyphicon-remove" onClick={() => {
                    this.props.onClick("")
                }} />
            </a>
            {this.props.children}
        </div>
    }
}