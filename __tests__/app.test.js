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
    describe('for wrong endpoint',()=>{
        test('GET:404 /topic Should get Not Found error for wrong endpoint',()=>{
            return request(app).get('/api/topic').expect(404);
        })
    })
    
})