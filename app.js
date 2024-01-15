const express=require("express");
const app=express();
const{getTopics}=require("./controllers/ncnews.controllers")

app.get('/api/topics',getTopics);

app.use((err,req,res,next)=>{
    
})

module.exports=app