import React = require("react");

export const CardTitle = (props: { title: string }) => {
    return <div className="card-title">
        {props.title}
    </div>
}