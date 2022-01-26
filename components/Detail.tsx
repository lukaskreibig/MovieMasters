import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
  ImageBackground,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-root-toast";

export default function Detail({ navigation, route }: any) {
  const [hidden, setHidden] = useState<boolean>(false);
  const [favourite, setFavourite] = useState<boolean>(false);

  useEffect(() => {
    route.params.favourites.some(
      (e: { id: number; hide: boolean }) =>
        e.hide === true && e.id === route.params.id
    )
      ? setHidden(true)
      : setHidden(false);
    route.params.favourites.some(
      (e: { id: number }) => e.id === route.params.id
    )
      ? setFavourite(true)
      : setFavourite(false);
  }, []);

  const triggerHidden = (hide: boolean):void => {
    if (hide) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  };

  const storeData = async (value: any, hide?: boolean) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(String(value.id), jsonValue);
      setFavourite(true);
      hide ? triggerHidden(value.hide) : null;
    } catch (e) {
      showToast("Whoops, saving didn't work out");
    }
  };

  const removeData = async () => {
    try {
      await AsyncStorage.removeItem(String(route.params.id));
      setFavourite(false);
      setHidden(false);
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
      setHidden(false);
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
              {hidden ? " Hide" : " Visible"}
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
    marginTop: Platform.OS === "android" ? 20 : 0,
    width: "100%",
  },
  backText: {
    color: "white",
    textAlign: "right",
    fontSize: 30,
    fontWeight: Platform.OS === "android" ? "normal" : "200",
  },
  text: {
    fontSize: Platform.OS === "android" ? 16 : 18,
    fontWeight: Platform.OS === "android" ? "normal" : "200",
    marginBottom: Platform.OS === "android" ? 6 : 14,
    color: "white",
    textAlign: "center",
    borderWidth: 0.5,
    borderColor: "white",
    padding: 12,
  },
  headerText: {
    color: "white",
    fontSize: Platform.OS === "android" ? 25 : 35,
    fontWeight: Platform.OS === "android" ? "normal" : "200",
    marginTop: Platform.OS === "android" ? 10 : 20,
    marginBottom: 25,
  },
  buttons: {
    width: 200,
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
    fontSize: Platform.OS === "android" ? 19 : 22,
    lineHeight: 25,
    padding: 10,
    fontWeight: Platform.OS === "android" ? "normal" : "200",
    textAlign: "center",
    backgroundColor: "#000000c9",
  },
});
