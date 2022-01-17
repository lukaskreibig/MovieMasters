import { SafeAreaView, StyleSheet, Text, TextInput, View, Button, ActivityIndicator, Image, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery, useLazyQuery } from '@apollo/client';
import { PossibleTypeExtensionsRule } from 'graphql';

export default function Home() {

    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [saveMovie, setSaveMovie] = useState([]);
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

    {console.log(text)}

    const SEARCH_MOVIE = gql`
    query SearchMovies($userSearch: String!) {
        searchMovie(query: $userSearch)
        {movies
            {
                original_title, poster_path, overview, vote_average
            }
        }
    }`

    // const TestOne = useQuery(TEST).data
    // const TestMany = useQuery(UPCOMING_MOVIES).data



    // useEffect(() => {
    //     TestOne ? setSaveMovie(TestOne.movieDetail.movie.original_title) : null
    //     TestMany ? setUpcomingMovies(TestMany.upcomingMovies.movies) : null
    //   }, [TestOne, TestMany]);

        const [searchNow, {loading, error, data}] = useLazyQuery(SEARCH_MOVIE, {
            variables: {
                userSearch: text
            }
        })
    
        console.log(loading, error, data)

    const activateSearch = () => {
        setSearchActive(!searchActive);
        searchNow()
    }

    return (
        <ScrollView>
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
     
            {searchActive ? (
                <>
                    {/* <Text>
                        This one particular movie: {saveMovie}
                    </Text>
                    <Text>
                        Upcoming Movies: {upcomingMovies.map(movie => (
                            <Text style={styles.movies}> {movie.original_title} </Text>
                        ))}
                    </Text> */}
                    {!loading && data ? (
                    <Text>
                        {data.searchMovie.movies.map(movie => (
                            <View style={styles.movieThumb}> 
                            
                                    <Text style={styles.movies}> {movie.original_title} </Text>
                                    <Text style={styles.movies}>  {movie.vote_average}  </Text>

                                <Image
                                style={styles.poster}
                                source={{
                                uri: 'https://image.tmdb.org/t/p/w185'+movie.poster_path,
                                }}
                                />

                            </View>
                        ))}
                    </Text>
                    ) : (<ActivityIndicator />)}
                </>
            ) : (
                null
            )}
        </ScrollView>
    ); 
}

const styles = StyleSheet.create({
    searchContainer: {
        marginTop: 50,
        width: "100%",
        height: 90,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        paddingBottom: 10
    },
    input: {
    },
    button: {
        height: 40,
    },
    movies: {
    },
    poster: {
        width: 100,
        height: 150
    },
    movieThumb: {
        flexDirection: 'column',
        padding: 10,
        justifyContent: 'space-evenly',
        alignSelf: 'center',
        width: "30%",
    },

  });