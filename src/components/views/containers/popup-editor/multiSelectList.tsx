import React = require("react");

export class MultiSelectList extends React.Component<{ placeholder: string }, {}> {
    render() {
        let { placeholder } = this.props;
        return <div>
            <input className="search-bar" type="text" placeholder={placeholder} />
            {this.props.children}
        </div>
    }
}