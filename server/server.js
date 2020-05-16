const express = require("express");
const app = express();

app.use(express.static("public"))

app.get("/", (req,res)=>{
    console.log("sending files")
    res.send("my");
})

app.listen(3005,()=>console.log("Server is listning to 3005"))