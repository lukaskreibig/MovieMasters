import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-root-toast";
import { gql, useLazyQuery } from "@apollo/client";
import NetInfo from "@react-native-community/netinfo";
import Movie from "./Movie";

const windowHeight = Dimensions.get("window").height;

export default function Home({ navigation }: any) {
  const [text, onChangeText] = useState<string>("");
  const [searchActive, setSearchActive] = useState<boolean>(false);
  const [favourites, setFavourites] = useState<any>("");
  const [hideIt, setHide] = useState<any>();
  const [isOffline, setOfflineStatus] = useState<boolean | null>(null);
  const [textSearch, setTextSearch] = useState<string>("");

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

  const [searchNow, { loading, data }] = useLazyQuery(SEARCH_MOVIE, {
    variables: {
      userSearch: textSearch,
    },
  });

  const activateSearch = (): void => {
    setSearchActive(true);
    setTextSearch(text);
    searchNow();
  };

  function showToast(message: string) {
    Toast.show(message, {
      duration: Toast.durations.LONG,
    });
  }
  const unsubscribe = NetInfo.addEventListener((state) => {
    !(state.isConnected && state.isInternetReachable) && !isOffline
      ? setOfflineStatus(true)
      : state.isConnected && state.isInternetReachable && isOffline
      ? setOfflineStatus(false)
      : null;
  });

  useEffect((): void => {
    isOffline ? showToast("Whoops, seems like you are Offline.") : null;
  }, [isOffline]);

  const importData = async (): Promise<any> => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const result = await AsyncStorage.multiGet(keys);
      return result.map((req) => JSON.parse(req[1]));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() :void =>  {
    importData().then((data) => {
      setFavourites(data);
      const hiddenMovies: any = data?.filter(
        (obj: { hide: boolean }) => obj.hide == true
      );
      setHide(hiddenMovies);
    });
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: "black" }}>
      <ScrollView style={styles.scrollview}>
        <View>
          <View style={styles.headlineContainer}>
            <Text style={styles.headline}>MovieMasters</Text>
          </View>
          {favourites ? (
            <>
              <Text style={styles.favText}> Favourites </Text>

              {favourites[0] ? (
                <Movie
                  data={favourites}
                  hideIt={"favourite"}
                  favourites={favourites}
                  navigation={navigation}
                />
              ) : (
                <Text style={styles.noFavourites}> No Favourites Yet </Text>
              )}
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

            <TouchableOpacity
              onPress={() => {
                text
                  ? activateSearch()
                  : showToast("An Empty Search is not possible");
              }}
            >
              <Text style={styles.button}>Submit</Text>
            </TouchableOpacity>
          </>
        </View>

        {searchActive ? (
          !loading && data ? (
            <Movie
              data={data}
              hideIt={hideIt}
              favourites={favourites}
              navigation={navigation}
            />
          ) : (
            <View>
              <ActivityIndicator
                size={"large"}
                color="white"
                style={styles.activityIndicator}
              />
            </View>
          )
        ) : (
          <Text style={styles.noFavourites}>
            {" "}
            Use the Search to find Movies{" "}
          </Text>
        )}
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
    fontSize: Platform.OS === "android" ? 20 : 25,
    fontWeight: Platform.OS === "android" ? "normal" : "200",
  },
  noFavourites: {
    color: "white",
    alignSelf: "center",
    paddingTop: 60,
    height: windowHeight / 4.8,
    fontSize: Platform.OS === "android" ? 20 : 25,
    fontWeight: Platform.OS === "android" ? "normal" : "200",
    fontStyle: "italic",
  },
  headlineContainer: {
    width: "100%",
    alignItems: "center",
  },
  headline: {
    marginTop: Platform.OS === "android" ? 35 : 20,
    fontSize: Platform.OS === "android" ? 35 : 50,
    fontWeight: Platform.OS === "android" ? "normal" : "100",
    color: "white",
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
    fontSize: Platform.OS === "android" ? 20 : 25,
    fontWeight: Platform.OS === "android" ? "normal" : "200",
  },
  searchField: {
    color: "white",
    fontSize: Platform.OS === "android" ? 17 : 20,
    fontWeight: Platform.OS === "android" ? "normal" : "200",
    width: "50%",
    borderWidth: 2,
    padding: Platform.OS === "android" ? 3 : 7,
    paddingLeft: 12,
    borderColor: "darkgrey",
    borderRadius: Platform.OS === "android" ? 13 : 18,
  },
  button: {
    color: "white",
    fontSize: Platform.OS === "android" ? 17 : 20,
    fontWeight: Platform.OS === "android" ? "normal" : "200",
    padding: 20,
  },
  input: {
    textAlign: "center",
    fontSize: 20,
    color: "white",
  },
  activityIndicator: {
    height: windowHeight / 3,
  },
});
