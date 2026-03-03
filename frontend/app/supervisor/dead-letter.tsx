import React from "react";
import { Redirect } from "expo-router";

export default function SupervisorDeadLetterLegacyRedirect() {
  return <Redirect href="/supervisor/sync-conflicts" />;
}
