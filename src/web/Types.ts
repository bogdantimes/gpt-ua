export interface PromptElem {
  getId: () => number;
  getText: () => string;
  setText: (text: string) => void;
  isAnswered: () => boolean;
}

export interface AnswerElem {
  getId: () => number;
  getText: () => string;
}

export class ConversationElem implements PromptElem, AnswerElem {
  id = 0;
  text = "";
  isUser = false;
  answered = false;
  dropped = false;

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
}

export type ChatMode = "default" | "gpt4" | "research" | "wolfram" | "wiki";
