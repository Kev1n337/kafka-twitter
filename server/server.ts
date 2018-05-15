import * as kafka from "kafka-node";


const client = new kafka.KafkaClient({kafkaHost: 'localhost:9092'});

const topics = [
  {
    topic: "twitter_json_01"
  }
];
const options = {
  autoCommit: true,
  fetchMaxWaitMs: 1000,
  fetchMaxBytes: 1024 * 1024,
  encoding: "utf8"
};



const consumer = new kafka.Consumer(client, topics, options);

consumer.on("message", function(message) {
  console.log(message);

});

consumer.on("error", function(err) {
  console.log("error", err);
});

