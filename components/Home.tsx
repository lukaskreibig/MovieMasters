import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ActivityIndicator,
  Image,
  ScrollView,
  Pressable,
  Modal,
  ToastAndroid
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from 'react-native-root-toast'
import { gql, useLazyQuery } from "@apollo/client";
import NetInfo from "@react-native-community/netinfo";
import { withOrientation } from "react-navigation";
import { FlipInEasyX } from "react-native-reanimated";

export default function Home({ navigation }) {
  const [text, onChangeText] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [favourites, setFavourites] = useState<any>("");
  const [hideIt, setHide] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [isOffline, setOfflineStatus] = useState(null);

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
      userSearch: text,
    },
  });

  // console.log(loading, error, data)

  const activateSearch = () => {
    setSearchActive(!searchActive);
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
    isOffline ? showToast("Whoops, seems like you are Offline.") : showToast("You are connected to the Internet.")
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
      let hiddenMovies: any = data.filter((obj) => obj.hide == true);
      setHide(hiddenMovies);
    });
  }, []);

  return (
    <ScrollView>
      <View>
        {favourites ? (
          <Text>
            {favourites.map((movie) => (
              <View style={styles.movieThumb}>
                <Text style={styles.movies} numberOfLines={2}>
                  {movie.original_title}
                </Text>
                <Text style={styles.ratings}> {movie.vote_average} </Text>
                <Pressable
                  onPress={() =>
                    navigation.navigate("Detail", {
                      id: movie.id,
                      title: movie.original_title,
                      poster: movie.poster_path,
                      ratings: movie.vote_average,
                    })
                  }
                >
                  <Image
                    style={styles.poster}
                    source={{
                      uri:
                        "https://image.tmdb.org/t/p/w185" + movie.poster_path,
                    }}
                  />
                </Pressable>
              </View>
            ))}
          </Text>
        ) : (
          <ActivityIndicator />
        )}
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          placeholder="Movie Name"
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
              {data.searchMovie.movies
                .filter(
                  (obj) =>
                    !hideIt.some(
                      (hidden) => (hidden.hide ? hidden.id : null) === obj.id
                    )
                )
                .map((movie) => (
                  <View style={styles.movieThumb}>
                    <Text style={styles.movies} numberOfLines={2}>
                      {movie.original_title}
                    </Text>
                    <Text style={styles.ratings}>
                      {movie.vote_average ? movie.vote_average : "N/A"}
                    </Text>
                    <Pressable
                      onPress={() =>
                        navigation.navigate("Detail", {
                          id: movie.id,
                          title: movie.original_title,
                          poster: movie.poster_path,
                          ratings: movie.vote_average,
                        })
                      }
                    >
                      <Image
                        style={styles.poster}
                        source={
                          movie.poster_path
                            ? {
                                uri:
                                  "https://image.tmdb.org/t/p/w185" +
                                  movie.poster_path,
                              }
                            : require("../assets/not-available.jpg")
                        }
                      />
                    </Pressable>
                  </View>
                ))}
            </Text>
          ) : (
            <ActivityIndicator />
          )}
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    marginTop: 50,
    width: "100%",
    height: 90,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    paddingBottom: 10,
  },
  button: {
    height: 40,
  },
  movies: {
    height: 34,
    flexWrap: "wrap",
    textAlign: "center",
  },
  ratings: {
    height: 15,
  },
  poster: {
    width: 100,
    height: 150,
  },
  movieThumb: {
    flexDirection: "column",
    padding: 10,
    justifyContent: "space-evenly",
    alignItems: "center",
    alignSelf: "flex-end",
    height: 300,
    width: "30%",
  },
});
