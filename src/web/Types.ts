export interface PromptElem {
  getId: () => number;
  getText: () => string;
  setText: (text: string) => void;
  isAnswered: () => boolean;
}

export interface AnswerElem {
  getId: () => number;
  getText: () => string;
  isStatic: () => boolean;
  isHidden: () => boolean;
  isLiked: () => boolean;
  getSpoilerText: () => string;
  getAllText: () => string;
}

export class ConversationElem implements PromptElem, AnswerElem {
  id = 0;
  text = "";
  isUser = false;
  answered = false;
  staticMode = false;
  dropped = false;
  hidden = false;
  dropAfterAnswer = false;
  liked = false;
  spoiler = "";

  static newPrompt(id: number, text: string): ConversationElem {
    const elem = new ConversationElem();
    elem.id = id;
    elem.text = text;
    elem.isUser = true;
    return elem;
  }

  static newAnswer(id: number, text: string): ConversationElem {
    const elem = new ConversationElem();
    elem.id = id;
    elem.text = text;
    return elem;
  }

  getId(): number {
    return this.id;
  }

  getText(): string {
    return this.text.trim();
  }

  isAnswered(): boolean {
    return this.answered;
  }

  setText(text: string): void {
    this.text = text;
  }

  isStatic(): boolean {
    return this.staticMode;
  }

  isHidden(): boolean {
    return this.hidden;
  }

  isLiked(): boolean {
    return this.liked;
  }

  getSpoilerText(): string {
    return this.spoiler;
  }

  getAllText(): string {
    const slText = this.getSpoilerText();
    return `${this.getText()}${slText ? `\n\n${slText}` : ""}`;
  }
}
