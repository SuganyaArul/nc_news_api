const{fetchAllTopics,fetchAllEndpoints,fetchArticleByid,
    fetchAllArticles,fetchCommentsByArticleid,insertComments,
    updateArticles,removeComment,fetchUsers} =require("../models/news.models")

const {checkArticleidExists,checkCommentIdExists}=require('../db/checkId')

exports.getTopics=(req,res,next)=>{
    fetchAllTopics().then((topics)=>{
        return res.status(200).send({topics});
    })
    .catch((err)=>{
        next(err);
    })
}

exports.getEndpoints=(req,res,next)=>{
    fetchAllEndpoints().then((endpoints)=>{
        return res.status(200).send({endpoints})
    })
    .catch((err)=>{
        next(err)
    })
}

exports.getArticleById=(req,res,next)=>{
    const id=req.params.article_id;
    fetchArticleByid(id).then((article)=>{
        return res.status(200).send({article})
    })
    .catch((err)=>{
        next(err)
    })
}

exports.getArticles=(req,res,next)=>{
    const {topic} =req.query;
    fetchAllArticles(topic).then((articles)=>{
        return res.status(200).send({articles})
    })
    .catch((err)=>{
        next(err)
    })
}

exports.getCommentsByArticleid=(req,res,next)=>{
    const id=req.params.article_id;
    const fetchCommentsQuery=fetchCommentsByArticleid(id);
    const existCheck=checkArticleidExists(id);
    Promise.all([fetchCommentsQuery,existCheck]).then((response)=>{
        const comments=response[0]
        res.status(200).send({comments})
    })
    .catch((err)=>{
        next(err)
    })
}

exports.postComments=(req,res,next)=>{
    const id=req.params.article_id;
    const commentData=req.body;
    insertComments(id,commentData).then((comment)=>{
        res.status(201).send({comment})
    })
    .catch((err)=>{
        next(err)
    })
}

exports.patchArticles=(req,res,next)=>{
    const id=req.params.article_id;
    const newVote=req.body.inc_votes;
    updateArticles(id,newVote).then((article)=>{
        res.status(200).send({article})
    })
    .catch((err)=>{
        next(err)
    })
}

exports.deleteComment=(req,res,next)=>{
    const id=req.params.comment_id;
    const idExistCheck=checkCommentIdExists(id);
    Promise.all([removeComment(id),idExistCheck]).then(()=>{
        res.status(204).send();
    })
    .catch((err)=>{
        next(err)
    })
}

exports.getUsers=(req,res,next)=>{
    fetchUsers().then((users)=>{
        res.status(200).send({users})
    })
    .catch((err)=>{
        next(err)
    })
}