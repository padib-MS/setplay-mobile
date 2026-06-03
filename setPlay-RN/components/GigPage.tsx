import type { ApiGigs } from "@/api/gig/gig.types";
import GigCard from "@/components/GigCard";
import { Text } from "@/components/ui/Text";
import { COLORS } from "@/constants/theme";
import { LegendList } from "@legendapp/list";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import LoadIndicator from "./ui/LoadIndicator";

type Props = {
  data: ApiGigs[] | undefined;
  emptyMessage: string;
  onGigPress: (gigId: string) => void;
  isLoading: boolean;
  isLoadingMore?: boolean;
  loadNextPage?: () => void;
};

const GigPage = ({
  data,
  emptyMessage,
  onGigPress,
  isLoading,
  isLoadingMore,
  loadNextPage,
}: Props) => {
  return (
    <View style={styles.page}>
      {data?.length === 0 && isLoading ? (
        <LoadIndicator isLoading />
      ) : (
        <LegendList
          showsVerticalScrollIndicator={false}
          data={data ?? []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <GigCard gig={item} onPress={() => onGigPress(item.id)} />
          )}
          contentContainerStyle={styles.listContent}
          estimatedItemSize={340}
          onEndReached={loadNextPage}
          onEndReachedThreshold={0.1}
          ListFooterComponent={
            isLoadingMore ? (
              <ActivityIndicator
                style={styles.loaderSpacing}
                size="large"
                color={COLORS.primary}
              />
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>{emptyMessage}</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default React.memo(GigPage);

const styles = StyleSheet.create({
  page: { flex: 1 },
  listContent: { paddingBottom: 50 },
  emptyState: {
    paddingVertical: 48,
    alignItems: "center",
    textAlign: "center",
  },
  emptyText: { color: "rgba(206, 232, 255, 0.6)" },
  loaderSpacing: { marginVertical: 10 },
});
