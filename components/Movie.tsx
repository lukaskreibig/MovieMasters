import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  ImageBackground,
  Dimensions,
  Platform,
} from "react-native";

const windowHeight = Dimensions.get("window").height;

export default function Movie(props: any) {
  return (
    <ScrollView horizontal={true} decelerationRate={"normal"}>
      <Text>
        {(props.hideIt === "favourite"
          ? props.favourites
          : props.data.searchMovie.movies.filter(
              (obj: any) =>
                !props.hideIt.some(
                  (hidden: any) => (hidden.hide ? hidden.id : null) === obj.id
                )
            )
        ).map((movie: any, index: number) => (
          <View style={styles.movieThumb} key={index}>
            <Pressable
              onPress={() =>
                props.navigation.replace("Detail", {
                  id: movie.id,
                  title: movie.original_title,
                  poster: movie.poster_path,
                  ratings: movie.vote_average,
                  favourites: props.favourites,
                })
              }
            >
              <ImageBackground
                style={
                  props.hideIt === "favourite"
                    ? styles.poster
                    : styles.posterSearch
                }
                imageStyle={{ borderRadius: 8 }}
                source={
                  movie.poster_path
                    ? {
                        uri:
                          "https://image.tmdb.org/t/p/w185" + movie.poster_path,
                      }
                    : require("../assets/not-available.jpg")
                }
              >
                <Text
                  style={
                    props.hideIt === "favourite"
                      ? styles.text
                      : styles.textSearch
                  }
                  numberOfLines={3}
                >
                  {movie.original_title} {"\n"} IMDB:{" "}
                  {movie.vote_average ? movie.vote_average : "N/A"}
                </Text>
              </ImageBackground>
            </Pressable>
          </View>
        ))}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "white",
    fontSize: 15,
    lineHeight: 24,
    fontWeight: Platform.OS === "android" ? "normal" : "300",
    textAlign: "center",
    backgroundColor: "#000000c0",
  },
  textSearch: {
    color: "white",
    fontSize: 20,
    lineHeight: 30,
    fontWeight: Platform.OS === "android" ? "normal" : "300",
    textAlign: "center",
    backgroundColor: "#000000c0",
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
  movieThumb: {
    padding: 6,
  },
  activityIndicator: {
    height: windowHeight / 4.8,
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
    alignContent: "center",
  },
});
