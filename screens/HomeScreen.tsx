import * as React from "react";
import { Block, Text } from "expo-ui-kit";
import Tinder from "../components/Tinder";
import { Pressable } from "react-native";
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../types";

export default function HomeScreen() {
  const [back, setback] = React.useState(0);
  const route = useRoute<RouteProp<RootStackParamList, "Home">>();
  const navigation =
    useNavigation<NavigationProp<RootStackParamList, "Home">>();

  React.useLayoutEffect(() => {
    const activeButton =
      route.params?.index == undefined
        ? false
        : route.params?.index <= 0
        ? false
        : true;

    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          onPress={() => activeButton && setback((prev) => prev + 1)}
          style={({ pressed }) => ({
            opacity: pressed ? 0.5 : 1,
          })}
        >
          <Text color={activeButton ? "red" : "#ccc"}>Undo</Text>
        </Pressable>
      ),
    });
  }, [navigation, route.params?.index]);

  const onChangeIndex = (index) => {
    navigation.setParams({
      index: index,
    });
  };

  return (
    <Block>
      <Tinder back={back} onChangeIndex={onChangeIndex} />
    </Block>
  );
}
