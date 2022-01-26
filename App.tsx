import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootSiblingParent } from "react-native-root-siblings";
import Home from "./components/Home";
import Detail from "./components/Detail";

const Stack = createNativeStackNavigator();

const client = new ApolloClient({
  uri: "https://ql-movie-api.herokuapp.com/graphql",
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <RootSiblingParent>
      <ApolloProvider client={client}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Detail" component={Detail} />
          </Stack.Navigator>
        </NavigationContainer>
      </ApolloProvider>
    </RootSiblingParent>
  );
}
