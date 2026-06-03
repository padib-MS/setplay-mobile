import type { ApiGigs, SearchTab } from "@/api/gig/gig.types";
import { ProfileCard } from "@/api/user/user.types";
import { UserResultCard } from "@/components/search/UserResultCard";
import { Text } from "@/components/ui/Text";
import { COLORS } from "@/constants/theme";
import { LegendList } from "@legendapp/list";
import { router } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import GigPage from "../GigPage";

type Props = {
  tab: SearchTab;
  gigResults: ApiGigs[];
  userResults: ProfileCard[];
  query: string;
  isLoading: boolean;
  onGigPress: (gigId: string) => void;
};

const SearchResults = ({
  tab,
  gigResults,
  userResults,
  query,
  isLoading,
  onGigPress,
}: Props) => {
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (tab === "users") {
    return (
      <LegendList
        data={userResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UserResultCard
            user={item}
            onPress={() => {
              router.back();
              router.navigate({
                pathname: "/(screens)/user-profile",
                params: { userId: item.id, role: "Producer" },
              });
            }}
          />
        )}
        estimatedItemSize={80}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>
              {query
                ? "No producers found — check back soon or adjust your search"
                : "Search for producers by name or apply filters to find the perfect match for your needs"}
            </Text>
          </View>
        }
      />
    );
  }

  return (
    <GigPage
      data={gigResults}
      isLoading={isLoading}
      onGigPress={onGigPress}
      emptyMessage={
        query
          ? "No gigs match your filters right now — check back soon or adjust your search"
          : "Search for gigs by dj name or apply filters to find the perfect match for your needs"
      }
    />
  );
};

export default SearchResults;

const styles = StyleSheet.create({
  list: {
    paddingBottom: 50,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    color: "rgba(206, 232, 255, 0.6)",
    textAlign: "center",
  },
});
