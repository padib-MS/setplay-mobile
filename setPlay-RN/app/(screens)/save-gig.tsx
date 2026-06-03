import GigPage from "@/components/GigPage";
import ArrowBack from "@/components/ui/ArrowBack";
import BackgroundPicture from "@/components/ui/BackgroundPicture";
import DropdownList from "@/components/ui/DropdownList";
import { Text } from "@/components/ui/Text";
import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import { useGigStore } from "@/stores/useGigStore";
import { useUserStore } from "@/stores/useUserStore";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const gigsFilter = ["All", "DJ", "Producer"];

export default function SaveGigModal() {
  const isLoading = useGigStore((l) => l.loading);
  const savedGigs = useUserStore((state) => state.savedGigs);
  const userRole = useUserStore((state) => state.user?.role);
  const router = useRouter();

  const [selectedFilter, setSelectedFilter] = useState(
    userRole === "DJ" || userRole === "Producer" ? userRole : "",
  );

  const filteredGigs = useMemo(() => {
    if (selectedFilter === "All") return savedGigs;
    return savedGigs.filter((gig) => gig.role === selectedFilter);
  }, [savedGigs, selectedFilter]);

  const getFilterLabel = (filter: string) =>
    filter === "All" ? "All" : `Starred as ${filter}`;

  return (
    <BackgroundPicture bgImage={require("@/assets/images/offers-bg.webp")}>
      <ArrowBack ovalOrSquare="square" style={styles.arrowBack} />

      <View style={styles.container}>
        {savedGigs.length > 0 && (
          <>
            <Text style={styles.title}>Saved</Text>

            <DropdownList title={getFilterLabel(selectedFilter)} marginTop={0}>
              {gigsFilter.map((filter) => {
                const isActive = filter === selectedFilter;

                return (
                  <TouchableOpacity
                    key={filter}
                    style={[
                      styles.dropdownItem,
                      isActive && styles.dropdownItemActive,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => setSelectedFilter(filter)}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        isActive && styles.dropdownItemTextActive,
                      ]}
                    >
                      {getFilterLabel(filter)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </DropdownList>
          </>
        )}

        <GigPage
          data={filteredGigs}
          isLoading={isLoading}
          onGigPress={() => router.navigate("/(screens)/gig-card")}
          emptyMessage={
            savedGigs.length === 0
              ? "Start exploring and save your favorite gigs to see them here!"
              : `No saved gigs as ${selectedFilter === "All" ? "" : selectedFilter} yet`
          }
        />
      </View>
    </BackgroundPicture>
  );
}

const styles = StyleSheet.create({
  arrowBack: {
    marginLeft: SPACING.medium,
    marginTop: "15%",
    borderRadius: 10,
    marginBottom: SPACING.large,
  },
  container: {
    flex: 1,
    marginHorizontal: SPACING.medium,
  },
  title: {
    fontSize: FONT_SIZES.large,
    fontWeight: "400",
    marginTop: SPACING.small,
    marginBottom: 12,
    color: COLORS.text,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownItemActive: {
    backgroundColor: COLORS.primary,
  },
  dropdownItemText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.primary,
  },
  dropdownItemTextActive: {
    color: COLORS.text,
  },
});
