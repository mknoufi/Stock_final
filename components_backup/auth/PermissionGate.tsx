/**
 * PermissionGate Component - Conditionally render content based on permissions
 *
 * Usage:
 *   <PermissionGate permission="count:approve">
 *     <Button title="Approve" />
 *   </PermissionGate>
 *
 *   <PermissionGate role={['admin', 'supervisor']}>
 *     <AdminPanel />
 *   </PermissionGate>
 *
 *   <PermissionGate
 *     permission="count:approve"
 *     fallback={<Text>Access Denied</Text>}
 *   >
 *     <ApprovalForm />
 *   </PermissionGate>
 */

import React, { ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";
import { usePermissions } from "@/hooks/usePermissions";

interface PermissionGateProps {
  /**
   * Required permission (e.g., 'count.approve')
   * If specified, children will only render if user has this permission
   */
  permission?: string;

  /**
   * Required role(s) (e.g., 'admin' or ['admin', 'supervisor'])
   * If specified, children will only render if user has one of these roles
   */
  role?: string | string[];

  /**
   * Require ALL specified permissions (default: false)
   * If true, user must have all permissions in the array
   */
  requireAll?: boolean;

  /**
   * Multiple permissions to check
   */
  permissions?: string[];

  /**
   * Content to render if user has access
   */
  children: ReactNode;

  /**
   * Content to render if user doesn't have access
   * If not provided, nothing will be rendered
   */
  fallback?: ReactNode;

  /**
   * Show a default "Access Denied" message if no fallback provided
   */
  showDeniedMessage?: boolean;
}

export function PermissionGate({
  permission,
  permissions,
  role,
  requireAll = false,
  children,
  fallback,
  showDeniedMessage = false,
}: PermissionGateProps) {
  const { hasPermission, hasAllPermissions, hasAnyPermission, hasRole } =
    usePermissions();

  let hasAccess = true;

  // Check single permission
  if (permission && !hasPermission(permission)) {
    hasAccess = false;
  }

  // Check multiple permissions
  if (permissions && permissions.length > 0) {
    if (requireAll) {
      if (!hasAllPermissions(...permissions)) {
        hasAccess = false;
      }
    } else {
      if (!hasAnyPermission(...permissions)) {
        hasAccess = false;
      }
    }
  }

  // Check role
  if (role) {
    const roles = Array.isArray(role) ? role : [role];
    if (!hasRole(...roles)) {
      hasAccess = false;
    }
  }

  // Render based on access
  if (hasAccess) {
    return <>{children}</>;
  }

  // Render fallback or denied message
  if (fallback) {
    return <>{fallback}</>;
  }

  if (showDeniedMessage) {
    return (
      <View style={styles.deniedContainer}>
        <Text style={styles.deniedText}>🔒 Access Denied</Text>
        <Text style={styles.deniedSubtext}>
          You don't have permission to view this content
        </Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  deniedContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fee",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fcc",
  },
  deniedText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#c33",
    marginBottom: 4,
  },
  deniedSubtext: {
    fontSize: 14,
    color: "#666",
  },
});
