import { MongoClient, Db } from "mongodb";

class DbClient {
  public db: Db;

  public async connect() {
    let client = await MongoClient.connect("mongodb://localhost:27017");
    this.db = client.db();
    console.log("Connected to db");
    return this.db;
  }

}

export = new DbClient();