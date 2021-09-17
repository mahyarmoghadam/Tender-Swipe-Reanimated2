import { FontAwesome } from "@expo/vector-icons";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { ColorSchemeName, Pressable } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import { RootStackParamList } from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import { Text } from "expo-ui-kit";
import FavoriteScreen from "../screens/FavoriteScreen";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          title: "My Mars",
          headerTintColor: "red",
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate("Favorite")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <FontAwesome
                name="heart-o"
                size={25}
                color="red"
                style={{ marginRight: 5 }}
              />
            </Pressable>
          ),
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.navigate("Undo")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <Text color="red">Undo</Text>
            </Pressable>
          ),
        })}
      />

      <Stack.Screen
        name="Favorite"
        component={FavoriteScreen}
        options={({ navigation }) => ({
          headerTintColor: "red",
        })}
      />
    </Stack.Navigator>
  );
}
