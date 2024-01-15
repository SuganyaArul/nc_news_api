const{fetchAllTopics,fetchAllEndpoints} =require("../models/news.models")

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
        console.log(endpoints,'contr');
        return res.status(200).send({endpoints})
    })
    .catch((err)=>{
        next(err)
    })
}