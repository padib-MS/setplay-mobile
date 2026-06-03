import { type SearchGigsParams } from "@/api/gig/gig.types";
import type { SearchProducerParams } from "@/api/producer/producer.types";
import { SearchFilters } from "@/components/search/SearchFilters";
import SearchResults from "@/components/search/SearchResults";
import { modalStyles } from "@/components/ui/ModalStyles";
import SearchContainer from "@/components/ui/SearchContainer";
import { Text } from "@/components/ui/Text";
import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import { useSearch } from "@/hooks/useSearch";
import { useGigStore } from "@/stores/useGigStore";
import { useProducerStore } from "@/stores/useProducerStore";
import { useUserStore } from "@/stores/useUserStore";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";

const INITIAL_FILTERS: SearchGigsParams = {
  location: undefined,
  dateFrom: undefined,
  dateTo: undefined,
  genres: undefined,
  minBid: undefined,
  maxBid: undefined,
  bpmRangeMin: undefined,
  bpmRangeMax: undefined,
  venue: undefined,
  isSearch: true,
};

const INITIAL_USER_FILTERS: SearchProducerParams = {
  name: undefined,
  genres: undefined,
  bpmRangeMin: undefined,
  bpmRangeMax: undefined,
  minRating: undefined,
  completedGigsMin: undefined,
  completedGigsMax: undefined,
};

export default function SearchModal() {
  const setSelectedGig = useGigStore((state) => state.setSelectedGig);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<SearchGigsParams>(INITIAL_FILTERS);
  const [userFilters, setUserFilters] =
    useState<SearchProducerParams>(INITIAL_USER_FILTERS);
  const [showFilters, setShowFilters] = useState(false);

  const userRole = useUserStore((state) => state.user?.role);
  const tab = userRole === "Producer" ? "gigs" : "users";
  const { gigResults, userResults, isLoading } = useSearch(tab, filters);
  const findProducers = useProducerStore((state) => state.findProducers);
  const findGigs = useGigStore((state) => state.loadAllGigs);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (tab === "gigs") {
        findGigs({ ...filters, djName: query });
      } else {
        findProducers({ ...userFilters, name: query });
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [query, filters, userFilters, tab]);

  const activeFilterCount =
    tab === "gigs"
      ? Object.entries(filters).filter(([key, v]) => {
          if (key === "genres") return (v as string[])?.length > 0;
          return v !== undefined;
        }).length
      : Object.entries(userFilters).filter(([key, v]) => {
          if (key === "genres") return (v as string[])?.length > 0;
          return v !== undefined;
        }).length;

  const handleClearFilters = useCallback(() => {
    if (tab === "gigs") {
      setFilters(INITIAL_FILTERS);
    } else {
      setUserFilters(INITIAL_USER_FILTERS);
    }
  }, [tab]);

  const handleFilterChange = useCallback(
    <K extends keyof SearchGigsParams>(key: K, value: SearchGigsParams[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleUserFilterChange = useCallback(
    <K extends keyof SearchProducerParams>(
      key: K,
      value: SearchProducerParams[K],
    ) => {
      setUserFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleClose = useCallback(() => {
    setQuery("");
    setFilters(INITIAL_FILTERS);
    setUserFilters(INITIAL_USER_FILTERS);
    setShowFilters(false);
    router.back();
  }, []);

  return (
    <Modal
      visible={true}
      animationType="slide"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleClose}
            style={styles.backButton}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>

          <SearchContainer
            placeholder={
              userRole === "Producer"
                ? "DJ name or apply filters..."
                : "Producer name or apply filters..."
            }
            type="textInput"
            query={query}
            onChangeText={setQuery}
            onClear={() => setQuery("")}
          />
        </View>

        <View style={styles.tabRow}>
          {/* <TouchableOpacity style={[style.iconSpacing]} activeOpacity={0.8}>
            <MaterialDesignIcons
              name="swap-vertical"
              size={24}
              color={COLORS.primary}
            />
          </TouchableOpacity> */}
          <TouchableOpacity
            style={[
              {
                ...modalStyles.iconSpacing,
                flexDirection: "row",
                gap: 6,
                alignItems: "center",
              },
              showFilters && styles.filterToggleActive,
            ]}
            onPress={() => setShowFilters(!showFilters)}
            activeOpacity={0.8}
          >
            <Feather
              name="sliders"
              size={20}
              color={showFilters ? COLORS.text : COLORS.primary}
            />
            {activeFilterCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.filterBar}>
          {activeFilterCount > 0 && (
            <TouchableOpacity onPress={handleClearFilters}>
              <Text style={styles.clearText}>Clear all</Text>
            </TouchableOpacity>
          )}
        </View>

        {showFilters &&
          (tab === "gigs" ? (
            <SearchFilters
              tab="gigs"
              filters={filters}
              onChange={handleFilterChange}
            />
          ) : (
            <SearchFilters
              tab="users"
              filters={userFilters}
              onChange={handleUserFilterChange}
            />
          ))}

        <SearchResults
          tab={tab}
          gigResults={gigResults}
          userResults={userResults}
          isLoading={isLoading}
          query={query}
          onGigPress={(gigId) => {
            setSelectedGig(gigId);
            router.navigate("/(screens)/gig-card");
          }}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.medium,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.small,
  },
  backButton: {
    borderWidth: 2,
    padding: 10,
    borderColor: COLORS.primary,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    backgroundColor: COLORS.background,
  },
  tabRow: {
    flexDirection: "row",
    gap: SPACING.small,
    marginBottom: SPACING.small,
    justifyContent: "flex-end",
  },
  filterBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  filterToggleActive: {
    flexDirection: "row",
    borderColor: COLORS.text,
    gap: 6,
  },
  filterBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    width: 14,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  filterBadgeText: {
    color: COLORS.background,
    fontSize: 10,
    fontWeight: "bold",
  },
  clearText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.small,
    textDecorationLine: "underline",
    marginBottom: SPACING.small,
  },
});
