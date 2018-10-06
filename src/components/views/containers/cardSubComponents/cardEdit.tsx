import React = require("react");

export class CardEdit extends React.Component<{ onEdit: () => void }, {}> {
    render() {
        return <div className="card-edit" onClick={this.props.onEdit}>
            <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
        </div>
    }
}