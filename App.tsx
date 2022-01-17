import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery, QueryResult } from '@apollo/client';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './components/Home';
import Detail from './components/Detail';
import NetInfo from "@react-native-community/netinfo";


const Stack = createNativeStackNavigator();

const unsubscribe = NetInfo.addEventListener(state => {
  console.log("Connection type", state.type);
  console.log("Is connected?", state.isConnected);
});

const client = new ApolloClient({
  uri: 'https://ql-movie-api.herokuapp.com/graphql',
  cache: new InMemoryCache()
});

export default function App() {


  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
      <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen
          name="Home"
          component={Home}
        />
        <Stack.Screen name="Detail" component={Detail} />
      </Stack.Navigator>


        {/* <View style={styles.container}>
          <Home />
          <StatusBar style="auto" />
        </View> */}

    </NavigationContainer>
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