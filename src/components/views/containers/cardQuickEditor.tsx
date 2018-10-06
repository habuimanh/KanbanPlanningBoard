import React = require("react");
import ReactDOM = require("react-dom")
import { IQuickCardEditor } from "../interfaces"
import * as $ from "./cardSubComponents"
import { KanbanView, ICard } from "../../interface"
import { ChangeMemberPopup } from "./popup-editor"
const ENTER_CODE = 13;

export class CardQuickEditorButton extends React.Component<{ label: string, icon: string, action: () => void }, {}> {
    render() {
        let { label, icon, action } = this.props;
        return <div className="card-quick-editor-button" onClick={action.bind(this)}>
            <span className="card-quick-editor-icon">
                <span className={icon} aria-hidden="true"></span>
            </span>
            <span className="card-quick-editor-label">{label}</span>
        </div>
    }
}

export class EditingCard extends React.Component<{ card: ICard, listIndex: number, cardIndex: number, changeTitle: (newTitle: string) => void }, {}> {
    textarea: HTMLTextAreaElement;
    select(e: React.MouseEvent) {
        e.stopPropagation();
    }
    componentDidMount() {
        this.textarea.select();
    }
    onChangeTitle(e: React.KeyboardEvent) {
        if (e.keyCode === ENTER_CODE || e.charCode === ENTER_CODE) {
            this.props.changeTitle(this.textarea.value);
        }
    }
    render() {
        let { card, listIndex, cardIndex } = this.props;
        let title = card.name;
        return <div style={{ backgroundColor: "#FFF" }}>
            <$.CardImage attachments={card.attachments} />
            <div className="card-details">
                <$.CardLabel labels={card.labels} />
                <textarea id="textareaPopUp" className="card-title-edit" ref={textarea => this.textarea = textarea}
                    onKeyPress={this.onChangeTitle.bind(this)} defaultValue={title}
                    onClick={this.select.bind(this)} />
                <$.CardBadges>
                    {/* <$.SubscribeBadge isSubscribed={true} /> */}
                    <$.DueDateBadge dueDate={card.dueDate} />
                    <$.DescriptionBadge hasDescription={!!card.description} />
                    <$.CommentBadge number={card.comments.length} />
                    <$.AttachmentBadge number={card.attachments.length} />
                    <$.WorkListBadge progressRate={KanbanView.getCardProgressRate(card)} />
                </$.CardBadges >
                <$.CardMemberList members={card.members} listIndex={listIndex} cardIndex={cardIndex} readonly={true} />
            </div>
        </div>
    }
}

export class CardQuickEditor extends React.Component<IQuickCardEditor, { card: ICard }> {
    constructor(props) {
        super(props);
        this.state = {
            card: JSON.parse(JSON.stringify(this.props.cardInfo.card))
        }
        this.submitEdit = this.submitEdit.bind(this);
    }

    close() {
        this.props.showPopup("");
        ReactDOM.render(<span />, document.getElementById("cardQuickEditor") as HTMLElement)
    }

    changeTitle(newTitle: string) {
        this.props.changeCardName(this.props.cardInfo.listIndex, this.props.cardInfo.cardIndex, newTitle);
        this.close();
    }

    changeMemberLocally(memberId: string) {
        let account = this.props.accounts.find(account => account.id === memberId);
        if (!account) return;
        let card: ICard = JSON.parse(JSON.stringify(this.state.card));
        let memberIndex = card.members.findIndex(member => member.id === memberId);
        if (memberIndex === -1) {
            card.members.push(account);
        } else {
            card.members = card.members.filter(member => member.id !== memberId);
        }
        this.setState({ card: card })
        this.props.removeOrAddMember(this.props.cardInfo.listIndex, this.props.cardInfo.cardIndex, memberId)
    }
    submitEdit(event) {
        this.changeTitle((document.getElementById("textareaPopUp") as HTMLTextAreaElement).value);
        event.stopPropagation();
    }
    openChangeMemberPopup(e: MouseEvent) {
        e.stopPropagation();
        ReactDOM.render(<ChangeMemberPopup onClick={this.props.showPopup}
            onChangeMember={this.changeMemberLocally.bind(this)}
            top={this.changeMemberButton.getBoundingClientRect().top + 30}
            left={this.changeMemberButton.getBoundingClientRect().left + 15}
            accounts={this.props.accounts}
            selectedIds={this.state.card.members.map(member => member.id)} />,
            document.getElementById("popUp") as HTMLElement);
        this.props.showPopup("ChangeMember");
    }

    changeMemberButton: HTMLDivElement
    render() {
        if (!this.props.cardInfo) return <span />;
        let card = this.state.card;
        let { top, width, left, listIndex, cardIndex } = this.props.cardInfo;
        return <div className={"card-quick-editor-overlay is-editing"} onClick={this.close.bind(this)}>
            <div className="card created-card quick-editing" style={{ top, left, width }}>
                <EditingCard card={card} listIndex={listIndex} cardIndex={cardIndex}
                    changeTitle={this.changeTitle.bind(this)} />
                <div className="card-quick-editor" >
                    <CardQuickEditorButton label="Edit Card" icon="glyphicon glyphicon-pencil"
                        action={() => this.props.openForm(card.id)} />
                    <div ref={div => this.changeMemberButton = div} >
                        <CardQuickEditorButton label="Change Member" icon="glyphicon glyphicon-user"
                            action={this.openChangeMemberPopup.bind(this)} />
                    </div>
                    {this.props.allowRemoveCard ? <CardQuickEditorButton label="Archive" icon="glyphicon glyphicon-trash"
                        action={() => this.props.deleteCard(listIndex, cardIndex)} /> : undefined}
                </div>
            </div >
            <input onClick={this.submitEdit} className="save-edits" style={{ top: top, left: left }} value="Save" type="submit" />
        </div>
    }
}