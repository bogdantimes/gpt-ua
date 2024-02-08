export interface PromptElem {
  getId: () => number;
  getText: () => string;
  setText: (text: string) => void;
  getImage: () => string;
  setImage: (imgSrc: string) => void;
  isAnswered: () => boolean;
}

export interface AnswerElem {
  getId: () => number;
  getText: () => string;
  isPinned: () => boolean;
  getMedia: () =>
    | Array<{ b64_json: string; revised_prompt: string }>
    | undefined;
  setMode: (mode: ChatMode) => void;
  getMode: () => ChatMode;
}

export class ConversationElem implements PromptElem, AnswerElem {
  id = 0;
  text = "";
  isUser = false;
  answered = false;
  dropped = false;
  pinned = false;
  image = "";
  media: Array<{ b64_json: string; revised_prompt: string }> | undefined;
  mode: ChatMode = "default";

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
    if (this.text.trim() === this.media?.[0]?.revised_prompt.trim()) {
      return "";
    }
    return this.text.trim();
  }

  isAnswered(): boolean {
    return this.answered;
  }

  setText(text: string): void {
    this.text = text;
  }

  setImage(imgSrc: string): void {
    this.image = imgSrc;
  }

  getImage(): string {
    return this.image;
  }

  isPinned(): boolean {
    return this.pinned;
  }

  addMedia(media?: Array<{ b64_json: string; revised_prompt: string }>) {
    this.media = media;
  }

  getMedia(): Array<{ b64_json: string; revised_prompt: string }> | undefined {
    return this.media;
  }

  setMode(mode: ChatMode) {
    this.mode = mode;
  }

  getMode(): ChatMode {
    return this.mode;
  }
}

export type ChatMode = "default" | "gpt4" | "gpt4+" | "mistral" | "mistral+";
export const ChatModes: ChatMode[] = [
  "default",
  "gpt4",
  "gpt4+",
  "mistral",
  "mistral+",
];
