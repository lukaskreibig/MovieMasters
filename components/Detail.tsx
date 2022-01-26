import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-root-toast";
import { useState } from "react";
import { useEffect } from "react";

export default function Detail({ navigation, route }) {
  const [hidden, setHidden] = useState<boolean>(false);
  const [favourite, setFavourite] = useState<boolean>(false);

  useEffect(() => {
    console.log("Favourites", route.params.favourites);
    console.log(
      "Already in Favourites?",
      route.params.favourites.some((e) => e.id === route.params.id)
    );
    console.log(
      "Not hidden?",
      route.params.favourites.some((e) => e.id === route.params.id)
    );

    route.params.favourites.some(
      (e) => e.hide === true && e.id === route.params.id
    )
      ? setHidden(true)
      : setHidden(false);
    route.params.favourites.some((e) => e.id === route.params.id)
      ? setFavourite(true)
      : setFavourite(false);
  }, []);

  const triggerHidden = (hide: boolean) => {
    if (hide) {
      showToast("Hidden in Search");
      setHidden(true);
    } else {
      showToast("Show in Search");
      setHidden(false);
    }
  };

  const storeData = async (value: any, hide: boolean) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(String(value.id), jsonValue);
      setFavourite(true);
      hide ? triggerHidden(value.hide) : showToast("Add to Favourites");
    } catch (e) {
      showToast("Whoops, saving didn't work out");
    }
  };

  const removeData = async () => {
    try {
      await AsyncStorage.removeItem(String(route.params.id));
      showToast("Removed from Favourites");
      setFavourite(false);
    } catch (e) {
      showToast("Failed to remove from Favourites");
    }
  };

  const handleSaveData = async (toggle?: boolean, hiding?: boolean) => {
    let movie = {
      id: route.params.id,
      original_title: route.params.title,
      vote_average: route.params.ratings,
      poster_path: route.params.poster,
      hide: toggle,
    };
    storeData(movie, hiding);
  };

  const clearStorage = async () => {
    try {
      await AsyncStorage.clear();
      showToast("All Favourites have been removed");
      setFavourite(false);
    } catch (e) {
      showToast("You don't have any Favourites right now");
    }
  };

  function showToast(message: string) {
    Toast.show(message, {
      duration: Toast.durations.LONG,
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainView}>
        <Pressable
          style={styles.back}
          onPress={() => navigation.replace("Home")}
        >
          <Text style={styles.backText}>X</Text>
        </Pressable>
        <Text style={styles.headerText}>Movie Details</Text>

        <ImageBackground
          style={styles.posterImage}
          imageStyle={{ borderRadius: 8 }}
          source={{
            uri: "https://image.tmdb.org/t/p/w185" + route.params.poster,
          }}
        >
          <Text style={styles.textImage} numberOfLines={3}>
            {route.params.title} {"\n"} IMDB:{" "}
            {route.params.ratings ? route.params.ratings : "N/A"}
          </Text>
        </ImageBackground>

        <Text style={styles.headerText}>Options</Text>

        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={() => (favourite ? removeData() : handleSaveData())}
          >
            <Text style={styles.text}>
              Favourite: {favourite ? " Yes" : " No"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => clearStorage()}>
            <Text style={styles.text}> Delete All Favourites </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              hidden ? handleSaveData(false, true) : handleSaveData(true, true)
            }
          >
            <Text style={styles.text}>
              Hide in Search:
              {hidden ? " Hidden" : " Visible"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    width: "100%",
    height: "100%",
  },
  mainView: {
    width: "80%",
    height: "100%",
    alignSelf: "center",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  back: {
    width: "100%",
  },
  backText: {
    color: "white",
    textAlign: "right",
    fontSize: 30,
    fontWeight: "200",
  },
  text: {
    fontSize: 20,
    fontWeight: "200",
    marginTop: 14,
    color: "white",
    textAlign: "center",
    borderWidth: 0.5,
    borderColor: "white",
    padding: 5,
  },
  headerText: {
    color: "white",
    fontSize: 35,
    fontWeight: "100",
    marginTop: 20,
    marginBottom: 30,
  },
  buttons: {
    alignItems: "center",
  },
  input: {},
  movies: {
    height: 34,
    flexWrap: "wrap",
    textAlign: "center",
  },
  ratings: {
    height: 15,
  },
  posterImage: {
    justifyContent: "flex-start",
    width: 200,
    height: 300,
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
  textImage: {
    color: "white",
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "200",
    textAlign: "center",
    backgroundColor: "#000000c0",
  },
});
