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
    return db.query(`SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id=comments.article_id WHERE articles.article_id=$1 GROUP BY articles.article_id;`,[id]).then((result)=>{
        if(result.rows.length===0){
            return Promise.reject({msg:'Not Found'})
        }
        return result.rows[0];
    })
    
}

exports.fetchAllArticles=async(topic)=>{
    let sqlQuery=`SELECT articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, articles.article_id , COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id=comments.article_id`

    const parameter=[];
    if(topic){
        sqlQuery+=` WHERE articles.topic=$1`
        parameter.push(topic)
    }
    
    sqlQuery+=` GROUP BY articles.article_id ORDER BY created_at desc;`
    const response=await db.query(sqlQuery,parameter)
    if(response.rows.length===0){
        return Promise.reject({msg:'Not Found'})
    }
         return response.rows;
    
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

exports.removeComment=(id)=>{
    return db.query(`DELETE FROM comments WHERE comment_id=$1`,[id]).then(({rows})=>{
        return rows
    })
}

exports.fetchUsers=()=>{
    return db.query(`SELECT * FROM users`).then(({rows})=>{
        return rows
    })
}

