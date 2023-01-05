import { useUser } from "@supabase/auth-helpers-react";
import { useQuery } from "react-query";
import { ProfileUser, UsersClientAPI } from "../data";

export function useGetProfile() {
  const user = useUser();
  const { data: profileUser, isLoading } = useQuery(["profileUser", user?.email], async () => {
    if (!user?.email) {
      console.log("email", user);
      return Promise.resolve(undefined);
    }
    const up = await UsersClientAPI.get(user?.email);
    console.log("UP", up);
    return up;
  });

  return { profileUser, isLoading };
}
