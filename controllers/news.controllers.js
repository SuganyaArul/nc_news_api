const{fetchAllTopics,fetchAllEndpoints,fetchArticleByid,
    fetchAllArticles,fetchCommentsByArticleid,insertComments,insertArticle,
    insertTopic,updateArticles,removeComment,fetchUsers,fetchUserByUsername,
    updateComments} =require("../models/news.models")

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
    const {topic, sort_by, order} =req.query;
    fetchAllArticles(topic, sort_by, order).then((articles)=>{
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

exports.getUserByUsername=(req,res,next)=>{
    const username=req.params.username;
    fetchUserByUsername(username).then((user)=>{
        res.status(200).send({user})
    })
    .catch((err)=>{
        next(err)
    })
}

exports.patchComments=(req,res,next)=>{
    const id=req.params.comment_id;
    const newVote=req.body.inc_votes;
    updateComments(id,newVote).then((comment)=>{
        res.status(200).send({comment})
    })
    .catch((err)=>{
        next(err)
    })
}

exports.postArticles=(req,res,next)=>{
    const newArticle=req.body;
    insertArticle(newArticle).then((preparedArticle)=>{
        const article={...preparedArticle}
        article.comment_count=0;
        res.status(201).send({article})
    })
    .catch((err)=>{
        next(err)
    })
}

exports.postTopics=(req,res,next)=>{
    const topic=req.body;
    insertTopic(topic).then((topic)=>{
        res.status(201).send({topic})
    })
    .catch((err)=>{
        next(err)
    })
}