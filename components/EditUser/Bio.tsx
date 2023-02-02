import { User } from "@prisma/client";
import _ from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Container, Form } from "semantic-ui-react";
import { ProfileUser, UsersClientAPI } from "../../data";
import styles from "./EditUser.module.css";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import classNames from "classnames";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";

const Quill = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

interface EditUserProps {
  user?: Partial<ProfileUser>;
  onSaved?: (saved: User) => void;
  isLoading?: boolean;
}

export default function Interests({ user, onSaved, isLoading }: EditUserProps) {
  const [state, setState] = useState<Partial<ProfileUser> | undefined>(user);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const supabase = useSupabaseClient();
  const sessionUser = useUser();

  const config = useMemo(() => {
    return {
      readonly: false, // all options from https://xdsoft.net/jodit/doc/,
      placeholder: "Start typings...",
    };
  }, []);

  useEffect(() => {
    setState({ ...user, ...state });
  }, [user]);

  const handleChange = (bio: string) => {
    setState({ ...state, profile: { ...state?.profile, bio } });
  };

  const save = async () => {
    setIsSaving(true);
    const toUpsert = { ...state } as ProfileUser;
    const saved = await UsersClientAPI.upsert(toUpsert);
    onSaved?.(saved);
    setIsSaving(false);
  };

  const handleSave = useCallback(() => {
    save();
  }, [state]);

  return (
    <Form className={classNames(styles.editUser, { isLoading })} onSubmit={handleSave} disabled={isSaving}>
      <h1 className='cursive center'>Your Story</h1>
      <Container className={styles.actions} textAlign='right'>
        <Button disabled={isLoading || isSaving} type='submit' loading={isSaving} primary>
          Save
        </Button>
      </Container>
      <Container className={styles.bio}>
        <Quill
          className={styles.quill}
          defaultValue={user?.profile?.bio || ""}
          value={state?.profile?.bio || ""}
          onChange={handleChange}
        />
      </Container>
    </Form>
  );
}
