import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery, QueryResult } from '@apollo/client';

export default function Home() {

    const [upcomingMovies, setUpcomingMovies] = useState([])
    const [saveMovie, setSaveMovie] = useState([])

    const TEST = gql`
    query TestMovie {
    movieDetail(id:40336) 
    {
    movie
        {original_title}
    }
    }
    `

    const UPCOMING_MOVIES = gql`
    query UpcomingMovies {
        upcomingMovies
            {movies
                {original_title}
            }
        }
    `

    const SEARCH_MOVIE = gql`
    query SearchMovies {
        searchMovie(query: "Terminator")
        {movies
            {
                original_title
            }
        }
    }`

    const TestOne = useQuery(TEST).data
    const TestMany = useQuery(UPCOMING_MOVIES).data

    useEffect(() => {
        TestOne ? setSaveMovie(TestOne.movieDetail.movie.original_title) : null
        TestMany ? setUpcomingMovies(TestMany.upcomingMovies.movies) : null
      }, [TestOne, TestMany]);

    return (
        <>
        <Text>
            This one particular movie: {saveMovie}
        </Text>
        <Text>
            Upcoming Movies: {upcomingMovies.map(movie => (
                <Text style={styles.movies}> {movie.original_title} </Text>
            ))}
        </Text>
        <Text>
            
        </Text>
        </>
    );

}

const styles = StyleSheet.create({
    movies: {
      flex: 1,
      width: "100%",
      padding: 10,
    }
  });