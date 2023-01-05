import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

export default function Logout() {
  const [out, setOut] = useState<boolean>(false);
  const supabase = useSupabaseClient();
  const user = useUser();
  const router = useRouter();
  const logout = async () => {
    setOut(true);
    await supabase.auth.signOut();
    setTimeout(() => {
      router.push("/");
    }, 3000);
  };

  useEffect(() => {
    logout();
  }, []);

  return (
    <div
      className={classNames(styles.logout, { [styles.out]: out })}
      style={{ marginTop: 100, display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <div style={{ textAlign: "center" }}>
        <h3>Thank You for Supporting</h3>
        <h1>Musicals on a Mission</h1>
        <img src='assets/128w/moam-icon.png' />
      </div>
    </div>
  );
}
