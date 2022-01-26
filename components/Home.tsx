import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ActivityIndicator,
  ScrollView,
  Pressable,
  ImageBackground,
  Dimensions,
  SafeAreaView,
  TouchableOpacity
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from 'react-native-root-toast'
import { gql, useLazyQuery } from "@apollo/client";
import NetInfo from "@react-native-community/netinfo";

const windowHeight = Dimensions.get('window').height;

export default function Home({ navigation }) {
  const [text, onChangeText] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [favourites, setFavourites] = useState<any>("");
  const [hideIt, setHide] = useState();
  const [isOffline, setOfflineStatus] = useState<any>(null);
  const [textSearch, setTextSearch] = useState<string>("")

  const SEARCH_MOVIE = gql`
    query SearchMovies($userSearch: String!) {
      searchMovie(query: $userSearch) {
        movies {
          original_title
          poster_path
          overview
          vote_average
          id
        }
      }
    }
  `;

  const [searchNow, { loading, error, data }] = useLazyQuery(SEARCH_MOVIE, {
    variables: {
      userSearch: textSearch,
    },
  });

  // console.log(loading, error, data)

  const activateSearch = () => {
    setSearchActive(true);
    setTextSearch(text)
    searchNow();
  };

  function showToast(message:string) {
    Toast.show(message, {
        duration: Toast.durations.LONG,
      });
  }
  const unsubscribe = NetInfo.addEventListener(state => {

  !(state.isConnected && state.isInternetReachable) && !isOffline ? (setOfflineStatus(true))
  : (state.isConnected && state.isInternetReachable) && isOffline ? (setOfflineStatus(false)) : null

  },);

  useEffect(() => {
    isOffline ? showToast("Whoops, seems like you are Offline.") : (null)
    }, [isOffline]);

  const importData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const result = await AsyncStorage.multiGet(keys);
      return result.map((req) => JSON.parse(req[1]));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    importData().then((data) => {
      setFavourites(data);
      const hiddenMovies: any = data?.filter((obj) => obj.hide == true);
      setHide(hiddenMovies);
    });
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: "black" }}>
    <ScrollView style={styles.scrollview}>
      <View>
        <View style={styles.headlineContainer}>
          <Text style={styles.headline}>
            MovieMasters
          </Text>
        </View>
        {favourites ? (
          
        <>
          <Text style={styles.favText}> Favourites </Text>

          {favourites[0] ? (

          <Text>
            <ScrollView horizontal={true}>
            {favourites.map((movie:any, index:number) => (
              <View style={styles.favouriteThumb} key={index}>
                <Pressable
                  onPress={() =>
                    navigation.replace("Detail", {
                      id: movie.id,
                      title: movie.original_title,
                      poster: movie.poster_path,
                      ratings: movie.vote_average,
                      favourites: favourites
                    })
                  }
                >
                  <ImageBackground
                    style={styles.poster}
                    imageStyle={{ borderRadius: 8}}
                    source={{
                      uri:
                        "https://image.tmdb.org/t/p/w185" + movie.poster_path,
                    }} 
                  >
                    <Text style={styles.text} numberOfLines={3}>
                  {movie.original_title} {"\n"} IMDB: {movie.vote_average ? movie.vote_average : "N/A"}</Text>
                    </ImageBackground>
                </Pressable>
              </View>
            ))}
            </ScrollView>
          </Text>

        ) : (<Text style={styles.noFavourites}> No Favourites Yet </Text>)}
          </>
        ) : (
          <ActivityIndicator />
        )}
      </View>


      <View style={styles.searchContainer}>
        <>
          <Text style={styles.searchHeader}> Search </Text>
          <TextInput
            style={styles.searchField}
            onChangeText={onChangeText}
            placeholder="Movie Name..."
            placeholderTextColor="darkgrey" 
            value={text}
          />

          <TouchableOpacity onPress={() => {text ? activateSearch() : showToast("An Empty Search is not possible")}}>
            <Text style={styles.button}>
              Submit
            </Text>
          </TouchableOpacity>

        </>
      </View>

      {searchActive ? (
          !loading && data ? (
            <ScrollView horizontal={true}>
            <Text>
              {data.searchMovie.movies
                .filter(
                  (obj) =>
                    !hideIt.some(
                      (hidden) => (hidden.hide ? hidden.id : null) === obj.id
                    )
                )
                .map((movie:any, index:number) => (
                  <View style={styles.movieThumb} key={index}>
                    <Pressable
                      onPress={() =>
                        navigation.replace("Detail", {
                          id: movie.id,
                          title: movie.original_title,
                          poster: movie.poster_path,
                          ratings: movie.vote_average,
                          favourites: favourites
                        })
                      }
                    >

                    <ImageBackground
                    style={styles.posterSearch}
                    imageStyle={{ borderRadius: 8}}
                    source={
                      movie.poster_path
                        ? {
                            uri:
                              "https://image.tmdb.org/t/p/w185" +
                              movie.poster_path,
                          }
                        : require("../assets/not-available.jpg")
                    }
                  >
                    <Text style={styles.textSearch} numberOfLines={3}>
                  {movie.original_title} {"\n"} IMDB: {movie.vote_average ? movie.vote_average : "N/A"}</Text>
                    </ImageBackground> 



                    </Pressable>
                  </View>
                ))}
            </Text>
            </ScrollView>
          ) : (
            <View>
              <ActivityIndicator size={"large"} style={styles.activityIndicator} />
            </View>
          )
      ) : <Text style={styles.noFavourites}> Use the Search to find Movies </Text>}
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollview: {
    backgroundColor: "black",
    height: "100%",
  },
  favText: {
    color: "white",
    paddingBottom: 20,
    paddingTop: 20,
    fontSize: 25,
    fontWeight: "200",
  },
    text: {  
    color: "white",
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "300",
    textAlign: "center",
    backgroundColor: "#000000c0",
    },
    noFavourites: {
      color: "white",
      alignSelf: "center",
      paddingTop: 60,
      height: windowHeight / 4.8,
      fontSize: 25,
      fontWeight: "200",
      fontStyle: "italic"
    },
  textSearch: {  
    color: "white",
    fontSize: 20,
    lineHeight: 30,
    fontWeight: "300",
    textAlign: "center",
    backgroundColor: "#000000c0",
  },
  headlineContainer: {
    marginTop: 0,
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
  },
  headline: {
    fontSize: 50,
    fontWeight: "100",
    color: "white"
  },
  searchContainer: {
    width: "100%",
    height: 90,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",
    paddingBottom: 10,
  },
  searchHeader: {
    color: "white",
    fontSize: 25,
    fontWeight: "200",
  },
  searchField: {
    color: "white",
    fontSize: 20,
    fontWeight: "200",
    width: "50%",
    borderWidth: 2,
    padding: 7,
    borderColor: "darkgrey",
    borderRadius: 10
  },
  button: {
    color: "white",
    fontSize: 20,
    fontWeight: "200",
  },
  input: {
    textAlign: "center",
    fontSize: 20,
    color: "white"
  },
  movies: {
    height: 34,
    flexWrap: "wrap",
    textAlign: "center",
    fontWeight: "600",
    color: "white",
  },
  ratings: {
    height: 15,
    fontWeight: "300",
    color: "white"
  },
  poster: {
    width: windowHeight / 7.2,
    height: windowHeight / 4.8,
    justifyContent: "flex-end",
  },
  posterSearch: {
    width: windowHeight / 3.6,
    height: windowHeight / 2.4,
    justifyContent: "flex-end",
  },
  favouriteThumb: {
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  movieThumb: {
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  activityIndicator: {
    height: windowHeight / 4.8,
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
    alignContent: "center"
  }
});
