import { SafeAreaView, StyleSheet, Text, TextInput, View, Button, ActivityIndicator, Image, ScrollView, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery, useLazyQuery } from '@apollo/client';
import { PossibleTypeExtensionsRule } from 'graphql';

export default function Detail({navigation, route}) {
    return (
        <Text>
            {route.params.id}
        </Text>
        
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