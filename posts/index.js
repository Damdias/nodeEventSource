const express = require("express");
const bodyParser = require("body-parser");
const {randomBytes} = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts",(req,res)=>{
    res.send(posts);
});

app.post("/posts/create",async (req,res)=>{

    const id = randomBytes(4).toString("hex");
    const {title} = req.body;

    posts[id] = {
        id,title
    }
    res.status(200).send(posts[id]);
    await axios.post("http://event-bus-srv:4005/events", {
        type:"PostCreated",
        data:{
            id,
            title
        }
    });
    
});
app.post("/events",(req,res)=>{
    console.log("Event Received ", req.body.type);
    res.send({"status":"okay"})
});

app.listen(4000,()=>{
    console.log("Listening on 4000")
})
