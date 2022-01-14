import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery, QueryResult } from '@apollo/client';





// Initialize Apollo Client
const client = new ApolloClient({
  uri: 'https://ql-movie-api.herokuapp.com/graphql',
  cache: new InMemoryCache()
});

const TEST = gql`
  query TestMovie {
    movieDetail(id:40336) 
    {
    movie
      {original_title}
    }
  }
`
const movieData:QueryResult<any> = useQuery(TEST)
console.log(movieData)

export default function App() {
  return (
    <ApolloProvider client={client}>

    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
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