const express  = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

let events = [];

app.use(bodyParser.json());

app.post("/events",async (req,res)=>{
    const event = req.body;
    events.push(event);
    console.log("event",event)
    res.send({"status":"ok"});
    await axios.post("http://posts-clusterip:4000/events",event );
    await axios.post("http://comments-srv:4001/events",event );
    await axios.post("http://moderation-srv:4003/events",event );
    await axios.post("http://query-srv:4002/events",event );
   
});

app.get("/events",(req,res)=>{
    res.send(events);
});

app.listen(4005,()=> console.log("Server is listening 4005"));