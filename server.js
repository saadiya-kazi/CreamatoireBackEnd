//
// This is where the app starts, and sets things up
// We require the packages we need, body parser and express, and then set up body parser to accept
// JSON and URL encoded values. We then include the `routes.js` file, in which we define the API
// end-points we're going to be using, and we pass it the `app` variable. Lastly, we specify the
// port to listen to for requests. In this case, port 3000.
// 
var express = require("express");
var app = express();
var http = require("http").createServer(app);
const io = require("socket.io")(http);
var bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const port = process.env.PORT || 3000;

var CONNECTION_URL ="mongodb+srv://saadiya:lF70OeVN5ZBnplug@boutique-tqqvs.mongodb.net/test?retryWrites=true&w=majority"
var DATABASE_NAME = "TESTDB";
var database, collection, collectionOrders;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
 
var routes = require("./routes.js")(app);
    app.get("/getIngredientsList", function(req, res) {
      return collection.find({}).toArray(function(error, response) {
        console.log("response", response)
        return res.send(response)
    });
    });
   app.get("/getOrderBeingPrepared", function(req, res) {
      return collectionOrders.find({status: "being_prepared"},  {projection: {  _id: 0,orderNo: 1 }}).toArray(function(error, response) {
        console.log("response1", response)
        return res.send(response)
    });
    });
  
  app.get("/getOrderReadyForPickup", function(req, res) {
      return collectionOrders.find({status: "ready_for_pickup"},  {projection: {  _id: 0,orderNo: 1 }}).toArray(function(error, response) {
        console.log("response", response)
        return res.send(response)
    });
    });
   app.get("/getAllOrders", function(req, res) {
      return collectionOrders.find({}).toArray(function(error, response) {
        console.log("response", response)
        return res.send(response)
    });
    });
  app.put('/updateStatus', function(req, res) {
    const query = {
      orderNo:  req.body.orderNo
    }
    var newStatus = { $set: { status: req.body.status , nextStatus:req.body.status } }
    return collectionOrders.updateOne(query, newStatus, function(err, response) {
        io.to(1).emit("OrderStatusUpdate", {success: true, message: "Updated Successfully", data: req.body});

      return res.send({success: true, message: "Updated Successfully", data: req.body})
    })

  })
  app.post("/createOrder", function(req, res) {
     console.log("reqBody", req.body)
     const object = {
       status: "waiting",
       nextStatus: ""
     }
     object['ingredientList'] = req.body.ingredientList
     console.log("object", object)
      return collectionOrders.find({}).toArray(function(error, response) {
        console.log("response", response)
        if(response.length === 0) {
          object['orderNo'] = 1
          return collectionOrders.insertOne(object, function(error, responseSave) {
            io.to(1).emit("OrderListUpdate", { success: true, message:"Data Saved Successfully", data:object })
            return res.send({ success: true, message:"Data Saved Successfully", data:object })
          })
        } else {
          object['orderNo'] = response.length +1;
           return collectionOrders.insertOne(object, function(error, responseSave) {
            io.to(1).emit("OrderListUpdate", { success: true, message:"Data Saved Successfully", data:object })
             
            return res.send({ success: true, message:"Data Saved Successfully", data:object })
          })
        }
        
    });
    
   });


http.listen(port, function () {
  console.log("Listening on port %s", port);
   MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("TESTCOLL");
       collectionOrders = database.collection("TESTORDERS")
     
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
 
});



io.on("connection", function(socket) {
  console.log("user connected");
  // socket.emit("FromAPI", "hi");
  socket.on("subscribe", function(room) {
    console.log("joining room", room);
    socket.join(room);
  });
  socket.on("unsubscribe", function(room) {
    console.log("left room", room);
    socket.leave(room);
  });
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });
});



  