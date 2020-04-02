const graphql = require("graphql");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList
} = graphql;

const Movies = require("../models/movie");
const Directors = require("../models/director");

// const movies = [
//   { id: "1", name: "Pulp Fiction", genre: "Crime", directorId: "1" },
//   { id: "2", name: "1984", genre: "Sci-Fi", directorId: "2" },
//   { id: "3", name: "V for vendetta", genre: "Sci-Fi-Triller", directorId: "3" },
//   { id: "4", name: "Snatch", genre: "Crime-Comedy", directorId: "4" },
//   { id: "5", name: "Reservoir Dogs", genre: "Crime", directorId: "1" },
//   { id: "6", name: "The Hateful Eight", genre: "Crime", directorId: "1" },
//   { id: "7", name: "Inglourious Basterds", genre: "Crime", directorId: "1" },
//   {
//     id: "7",
//     name: "Lock, Stock and Two Smoking Barrels",
//     genre: "Crime-Comedy",
//     directorId: "4"
//   }
// ];

// const directors = [
//   { id: "1", name: "Quentin Tarantino", age: 55 },  //5e85c92c9bd6cd3ccc7da132
//   { id: "2", name: "Michael Radford", age: 72 }, //5e85c9555b94273ccc9ad41a
//   { id: "3", name: "James McTeigue", age: 51 }, //5e85c9605b94273ccc9ad41b
//   { id: "4", name: "Guy Ritchie", age: 50 } //5e85c96b5b94273ccc9ad41c
// ];

const MovieType = new GraphQLObjectType({
  name: "Movie",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    director: {
      type: DirectorType,
      resolve(parent, args) {
        return Directors.findById(parent.directorId);
      }
    }
  })
});

const DirectorType = new GraphQLObjectType({
  name: "Director",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    movies: {
      type: new GraphQLList(MovieType),
      resolve(parent, args) {
        return Movies.find({ directorId: parent.id });
      }
    }
  })
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addDirector: {
      type: DirectorType,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt }
      },
      resolve(parent, args) {
        const director = new Directors({
          name: args.name,
          age: args.age
        });
        return director.save();
      }
    },
    addMovie: {
      type: MovieType,
      args: {
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        directorId: { type: GraphQLID }
      },
      resolve(parent, args) {
        const movie = new Movies({
          name: args.name,
          genre: args.genre,
          directorId: args.directorId
        });
        return movie.save();
      }
    },
    removeDirector: {
      type: DirectorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
       return Directors.findByIdAndRemove(args.id)
      }
    },
    removeMovie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
       return Movies.findByIdAndRemove(args.id)
      }
    }
  }
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
        return Movies.findById(args.id);
      }
    },
    director: {
      type: DirectorType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Directors.findById(args.id);
      }
    },
    movies: {
      type: new GraphQLList(MovieType),
      resolve(parent, args) {
        return Movies.find({});
      }
    },
    directors: {
      type: new GraphQLList(DirectorType),
      resolve(parent, args) {
        return Directors.find({});
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});
 