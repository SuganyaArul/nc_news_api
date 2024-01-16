const db=require("../db/connection")
const fs=require("fs/promises")

exports.fetchAllTopics=()=>{
    return db.query(`SELECT * FROM topics`).then((result)=>{
        return result.rows
    })
    
}

exports.fetchAllEndpoints=()=>{
     return fs.readFile('./endpoints.json','utf-8').then((endpoints)=>{
        return JSON.parse(endpoints)
     }).catch((err)=>{
        return {msg:'No such files'}
     })
    
}

exports.fetchArticleByid=(id)=>{
    return db.query(`SELECT * FROM articles WHERE article_id=$1;`,[id]).then((result)=>{
        if(result.rows.length===0){
            return Promise.reject({msg:'Not Found'})
        }
        return result.rows[0];
    })
    
}

exports.fetchAllArticles=async()=>{
    const response=await db.query(`SELECT * FROM articles ORDER BY created_at desc`)
        const articles=response.rows;
        const preparedArticles=articles.map(async(article)=>{
            const newArticle={...article}
            const countResult=await db.query (`SELECT COUNT(body) FROM comments WHERE article_id=${newArticle.article_id}`)
            newArticle.comment_count=countResult.rows[0].count
            delete newArticle.body
            return newArticle;
        })
        const formattedArticles=await Promise.all(preparedArticles)
        return formattedArticles;
    
}

exports.fetchCommentsByArticleid=(id)=>{
    return db.query(`SELECT * FROM COMMENTS WHERE article_id=$1 ORDER BY created_at desc`,[id]).then(({rows})=>{
        return rows;
    })
}

exports.insertComments=(id,commentData)=>{
    return db.query(`INSERT INTO comments(body,author,article_id) VALUES($1,$2,$3) RETURNING *;`,[commentData.body,commentData.username,id]).then(({rows})=>{
        return rows[0];
    })
}

exports.updateArticles=(id,newVote)=>{
    return db.query(`UPDATE articles SET votes=votes+$1 WHERE article_id=$2 RETURNING *`,[newVote,id]).then(({rows})=>{
        if(rows.length===0){
            return Promise.reject({msg:'Not Found'})
        }
        return rows[0];
    })
}

