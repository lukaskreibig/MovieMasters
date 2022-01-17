import { SafeAreaView, StyleSheet, Text, TextInput, View, Button } from 'react-native';
import { useEffect, useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery, QueryResult } from '@apollo/client';

export default function Home() {

    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [saveMovie, setSaveMovie] = useState([]);
    const [searchMovie, setSearchMovie] = useState([]);
    const [text, onChangeText] = useState('');
    const [searchActive, setSearchActive] = useState(false);

    // const TEST = gql`
    // query TestMovie {
    // movieDetail(id:40336) 
    // {
    // movie
    //     {original_title}
    // }
    // }
    // `

    // const UPCOMING_MOVIES = gql`
    // query UpcomingMovies {
    //     upcomingMovies
    //         {movies
    //             {original_title}
    //         }
    //     }
    // `

    const SEARCH_MOVIE = gql`
    query SearchMovies {
        searchMovie(query: "Terminator")
        {movies
            {
                original_title
            }
        }
    }`

    // const TestOne = useQuery(TEST).data
    // const TestMany = useQuery(UPCOMING_MOVIES).data
    const TestSearch = useQuery(SEARCH_MOVIE).data

    // useEffect(() => {
    //     TestOne ? setSaveMovie(TestOne.movieDetail.movie.original_title) : null
    //     TestMany ? setUpcomingMovies(TestMany.upcomingMovies.movies) : null
    //   }, [TestOne, TestMany]);

      useEffect(() => {
        TestSearch ? setSearchMovie(TestSearch) : null
      }, [TestSearch])

    const activateSearch = () => {
        !setSearchActive
    }

    return (
        <>
            <View
                style={styles.searchContainer}
            >
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeText}
                    placeholder='Movie Name'
                    value={text}
                />

                <Button
                    style={styles.button}
                    onPress={activateSearch}
                    title="Search"
                    color="#841584"
                    accessibilityLabel="Learn more about this purple button"
                />
            </View>
     
            {!searchActive ? (
                <>
                    {/* <Text>
                        This one particular movie: {saveMovie}
                    </Text>
                    <Text>
                        Upcoming Movies: {upcomingMovies.map(movie => (
                            <Text style={styles.movies}> {movie.original_title} </Text>
                        ))}
                    </Text> */}
                    {searchMovie ? (
                    <Text>
                        Search {searchMovie.searchMovie.movies.map(movie => (
                            <Text style={styles.movies}> {movie.original_title} </Text>
                        ))}
                    </Text>
                    ) : null}
                </>
            ) : (
                null
            )}
        </>
    ); 
}

const styles = StyleSheet.create({
    searchContainer: {
        width: "100%",
        height:90,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        paddingBottom: 10
    },
    input: {
    },
    button: {
    height: 20
    },
    movies: {
    },
  });