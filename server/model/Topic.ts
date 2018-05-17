export class Topic {
  name: string;
  tweets: any[];

  constructor(name: string) {
    this.name = name;
    this.tweets = [];
  }
}