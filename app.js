const express=require("express");
const app=express();
const{getTopics,getEndpoints,getArticleById,
    getArticles,getCommentsByArticleid}=require("./controllers/news.controllers")

app.get('/api/topics',getTopics);

app.get('/api',getEndpoints);

app.get('/api/articles/:article_id',getArticleById);

app.get('/api/articles',getArticles);

app.get('/api/articles/:article_id/comments',getCommentsByArticleid)

app.use((err,req,res,next)=>{
    if(err.msg==='No such files'||err.msg==='Not Found')
    res.status(404).send({msg:'Not Found'})
    else if(err.msg==='Articles Not Found')
    res.status(404).send(err)
    else
    next(err)
})

app.use((err,req,res,next)=>{
    if(err.code==='22P02'){
        res.status(400).send({msg:'Bad Request'})
    }
})

module.exports=app