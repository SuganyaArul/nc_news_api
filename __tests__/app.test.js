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
        test('GET:200 /articles/2 Should respond with the particular article with required property',()=>{
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
        test('GET:200 /articles/2 Should respond with the particular article',()=>{
            return request(app).get('/api/articles/2').expect(200).then(({body})=>{
                const{article}=body;
                expect(article.author).toBe('icellusedkars')
                expect(article.title).toBe('Sony Vaio; or, The Laptop')
                expect(article.article_id).toBe(2)
                expect(article.body).toBe('Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.')
                expect(article.topic).toBe('mitch')
                expect(article.created_at).toBe('2020-10-16T05:03:00.000Z')
                expect(article.votes).toBe(0)
                expect(article.article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700')
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
        test('GET:200 /articles/1 Should respond with the comment_count property',()=>{
            return request(app).get('/api/articles/1').expect(200).then(({body})=>{
                expect(body.article).toHaveProperty('comment_count');
                expect(body.article.comment_count).toBe('11')
            })
        })
    })
    describe('/articles',()=>{
        test('GET:200 Should respond with array of article objects with correct datatypes',()=>{
            return request(app).get('/api/articles').expect(200).then(({body})=>{
                const {articles}=body;
                expect(body.articles).toHaveLength(13)
                if(body.articles.length!==0){
                articles.forEach((article)=>{
                    expect(article).toHaveProperty('author')
                    expect(article).toHaveProperty('title')
                    expect(article).toHaveProperty('article_id')
                    expect(article).toHaveProperty('topic')
                    expect(article).toHaveProperty('created_at')
                    expect(article).toHaveProperty('votes')
                    expect(article).toHaveProperty('article_img_url')
                    expect(article).toHaveProperty('comment_count')
                    expect(article).not.toHaveProperty('body')
                    expect(typeof article.author).toBe('string')
                    expect(typeof article.title).toBe('string')
                    expect(typeof article.article_id).toBe('number')
                    expect(typeof article.topic).toBe('string')
                    expect(typeof article.created_at).toBe('string')
                    expect(typeof article.votes).toBe('number')
                    expect(typeof article.article_img_url).toBe('string')
                    expect(typeof article.comment_count).toBe('string')
                    
                })
            }
            })
        })
        test('GET:200 Should respond with array of article objects sort by created_at and default descending order',()=>{
            return request(app).get('/api/articles').expect(200).then(({body})=>{
                expect(body.articles).toBeSortedBy('created_at',{descending:true})
            })
        })
        test('GET:200 Should respond with array of article objects sort by title in ascending order',()=>{
            return request(app).get('/api/articles?sort_by=title&order=asc').expect(200).then(({body})=>{
                expect(body.articles).toBeSortedBy('title',{ascending:true})
            })
        })
        test('GET:200 Should respond with article object for the given topic',()=>{
            return request(app).get('/api/articles?topic=mitch').expect(200).then(({body})=>{
                expect(body.articles).toHaveLength(12)
                if(body.articles !== 0){
                    body.articles.forEach((article)=>{
                        expect(article).toHaveProperty('comment_count')
                        expect(article).not.toHaveProperty('body')
                        expect(article).toHaveProperty('topic')
                        expect(article.topic).toBe('mitch')
                    })
                }
            })
        })
        test('GET:404 Should respond with NOT Found for non exist query',()=>{
            return request(app).get('/api/articles?topic=lee').expect(404).then(({body})=>{
                expect(body.msg).toBe('Not Found')
            })
        })
    })
    describe('/articles/:article_id/comments endpoints',()=>{
        test('GET:200 Should return array of comments for the given article_id',()=>{
            return request(app).get('/api/articles/3/comments').expect(200)
            .then(({body})=>{
                body.comments.forEach((comment)=>{
                    expect(comment).toHaveProperty('comment_id');
                    expect(comment).toHaveProperty('votes');
                    expect(comment).toHaveProperty('created_at');
                    expect(comment).toHaveProperty('author');
                    expect(comment).toHaveProperty('body');
                    expect(comment).toHaveProperty('article_id');
                    
                })
                expect(body.comments).toHaveLength(2);
                expect(body.comments[0]).toMatchObject({
                    body: "Ambidextrous marsupial",
                    votes: 0,
                    author: "icellusedkars",
                    article_id: 3,
                    created_at: '2020-09-19T23:10:00.000Z',
                  })
            })
        })
        test('GET:400 Should return Bad Request for non valid article_id',()=>{
            return request(app).get('/api/articles/non_exist/comments').expect(400).then(({body})=>{
                expect(body.msg).toBe('Bad Request')
            })
        })
        test('GET:404 Should return Not found for non exists article_id',()=>{
            return request(app).get('/api/articles/100/comments').expect(404).then(({body})=>{
                expect(body.msg).toBe('Articles Not Found')
            })
        })
        test('GET:200 Should return empty array for valid article_id but no comments detail',()=>{
            return request(app).get('/api/articles/2/comments').expect(200).then(({body})=>{
                expect(body.comments).toEqual([])
            })
        })
    })
    describe('POST /articles/:article_id/comments',()=>{
        test('POST:201 add comments for particular id',()=>{
            const comment={
                body: "Delicious pizza",
                username: "rogersop",
            }
            return request(app).post('/api/articles/2/comments').send(comment).expect(201).then(({body})=>{
                expect(body.comment).toMatchObject({
                    body: "Delicious pizza",
                    author: "rogersop",
                    article_id:2,
                    votes:0
                })
            })
        })
        test('POST:404 add comments with non exists author name should return Not Found error',()=>{
            const comment={
                body: "Delicious pizza",
                username: "george",
            }
            return request(app).post('/api/articles/2/comments').send(comment).expect(404).then(({body})=>{
                expect(body.msg).toBe('Not Found')
            })
        })
        test('POST:404 add comments with non exists article id should return Not Found error',()=>{
            const comment={
                body: "Delicious pizza",
                username: "george",
            }
            return request(app).post('/api/articles/20/comments').send(comment).expect(404).then(({body})=>{
                expect(body.msg).toBe('Not Found')
            })
        })
        test('POST:400 add comments should return Bad request if required key missed',()=>{
            const comment={
                body: "Delicious pizza",
               }
            return request(app).post('/api/articles/2/comments').send(comment).expect(400).then(({body})=>{
                expect(body.msg).toBe('Bad Request')
            })
        })
        test('POST:400 add comments with not valid article_id should return Bad request ',()=>{
            const comment={
                body: "Delicious pizza",
               }
            return request(app).post('/api/articles/invalid/comments').send(comment).expect(400).then(({body})=>{
                expect(body.msg).toBe('Bad Request')
            })
        })
        test('POST:400 add comments should return Bad request if request body not send',()=>{
            return request(app).post('/api/articles/2/comments').send().expect(400).then(({body})=>{
                expect(body.msg).toBe('Bad Request')
            })
        })
    })
    describe('PATCH /articles/:article_id',()=>{
        test('PATCH:200 should increment the vote by given votes ',()=>{
            const newVote={inc_votes:3}
            return request(app).patch('/api/articles/1').send(newVote).expect(200).then(({body})=>{
                expect(body.article).toMatchObject({
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: "2020-07-09T20:11:00.000Z",
                    votes: 103,
                    article_img_url:
                    "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
                })
            })
        })
        test('PATCH:200 should decrement the vote by given votes ',()=>{
            const newVote={inc_votes:-4}
            return request(app).patch('/api/articles/1').send(newVote).expect(200).then(({body})=>{
                expect(body.article).toMatchObject({
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: "2020-07-09T20:11:00.000Z",
                    votes: 96,
                    article_img_url:
                    "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
                })
            })
        })
        test('PATCH:400 should respond with bad request error for newVote not send ',()=>{
            const newVote={inc_votes:-4}
            return request(app).patch('/api/articles/1').expect(400).then(({body})=>{
                expect(body.msg).toBe('Bad Request')
            })
        })
        test('PATCH:400 should respond with bad request error for invalid id ',()=>{
            const newVote={inc_votes:-4}
            return request(app).patch('/api/articles/invalid').send(newVote).expect(400).then(({body})=>{
                expect(body.msg).toBe('Bad Request')
            })
        })
        test('PATCH:404 should respond with bad request error for valid id but not exist ',()=>{
            const newVote={inc_votes:-4}
            return request(app).patch('/api/articles/100').send(newVote).expect(404).then(({body})=>{
                expect(body.msg).toBe('Not Found')
            })
        })
    })
    describe('DELETE /comments/:comment_id',()=>{
        test('DELETE:204 /comments/2 Should respond with status and no body',()=>{
                return request(app).delete('/api/comments/2').expect(204)
        })
        test('DELETE:400 /comments/invalid Should respond with Bad request error for invalid id',()=>{
            return request(app).delete('/api/comments/invalid').expect(400).then(({body})=>{
                expect(body.msg).toBe('Bad Request')
            })
        })
        test('DELETE:404 /comments/200 Should respond with Not Found error for valid id but non exists',()=>{
            return request(app).delete('/api/comments/200').expect(404).then(({body})=>{
                expect(body.msg).toBe('Comments Not Found')
            })
        })
    })
    describe('GET /users endpoint',()=>{
        test('GET:200 Should respond with array of user object',()=>{
            return request(app).get('/api/users').expect(200).then(({body})=>{
                if(body.users.length !== 0){
                expect(body.users[0]).toMatchObject({
                    
                        username: 'butter_bridge',
                        name: 'jonny',
                        avatar_url:
                          'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
                      
                },
                {
                  username: 'icellusedkars',
                  name: 'sam',
                  avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'
                },
                {
                  username: 'rogersop',
                  name: 'paul',
                  avatar_url: 'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4'
                },
                {
                  username: 'lurker',
                  name: 'do_nothing',
                  avatar_url:
                    'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png'
                })
            }
            })
        })
    })
    describe('for wrong endpoint',()=>{
        test('GET:404 /topic Should get Not Found error for wrong endpoint',()=>{
            return request(app).get('/api/topic').expect(404);
        })
    })
    describe('GET /users/:username',()=>{
        test('GET:200 /users/icellusedkars Should repond with particular user object',()=>{
            return request(app).get('/api/users/icellusedkars').expect(200).then(({body})=>{
                expect(body.user).toHaveProperty('username',expect.any(String));
                expect(body.user).toHaveProperty('name',expect.any(String));
                expect(body.user).toHaveProperty('avatar_url',expect.any(String));
            })
        })
        test('GET:404 /users/sam Should repond with error message',()=>{
            return request(app).get('/api/users/sam').expect(404).then(({body})=>{
                expect(body.msg).toBe('Not Found')
            })
        })
    })
    describe('PATCH /comments/:comment_id',()=>{
        test('PATCH:200 Should increment the vote by given newVote',()=>{
            const newVote={inc_votes : 3}
            return request(app).patch('/api/comments/2').send(newVote).expect(200).then(({body})=>{
                expect(body.comment).toHaveProperty('body',expect.any(String))
                expect(body.comment).toHaveProperty('votes',expect.any(Number))
                expect(body.comment).toHaveProperty('author',expect.any(String))
                expect(body.comment.votes).toBe(17)
            })
        })
        test('PATCH:400 Should respond with Bad request for invalid id',()=>{
            const newVote={inc_votes : 3}
            return request(app).patch('/api/comments/invalid').send(newVote).expect(400).then(({body})=>{
                expect(body.msg).toBe('Bad Request')
            })
        })
        test('PATCH:400 Should respond with Bad request for newVote not send',()=>{
            const newVote={inc_votes : 3}
            return request(app).patch('/api/comments/3').send().expect(400).then(({body})=>{
                expect(body.msg).toBe('Bad Request')
            })
        })
        test('PATCH:404 Should respond with Not Found for valid id but not exists',()=>{
            const newVote={inc_votes : 3}
            return request(app).patch('/api/comments/390').send(newVote).expect(404).then(({body})=>{
                expect(body.msg).toBe('Not Found')
            })
        })
    })
})