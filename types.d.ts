declare module 'annyang' {
    export function addCommands(commands: any): void;
    export function start(): void;
    export function abort(): void;
    export function addCallback(type: string, callback: Function): void;
    // Add other functions from annyang you want to use
  }
  