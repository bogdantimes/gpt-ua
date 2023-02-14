export interface PromptElem {
  getId(): number;
  getText(): string;
  setText(text: string): void;
  isAnswered(): boolean;
}

export interface AnswerElem {
  getId(): number;
  getText(): string;
  getOriginalText(): string;
  getShowOriginal(): boolean;
  getReplyClicked(): boolean;
}

export class ConversationElem implements PromptElem, AnswerElem {
  id: number;
  text: string;
  originalText: string;
  showOriginal: boolean;
  replyClicked: boolean;
  isUser: boolean;
  answered: boolean;

  static newPrompt(id: number, text: string): ConversationElem {
    let elem = new ConversationElem();
    elem.id = id;
    elem.text = text;
    elem.isUser = true;
    return elem;
  }

  static newAnswer(id: number, text: string, originalText: string): ConversationElem {
    let elem = new ConversationElem();
    elem.id = id;
    elem.text = text;
    elem.originalText = originalText;
    return elem;
  }

  getId(): number {
    return this.id;
  }

  getOriginalText(): string {
    return this.originalText;
  }

  isAnswered(): boolean {
    return this.answered;
  }

  getText(): string {
    return this.text;
  }

  setText(text: string): void {
    this.text = text;
  }

  getReplyClicked(): boolean {
    return this.replyClicked;
  }

  getShowOriginal(): boolean {
    return this.showOriginal;
  }
}
