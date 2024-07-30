export interface FileDetail {
  name: string;
  type: 'pdf' | 'image';
  content: string;
}

export interface PromptElem {
  getId: () => number;
  getText: () => string;
  setText: (text: string) => void;
  isAnswered: () => boolean;
  getFiles: () => FileDetail[];
  setFiles: (files: FileDetail[]) => void;
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
  text = '';
  isUser = false;
  answered = false;
  dropped = false;
  pinned = false;
  media: Array<{ b64_json: string; revised_prompt: string }> | undefined;
  mode: ChatMode = 'default';
  files: FileDetail[] = [];

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
      return '';
    }
    return this.text.trim();
  }

  isAnswered(): boolean {
    return this.answered;
  }

  setText(text: string): void {
    this.text = text;
  }

  getFiles(): FileDetail[] {
    return this.files;
  }

  setFiles(files: FileDetail[]) {
    this.files = files;
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

export interface ChatModeConfig {
  id: ChatMode;
  isVisionSupported: boolean;
  isFree: boolean;
  isNew?: boolean;
}

export type ChatMode =
  | 'default'
  | 'claude3_5'
  | 'gpt4'
  | 'mistral+'
  | 'llama'
  | 'llama31'
  | 'naviguru';

export const ChatModes: ChatModeConfig[] = [
  { id: 'llama', isVisionSupported: false, isFree: true },
  { id: 'llama31', isVisionSupported: false, isFree: true, isNew: true },
  { id: 'default', isVisionSupported: true, isFree: false },
  { id: 'claude3_5', isVisionSupported: true, isFree: false, isNew: true },
  //  { id: 'gpt4', isVisionSupported: true, isFree: false },
  { id: 'mistral+', isVisionSupported: false, isFree: false },
  { id: 'naviguru', isVisionSupported: true, isFree: false },
];

export const DefaultMode: ChatMode = 'default';
