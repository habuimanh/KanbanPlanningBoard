/// <reference path="./../../../../typings/index.d.ts" /> 
import * as React from "react";
import * as I from "./../interfaces";
export class CreateCard extends React.Component<I.ICreateCardProps, { value: string }> {
    textarea: HTMLTextAreaElement;
    constructor(props) {
        super(props);
        this.onPressEnter = this.onPressEnter.bind(this);
        this.state = {
            value: this.props.cardName
        };
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(event) {
        this.setState({ value: event.target.value })
    }
    onPressEnter(event: any) {
        const { saveNewCard } = this.props;
        const charEnter = 13;
        if (this.textarea.value === "" && (event.keyCode === charEnter || event.which === charEnter)) {
            event.preventDefault();
            return;
        }
        else if ((event.keyCode === charEnter || event.which === charEnter)) {
            event.preventDefault();
            saveNewCard(this.textarea.value, event);
        }
    }
    componentWillReceiveProps(nextProps: I.ICreateCardProps) {
        const { changeNameCard, idClicked } = this.props;
        if (this.textarea && nextProps.idClicked != idClicked) {
            changeNameCard(this.textarea.value);
        }
        this.setState({
            value: nextProps.cardName
        })
    }
    componentDidMount() {
        if (this.textarea)
            this.textarea.focus();
    }
    render() {
        const { onClose, saveNewCard, readOnly, idClicked, listId } = this.props;
        return (
            <div>
                {idClicked === "listcard" + listId ?
                    [<div className="card">
                        <textarea ref={(textarea) => { this.textarea = textarea }} value={this.state.value} onChange={this.handleChange}
                            onKeyPress={readOnly ? undefined : this.onPressEnter} />
                    </div >,
                    < div className="card-button-container">
                        <button onClick={readOnly ? undefined : (event) => saveNewCard(this.textarea.value, event)} className="btn btn-default" id="addButton">Add</button>
                        <button onClick={readOnly ? undefined : onClose} className="btn btn-default">Close</button>
                    </div >]
                    : <span className="addCard">Add a card...</span>
                }
            </div>
        )
    }
}