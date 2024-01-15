const{fetchAllTopics} =require("../models/ncnews.models")

exports.getTopics=(req,res,next)=>{
    fetchAllTopics().then((topics)=>{
        return res.status(200).send({topics});
    })
    .catch((err)=>{
        next(err);
    })
}