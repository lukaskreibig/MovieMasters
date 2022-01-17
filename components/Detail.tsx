import { SafeAreaView, StyleSheet, Text, TextInput, View, Button, ActivityIndicator, Image, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { removeArgumentsFromDocument } from '@apollo/client/utilities';



export default function Detail({navigation, route}) {

      const storeData = async (value:any) => {
        try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem(String(value.id), jsonValue)
        alert('Data successfully saved')
        } catch (e) {
            alert('Failed to save the data to the storage')
        }
    }

      const handleSaveData = async () => {
        let movie = {  
                id: route.params.id,
                original_title: route.params.title,
                vote_average: route.params.ratings,  
                poster_path: route.params.poster,
                goodorbad: true,

              }  
              storeData(movie)
      }

      const removeData = async () => {
        try {
          await AsyncStorage.removeItem((String(route.params.id)))
        } catch(e) {
            alert('Failed to remove the data from storage')
        }
      
        console.log('Done.')
      }

        const clearStorage = async () => {
        try {
        await AsyncStorage.clear()
        alert('Storage successfully cleared!')
        } catch (e) {
        alert('Failed to clear the async storage.')
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text>
                Movie Details
            </Text>
            <Text>
            {route.params.title}
            </Text>
            <Text>
            {route.params.ratings}
            </Text>
            <Image
            style={styles.poster}                   
            source={{
            uri: 'https://image.tmdb.org/t/p/w185'+route.params.poster,
            }}
            />
            <Button
                    style={styles.button}
                    onPress={() => handleSaveData()}
                    title="Add to Favourites"
                    color="#841584"
                    accessibilityLabel="Learn more about this purple button"
                />
                <Button
                    style={styles.button}
                    onPress={() => removeData()}
                    title="Remove from Favourites"
                    color="#841584"
                    accessibilityLabel="Learn more about this purple button"
                />
                <Button
                    style={styles.button}
                    onPress={() => navigation.push('Home')
                }
                    title="Back to Main Screen"
                    color="#841584"
                    accessibilityLabel="Learn more about this purple button"
                />
                <Button
                    style={styles.button}
                    onPress={() => clearStorage()
                }
                    title="Delete All Favourites"
                    color="#841584"
                    accessibilityLabel="Learn more about this purple button"
                />
        </SafeAreaView>
        
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 130,
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