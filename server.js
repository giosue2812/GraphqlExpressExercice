const express = require('express');
const {
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString} = require ("graphql");
const app = express();
const port = 3000;
const movies = require ('./data');

const {graphqlHTTP} = require ("express-graphql");

const MovieType = new GraphQLObjectType({
    name:'Movie',
    description:'Ceci represente un film',
        fields:() => ({
        id:{type:GraphQLNonNull(GraphQLInt)},
        movie:{type:GraphQLNonNull(GraphQLString)},
        producerId:{type:GraphQLNonNull(GraphQLInt)},
        producer:{
            type:ProducerType,
            resolve:(movie)=>{
                return movies.producer.find(p => p.id === movie.producerId)
            }
        }
    })
});

const ProducerType = new GraphQLObjectType({
    name:'Producer',
    description:'Ceci represente un producer',
    fields:() => ({
        id:{type:GraphQLNonNull(GraphQLInt)},
        producer:{type:GraphQLNonNull(GraphQLString)}
    })
});

const RootMutationType =
    new GraphQLObjectType({
        name:'Mutation',
        description:'Root Mutation',
        fields:()=>({
            addMovie:{
                type:MovieType,
                description:'Add a movie',
                args:{
                    movie:{type:GraphQLNonNull(GraphQLString)},
                    producerId:{type:GraphQLNonNull(GraphQLInt)}
                },
                resolve:(source,args)=>{
                    const movie = {id:movies.movies.length + 1,movie:args.movie,producer:args.producerId};
                    console.log(movie);
                    movies.movies.push(movie);
                    return movie;
                }
            }
        })
    });

const RootQueryType =
    new GraphQLObjectType({
        name:'Query',
        description:'Root Query',
        fields:() => ({
            movies:{
                type:GraphQLList(MovieType),
                description:'La liste des films',
                resolve:()=> movies.movies
            },
            movie:{
                type:MovieType,
                description:'Un film',
                args:{
                    id:{type:GraphQLNonNull(GraphQLInt)}
                },
                resolve:(movie,args)=>
                    movies.movies.find(m=>
                        m.id === args.id
                    )
            }
        })
    });

const schema = new GraphQLSchema({
    query:RootQueryType,
    mutation:RootMutationType
});

app.use('/graphql',graphqlHTTP({
    schema:schema
}));

app.listen(port, ()=> {
    console.log(`Listen at http://localhost:${port}`);
});
