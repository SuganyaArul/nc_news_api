const app=require("../app")
const request=require("supertest")
const db=require("../db/connection");
const testData=require("../db/data/test-data");
const seed = require("../db/seeds/seed");

//This will end the connection 
afterAll(()=>{
    return db.end();
})

//seeding our test data
beforeEach(()=>{
    return seed(testData);
})

describe('/api',()=>{
    describe('/topics endpoint',()=>{
        test('GET:200 /topics Should respond with array of topics object',()=>{
                return request(app).get('/api/topics').expect(200)
                .then(({body})=>{
                    const {topics}=body;
                    topics.forEach((topic)=>{
                        expect(topic).toHaveProperty('slug');
                        expect(topic).toHaveProperty('description')
                    })
                    expect(topics).toHaveLength(3)
                })
        })
        
    })
    describe('/api endpoints',()=>{
        test('Should respond with all the endpoints',()=>{
            return request(app).get('/api').expect(200).then(({body})=>{
                const {endpoints} = body;
                expect(endpoints).toHaveProperty('GET /api')
                expect(endpoints).toHaveProperty('GET /api/topics')
            })
        })
    })
    describe('/articles/:article_id',()=>{
        test('GET:200 /articles/2 Should respond with the particular article',()=>{
            return request(app).get('/api/articles/2').expect(200).then(({body})=>{
                const{article}=body;
                expect(article).toHaveProperty('author')
                expect(article).toHaveProperty('title')
                expect(article).toHaveProperty('article_id')
                expect(article).toHaveProperty('body')
                expect(article).toHaveProperty('topic')
                expect(article).toHaveProperty('created_at')
                expect(article).toHaveProperty('votes')
                expect(article).toHaveProperty('article_img_url')
            })
        })
        test('GET:404 /articles/100 Should respond with error message not found',()=>{
            return request(app).get('/api/articles/50').expect(404)
        })
        test('GET:400 /articles/id should respond with bad request',()=>{
            return request(app).get('/api/articles/id').expect(400).then(({body})=>{
                expect(body.msg).toBe('Bad Request')
            })
        })
    })
    describe('for wrong endpoint',()=>{
        test('GET:404 /topic Should get Not Found error for wrong endpoint',()=>{
            return request(app).get('/api/topic').expect(404);
        })
    })
    
})