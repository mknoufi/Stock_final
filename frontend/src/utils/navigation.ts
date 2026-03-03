import type { Href, Router } from "expo-router";

import type { AppRoute } from "../constants/routes";

export const toHref = (route: AppRoute): Href => route as Href;

export const replaceRoute = (router: Router, route: AppRoute): void => {
  router.replace(toHref(route));
};

export const pushRoute = (router: Router, route: AppRoute): void => {
  router.push(toHref(route));
};
