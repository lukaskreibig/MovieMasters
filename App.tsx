import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery, QueryResult } from '@apollo/client';
import Home from './components/Home';





// Initialize Apollo Client
const client = new ApolloClient({
  uri: 'https://ql-movie-api.herokuapp.com/graphql',
  cache: new InMemoryCache()
});

export default function App() {


  return (
    <ApolloProvider client={client}>

    <View style={styles.container}>
      <Home />
      <StatusBar style="auto" />
    </View>

  </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});