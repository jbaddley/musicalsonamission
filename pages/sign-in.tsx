import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useUser, useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { Button, Container, Form } from "semantic-ui-react";
import { useRouter } from "next/router";

export default function Login() {
  const session = useSession();
  const router = useRouter();
  const supabase = useSupabaseClient();
  useEffect(() => {
    if (session) {
      router.push("/profile");
    }
  }, [session]);
  return (
    <Container style={{ width: 400 }}>
      <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} redirectTo='/' />
    </Container>
  );
}
