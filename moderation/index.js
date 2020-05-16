const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.use(bodyParser.json())

app.post("/events", async(req,res)=>{
        const {type,data} = req.body;
        console.log("Moderation",type)
        if(type === "CommnetCreated"){
            let status = data.content.includes("oranage") ? "rejected" : "approved";
            await axios.post("http://event-bus-srv:4005/events",{
                type:"CommentModerated",
                data:{
                    ...data,
                    status
                }
            });
           
        }
        res.send({"status":"Ok"});
})


app.listen(4003,()=> console.log("Server is listening to port 4003"))