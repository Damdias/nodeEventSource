const express =require("express");
const bodyParser = require("body-parser");
const {randomBytes} = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app  = express();

app.use(bodyParser.json());
app.use(cors())

const comments = {}
app.get("/posts/:id/comments",(req,res)=>{
    res.send(comments[req.params.id] || []);
});

app.post("/posts/:id/comments",async (req,res)=>{
    const {id} = req.params;
    const {content} = req.body;
    const commentId = randomBytes(3).toString("hex");
    const commentsPosts = comments[id] || []
    commentsPosts.push({"id":commentId,"content":content,"status":"pending"})
    comments[id]  = commentsPosts;
    let event = {
        type:"CommnetCreated",
        data:{
            "id":commentId,
            "content":content,
            "postId": id,
            "status":"pending"
        }
    }
    await axios.post("http://event-bus-srv:4005/events",event);
    res.status(201).send(comments[id]);
   

   
});


app.post("/events",async (req,res)=>{
    console.log("Event Received ", req.body.type);
    const {type,data} = req.body;
    if(type === "CommentModerated"){
        let comment = comments[data.postId];
         let event  = {
             type:"CommentUpdated",
             data:{
                 ...data
             }
         }
        await axios.post("http://event-bus-srv:4005/events",event);
    }
    res.send({"status":"okay"})
});

app.listen(4001,()=> console.log(`server is listening 4001`));