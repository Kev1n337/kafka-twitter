export class Tweet {
  time: string;
  name: string;
  text: string;
  hashtags: string[];

  constructor(time: string, name: string, text: string, hashtags: string[]) {
    this.time = time;
    this.name = name;
    this.text = text;
    this.hashtags = hashtags;
  }
}