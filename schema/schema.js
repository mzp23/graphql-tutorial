const graphql = require("graphql");

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt } = graphql;

const movies = [
  { id: "1", name: "Pulp Fiction", genre: "Crime", directorId: '5' },
  { id: "2", name: "1984", genre: "Sci-Fi", directorId: '6' },
  { id: 3, name: "V for vendetta", genre: "Sci-Fi-Triller", directorId: '7' },
  { id: 4, name: "Snatch", genre: "Crime-Comedy", directorId: '8' }
];

const directors = [
  { id: '5', name: 'Quentin Tarantino', age: 55},
  { id: '6', name: 'Michael Radford', age: 72},
  { id: '7', name: 'James McTeigue', age: 51},
  { id: '8', name: 'Guy Richie', age: 50},
]

const MovieType = new GraphQLObjectType({
  name: "Movie",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    director: {
      type: DirectorType,
      resolve(parent, args) {
        return directors.find(director => director.id == parent.directorId);
      }
    }
  })
});

const DirectorType = new GraphQLObjectType({
  name: "Director",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt }
  })
});

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    movie: {
      type: MovieType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args) {
        return movies.find(movie => movie.id == args.id);
      }
    },
    director: {
      type: DirectorType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args) {
        return directors.find(director => director.id == args.id);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: Query
});
