const express=require("express");
const app=express();
const{getTopics,getEndpoints,getArticleById,
    getArticles,getCommentsByArticleid,postComments,
    patchArticles,deleteComment,getUsers,getUserByUsername,
    patchComments}=require("./controllers/news.controllers")

app.use(express.json());

app.get('/api/topics',getTopics);

app.get('/api',getEndpoints);

app.get('/api/articles/:article_id',getArticleById);

app.get('/api/articles',getArticles);

app.get('/api/articles/:article_id/comments',getCommentsByArticleid);

app.post('/api/articles/:article_id/comments',postComments);

app.patch('/api/articles/:article_id',patchArticles);

app.delete('/api/comments/:comment_id',deleteComment);

app.get('/api/users',getUsers);

app.get('/api/users/:username',getUserByUsername);

app.patch('/api/comments/:comment_id',patchComments);

app.use((err,req,res,next)=>{
    if(err.msg==='No such files'||err.msg==='Not Found')
    res.status(404).send({msg:'Not Found'})
    else if(err.msg==='Articles Not Found' || err.msg==='Comments Not Found')
    res.status(404).send(err)
    else
    next(err)
})

app.use((err,req,res,next)=>{
    if(err.code==='22P02' || err.code==='23502'){
        res.status(400).send({msg:'Bad Request'})
    }else if(err.code==='23503'){
        res.status(404).send({msg:'Not Found'})
    }
})

module.exports=app