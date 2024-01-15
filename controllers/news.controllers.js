const{fetchAllTopics,fetchAllEndpoints,fetchArticleByid} =require("../models/news.models")

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