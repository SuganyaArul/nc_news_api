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
    response=await db.query(`SELECT * FROM articles ORDER BY created_at desc`)
        const articles=response.rows;
        preparedarticles=articles.map(async(article)=>{
            const newarticle={...article}
            countResult=await db.query (`SELECT COUNT(body) FROM comments WHERE article_id=${newarticle.article_id}`)
            newarticle.comment_count=countResult.rows[0].count
            delete newarticle.body
            return newarticle;
        })
        const formattedarticles=await Promise.all(preparedarticles)
        return formattedarticles;
    
}

