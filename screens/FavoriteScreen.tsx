import { Block, Button } from "expo-ui-kit";
import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import MasonryList from "../components/MasonryList";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchMarsData } from "../redux/marsSlice";

export default function FavoriteScreen() {
  const { items, pending } = useAppSelector((state) => state.mars);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMarsData());
  }, []);

  if (!pending) {
    return (
      <Block center middle>
        <ActivityIndicator color="red" />
      </Block>
    );
  }

  return (
    <Block>
      <MasonryList
        data={items}
        isLoading={false}
        ListEmptyComponent={() => <Block></Block>}
        contentContainerStyle={{ marginLeft: 10 }}
        renderItem={({ item }) => (
          <Block
            white
            noflex
            marginRight={10}
            marginTop={10}
            marginBottom={10}
            radius={10}
            style={{ overflow: "hidden" }}
          >
            <Block gray card height={item.height}>
              <Image source={{ uri: item.url }} style={{ flex: 1 }} />
              <Block noflex color="rgba(255,255,255,9)" padding height={50}>
                <Text>{item.title}</Text>
              </Block>
            </Block>
          </Block>
        )}
        getHeightForItem={({ item }) => item.height + 2}
        numColumns={2}
      />
    </Block>
  );
}
