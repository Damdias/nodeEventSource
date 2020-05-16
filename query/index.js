const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};
app.get("/posts",(req,res)=>{
    res.send(posts)
});

app.post("/events",(req,res)=> {
    const {type,data} = req.body;
    handleEvent(type,data);
    res.send({"status":"ok"});
})
const handleEvent = (type,data)=>{
    switch(type){
        case "PostCreated":
            posts[data.id] = data;
            break;
        case "CommnetCreated":  
            let post = posts[data.postId];
              let comments =  post["comments"] || (post["comments"] = [])
              comments.push(data);
            break;
        case "CommentUpdated":
            let updateComment =  posts[data.postId].comments.find(a=> a.id == data.id);
            updateComment.status = data.status;
            console.log("update commnets", updateComment)
            break;
    }
}
app.listen(4002, async ()=> {

    console.log("server is listening to 4002");
    let res = await axios.get("http://event-bus-srv:4005/events");
    res.data.forEach(a=> {
        let {type, data} = a;
        console.log('Process event ', a)
        handleEvent(type,data);
    })

});
