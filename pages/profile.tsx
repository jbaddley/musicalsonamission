import { Container, Loader } from "semantic-ui-react";
import { Layout } from "../components/Layout";
import { useState, useEffect } from "react";
import { ProfileUser } from "../data";
import EditUser from "../components/EditUser";
import { useGetProfile } from "../hooks/useGetProfile";
import { useRouter } from "next/router";

export default function Account() {
  const [profile, setProfile] = useState<ProfileUser>();
  const { profileUser, isLoading } = useGetProfile();
  const router = useRouter();

  useEffect(() => {
    if (profileUser && !isLoading) {
      setProfile(profileUser);
    }
    if (!isLoading && !profileUser) {
      router.push("/");
    }
  }, [profileUser, isLoading]);

  return (
    <Layout>
      <Container>{isLoading && !profile ? <Loader /> : <EditUser user={profile} isLoading={isLoading} />}</Container>
    </Layout>
  );
}
