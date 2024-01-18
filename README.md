# NC_NEWS_API Backend Software Development Project

I completed this project as part of Northcoders Software Developement Bootcamp. In this project, I build an API(HTTP endpoints using express) to access news articles,topics,comments etc., for client to view data and used psql database for storing news data. It is live now with database hosted on ElephantSQL and deployed on Render at https://first-project-svt2.onrender.com/api where you can find all the endpoints and its behaivour.

This project is developed and tested using TDD(TestDrivenDevelopment) process using jest, supertest and reviewed by Northcoders Senior Developer.

# INSTRUCTIONS TO SETUP 

The code for this project will available in [this GitHub Repo](https://github.com/SuganyaArul/nc_news_api) 

1.To clone using the git command

```
git clone https://github.com/SuganyaArul/nc_news_api
```
2.To install npm package

```
npm install
```
3.Create 3 .env files ie, .env.development , .env.test and .env.production for this project as this contains confidential details its not pushed into repo. Into each .env files add

```
PGDATABASE=database_name (see /db/setup.sql for the database names)
```
4.Command for seeding data

```
npm run setup-dbs
npm run seed
```
5.To deploy database locally and check API

```
npm start
```


# Minimum Version Requirement

1. Node v16.20.2
2. Postgres v16.1