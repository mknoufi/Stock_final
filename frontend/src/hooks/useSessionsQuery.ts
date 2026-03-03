import { useQuery } from "@tanstack/react-query";
import { getSessions } from "../services/api";
import { SESSION_PAGE_SIZE } from "../constants/config";

interface UseSessionsQueryOptions {
  page?: number;
  pageSize?: number;
  enabled?: boolean;
  startTime?: string;
  endTime?: string;
}

export const useSessionsQuery = ({
  page = 1,
  pageSize = SESSION_PAGE_SIZE,
  enabled = true,
  startTime,
  endTime,
}: UseSessionsQueryOptions = {}) => {
  return useQuery({
    queryKey: ["sessions", page, pageSize, startTime ?? null, endTime ?? null],
    queryFn: () => getSessions(page, pageSize, { startTime, endTime }),
    placeholderData: (previousData) => previousData,
    enabled,
  });
};
