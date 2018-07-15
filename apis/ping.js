var MongoClient = require("mongodb").MongoClient;
let instanceId = process.env.instanceId;

MongoClient.connect("mongodb://mongo.default.svc.cluster.local:27017", {reconnectTries : Number.MAX_VALUE, autoReconnect : true, useNewUrlParser: true}, function(err, database) {
    if(!err) {
        let db = database.db("admin");
        db.collection("networks").findOne({instanceId: instanceId}, function(err, node) {
            if(!err && node) {
                if(node.status !== "initializing") {
                    db.collection("networks").updateOne({instanceId: instanceId}, { $set: {status: "running", lastPinged: Date.now()}}, function(err, res) {
                        process.exit(0);
                    });
                }
            } else {
                process.exit(0);
            }
        })
    } else {
        process.exit(0);
    }
})
