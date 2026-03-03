import React from "react";
import { Redirect } from "expo-router";

export default function AdminDashboardLegacyRedirect() {
  return <Redirect href="/admin/dashboard-web" />;
}
