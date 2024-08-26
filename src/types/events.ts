export abstract class Events {
  abstract once: boolean;
  abstract name: string;
  abstract execute(...args: any[]): any;
}
