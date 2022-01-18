import {  StyleSheet, Text, TextInput, View, Button, ActivityIndicator, Image, ScrollView, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery, useLazyQuery } from '@apollo/client';

export default function Home({navigation}) {

    const [text, onChangeText] = useState('');
    const [searchActive, setSearchActive] = useState(false);
    const [favourites, setFavourites] = useState<any>("")
    const [hide, setHide] = useState()


    const SEARCH_MOVIE = gql`
    query SearchMovies($userSearch: String!) {
        searchMovie(query: $userSearch)
        {movies
            {
                original_title, poster_path, overview, vote_average, id
            }
        }
    }`


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


    const getData = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem('@favourites')
          return jsonValue != null ? JSON.parse(jsonValue) : null;
        }
        catch(e) {
            alert('Failed to fetch the data from storage')
        }
      }

      const importData = async () => {
        try {
          const keys = await AsyncStorage.getAllKeys();
          const result = await AsyncStorage.multiGet(keys);
           return result.map(req => JSON.parse(req[1]))
        } catch (error) {
          console.error(error)
        }
      }


    useEffect(() => {
        importData().then(data => {
            setFavourites(data); 
            console.log[data];
            const hiddenMovies = Object.fromEntries(
                Object.entries(data).filter(([key, value]) => key === "hide" && value === true) )
                console.log("HiddenMovies", hiddenMovies)
             // filteredByValue = {V: 5} 
            
            // setHide(data); 
            // console.log("Typeof", typeof data);
            // let hiddenMovies = data.filter(obj => console.log("filterobj", obj));
            // console.log("hiddenMovies after filtering", hiddenMovies);
            // setHide(hiddenMovies)
            // console.log("Hide is this now", hide)
            // console.log(typeof hide)
        
        
        })   
    }, [])

    useEffect(() => {
        // console.log(favourites)
    })

    return (
        <ScrollView>
            <View> 
            {favourites ? (
                    <Text>
                            {favourites.filter(movie => movie.hide != true).map(movie => (

                            <View style={styles.movieThumb}> 
                                    <Text style={styles.movies} numberOfLines={2}> {movie.original_title} </Text>
                                    <Text style={styles.ratings}>  {movie.vote_average}  </Text>
                                <Pressable onPress={() =>
                                    navigation.navigate('Detail', { id: movie.id, title: movie.original_title, poster: movie.poster_path, ratings: movie.vote_average })
                                }>
                                    <Image
                                    style={styles.poster}
                                    
                                    source={{
                                    uri: 'https://image.tmdb.org/t/p/w185'+movie.poster_path,
                                    }}
                                    />
                                </Pressable>
                            </View>
                        ))}
                    </Text>
                    ) : (<ActivityIndicator />)}
            </View>

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
                    onPress={text ? activateSearch : null}
                    title="Search"
                    color="#841584"
                    accessibilityLabel="Learn more about this purple button"
                />
            </View>
     
            {searchActive ? (
                <>
                    {!loading && data ? (
                    <Text>
                        {data.searchMovie.movies.map(movie => (
                            <View style={styles.movieThumb}> 
                                    <Text style={styles.movies} numberOfLines={2}> {movie.original_title} </Text>
                                    <Text style={styles.ratings}>  {movie.vote_average}  </Text>
                                <Pressable onPress={() =>
                                    navigation.navigate('Detail', { id: movie.id, title: movie.original_title, poster: movie.poster_path, ratings: movie.vote_average })
                                }>
                                    <Image
                                    style={styles.poster}
                                    
                                    source={{
                                    uri: 'https://image.tmdb.org/t/p/w185'+movie.poster_path,
                                    }}
                                    />
                                </Pressable>
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
        height: 34,
        flexWrap: 'wrap',
        textAlign: 'center'
    },
    ratings: {
        height: 15,
    },
    poster: {
        width: 100,
        height: 150,
    },
    movieThumb: {
        flexDirection: 'column',
        padding: 10,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        alignSelf: 'flex-end',
        height: 300,
        width: "30%",
    },

  });