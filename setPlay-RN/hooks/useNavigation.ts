import { router } from "expo-router";

export type AppRoutes = {
  "/(screens)/gig-card": { gigId: string };
  "/(screens)/make-offer": { gigId: string };
  "/(screens)/chat": { userId: string; userName: string };
  "/(screens)/search": undefined;
  "/(screens)/account-settings": undefined;
  "/(screens)/live-video": { gigId: string; videoUrl: string };
  "/(screens)/share-gig": undefined;
  "/(screens)/rate-role": { djId: string; producerId: string; gigId: string };
  "/(screens)/save-gig": { gigId: string };
  "/(screens)/track-upload": undefined;
  "/(screens)/datetime-picker": undefined;
  "/(screens)/step-one": undefined;
  "/(screens)/step-two": { songId: string };
  "/(screens)/burger-menu": undefined;
  "/(screens)/user-profile": { userId: string };
};

export const useNav = () => {
  const navigate = <T extends keyof AppRoutes>(
    route: T,
    params?: AppRoutes[T],
  ) => {
    router.push({ pathname: route, params: params as any });
  };

  const replace = <T extends keyof AppRoutes>(
    route: T,
    params?: AppRoutes[T],
  ) => {
    router.replace({ pathname: route, params: params as any });
  };

  return { navigate, replace };
};
