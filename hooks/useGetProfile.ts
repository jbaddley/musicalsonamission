import { useUser } from "@supabase/auth-helpers-react";
import { useQuery } from "react-query";
import { UsersClientAPI } from "../data";

export function useGetProfile() {
  const user = useUser();
  const { data: profileUser, isLoading } = useQuery(["profileUser", user?.email], async () => {
    if (!user?.email) {
      return Promise.resolve(undefined);
    }
    const up = await UsersClientAPI.get(user?.email);
    return up;
  });

  return { profileUser, isLoading };
}
