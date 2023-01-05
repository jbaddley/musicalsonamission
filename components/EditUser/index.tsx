import { User } from "@prisma/client";
import _ from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Container, Form } from "semantic-ui-react";
import { ProfileUser, UsersClientAPI } from "../../data";
import styles from "./EditUser.module.css";
import AvatarEditor from "react-avatar-editor";
import { useDropzone } from "react-dropzone";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { ImageEditor } from "../ImageEditor";
import ShortUniqueId from "short-unique-id";
import classNames from "classnames";

const uid = new ShortUniqueId({ length: 5 });

const defaultAvatar = "/assets/defaultMaleAvatar.png";

interface EditUserProps {
  user?: Partial<ProfileUser>;
  onSaved?: (saved: User) => void;
  isLoading?: boolean;
}

export default function EditUser({ user, onSaved, isLoading }: EditUserProps) {
  const [state, setState] = useState<Partial<ProfileUser> | undefined>(user);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(false);
  const [openImageEditor, setOpenImageEditor] = useState<boolean>(false);

  const handleDrop = async (dropped: any[]) => {
    if (!dropped.length) {
      return;
    }
    setIsLoadingImage(true);
    const [name, ext] = dropped[0].name.split(".");
    const fileName = `public/${sessionUser?.id}/${name}-${uid()}.${ext}`;
    const { data, error } = await supabase.storage.from("moam").upload(fileName, dropped[0]);
    if (error) {
      console.error(error);
      const { error: putError } = await supabase.storage.from("moam").update(fileName, dropped[0]);
      console.error(putError);
    }
    if (data) {
      const { data: image } = supabase.storage.from("moam").getPublicUrl(fileName);
      setState({
        ...state,
        profile: {
          ...state?.profile,
          avatarOriginalUrl: image.publicUrl,
          avatarUrl: image.publicUrl,
          avatarDesignState: {},
        },
      });
      setOpenImageEditor(true);
    }
    setTimeout(setIsLoadingImage, 1500, false);
  };

  const saveAvatarFromBlob = async (blob: Blob, name: string, designState: any) => {
    setIsLoadingImage(true);
    const fileName = `public/${sessionUser?.id}/${name}-${uid()}.png`;
    const { data, error } = await supabase.storage.from("moam").upload(fileName, blob);
    if (error) {
      await supabase.storage.from("moam").update(fileName, blob);
    }
    if (data) {
      const { data: image } = supabase.storage.from("moam").getPublicUrl(fileName);
      setState({
        ...state,
        profile: { ...state?.profile, avatarUrl: image.publicUrl, avatarDesignState: designState },
      });
    }
    setTimeout(setIsLoadingImage, 1500, false);
  };

  const { getRootProps, getInputProps, inputRef } = useDropzone({
    onDrop: handleDrop,
    noClick: true,
  });
  const supabase = useSupabaseClient();
  const sessionUser = useUser();
  const avatarRef = useRef<AvatarEditor>(null);

  useEffect(() => {
    setState({ ...user, ...state });
  }, [user]);

  const handleChange = (e: any, { name, value, type }: any) => {
    const val = type === "number" ? +value : value;
    setState({ ...state, [name]: val });
  };

  const handleProfileChange = (e: any, { name, value, type }: any) => {
    const val = type === "number" ? +value : value;
    const profile = { ...state?.profile, [name]: val };
    setState({ ...state, profile });
  };

  const save = async () => {
    setIsSaving(true);
    const toUpsert = { ...state } as ProfileUser;
    const saved = await UsersClientAPI.upsert(toUpsert);
    onSaved?.(saved);
    setIsSaving(false);
  };

  const handleSaveAvatar = async (blob: Blob, name: string, designState: any) => {
    setIsLoadingImage(true);
    await saveAvatarFromBlob(blob, name, designState);
    setTimeout(() => {
      setOpenImageEditor(false);
      setIsLoadingImage(false);
    }, 1500);
  };

  const handleSave = useCallback(() => {
    save();
  }, [state, avatarRef.current]);

  return (
    <Form className={classNames(styles.editUser, { isLoading })} onSubmit={handleSave} disabled={isSaving}>
      <Container className={styles.container}>
        <div className={classNames(styles.editor, { [styles.isLoadingImage]: isLoadingImage })}>
          <div {...getRootProps()}>
            <ImageEditor
              open={openImageEditor}
              designState={state?.profile?.avatarDesignState}
              editedSrc={state?.profile?.avatarUrl || defaultAvatar}
              src={state?.profile?.avatarOriginalUrl || defaultAvatar}
              onSave={handleSaveAvatar}
            />
            <input {...getInputProps()} type='file' />
            <Button type='button' onClick={() => inputRef.current?.click()}>
              Upload
            </Button>
          </div>
        </div>
        <div className={styles.form}>
          <Form.Input label='First Name' name='firstName' value={state?.firstName} onChange={handleChange} />
          <Form.Input label='Last Name' name='lastName' value={state?.lastName} onChange={handleChange} />
          <Form.Input label='Date of Birth' name='dateOfBirth' value={state?.dateOfBirth} onChange={handleChange} />
        </div>
      </Container>
      <Container textAlign='right'>
        <Button disabled={isLoading || isSaving} type='submit' loading={isSaving} primary>
          Save
        </Button>
      </Container>
    </Form>
  );
}
