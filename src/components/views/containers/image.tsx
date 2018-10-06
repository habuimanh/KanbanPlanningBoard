import React = require("react");


export class MxImage extends React.Component<{ imageId: string, onError?: (e) => void }, {}> {
    shouldComponentUpdate(nextProps: { imageId: string }) {
        if (nextProps.imageId === this.props.imageId) return false;
        return true;
    }
    render() {
        return <span className="mx-image-container">
            <img className="mx-image"
                src={"/file?fileID=" + this.props.imageId + "&" + new Date().toString()}
                onError={this.props.onError} />
            {"\u00A0"}
        </span >
    }
}