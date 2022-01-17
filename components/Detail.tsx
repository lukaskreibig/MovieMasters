import { SafeAreaView, StyleSheet, Text, TextInput, View, Button, ActivityIndicator, Image, ScrollView, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery, useLazyQuery } from '@apollo/client';
import { PossibleTypeExtensionsRule } from 'graphql';

export default function Detail({navigation, route}) {



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
        </SafeAreaView>
        
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 100,
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