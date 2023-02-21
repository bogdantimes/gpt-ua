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
  isStatic(): boolean;
}

export class ConversationElem implements PromptElem, AnswerElem {
  id = 0;
  text = "";
  originalText = "";
  showOriginal = false;
  replyClicked = false;
  isUser = false;
  answered = false;
  staticMode = false;
  dropped = false;

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

  getText(): string {
    return this.text.trim();
  }

  getOriginalText(): string {
    return this.originalText.trim();
  }

  isAnswered(): boolean {
    return this.answered;
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

  isStatic(): boolean {
    return this.staticMode;
  }
}
