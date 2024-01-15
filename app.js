const express=require("express");
const app=express();
const{getTopics,getEndpoints}=require("./controllers/news.controllers")

app.get('/api/topics',getTopics);

app.get('/api',getEndpoints)

app.use((err,req,res,next)=>{
    if(err.msg==='No such files')
    res.status(404).send('Not Found')
})

module.exports=app