const db=require('./connection')

exports.checkArticleidExists=(id)=>{
    return db.query(`SELECT * FROM articles WHERE article_id=$1`,[id]).then(({rows})=>{
        if(rows.length===0){
            return Promise.reject({msg:'Articles Not Found'})
        }
    })
}

exports.checkCommentIdExists=(id)=>{
    return db.query(`SELECT * FROM comments WHERE comment_id=$1`,[id]).then(({rows})=>{
        if(rows.length===0){
            return Promise.reject({msg:'Comments Not Found'})
        }
    })
}