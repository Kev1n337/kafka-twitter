export class Tweet {
  time: string;
  name: string;
  text: string;

  constructor(time: string, name: string, text: string) {
    this.time = time;
    this.name = name;
    this.text = text;
  }
}