import { Container, Loader } from "semantic-ui-react";
import { Layout } from "../components/Layout";
import { useState, useEffect } from "react";
import { ProfileUser } from "../data";
import EditUser from "../components/EditUser";
import { useGetProfile } from "../hooks/useGetProfile";

export default function Account() {
  const [profile, setProfile] = useState<ProfileUser>();
  const { profileUser, isLoading } = useGetProfile();

  useEffect(() => {
    if (profileUser && !isLoading) {
      setProfile(profileUser);
    }
  }, [profileUser, isLoading]);

  return (
    <Layout>
      <Container>{isLoading && !profile ? <Loader /> : <EditUser user={profile} isLoading={isLoading} />}</Container>
    </Layout>
  );
}
