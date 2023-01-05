import { useSession } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { Dropdown, Icon, Menu } from "semantic-ui-react";
import { ProfileUser } from "../../data";
import { useGetProfile } from "../../hooks/useGetProfile";

export function Avatar({ profileUser }: { profileUser: ProfileUser }) {
  return (
    <>
      <img src={profileUser?.profile?.avatarUrl || ""} />
      <label style={{ margin: "0 12px" }}>
        {profileUser?.firstName} {profileUser?.lastName}
      </label>
      <Icon name='chevron down' />
    </>
  );
}

export function Header() {
  const router = useRouter();
  const activeItem = router.route;

  const { profileUser } = useGetProfile();

  const handleItemClick = (e: any, { name }: any) => {
    router.push(name);
  };

  return (
    <header>
      <nav>
        <Menu pointing>
          <Menu.Item name='/' active={activeItem === "/"} onClick={handleItemClick}>
            <img src='/assets/64w/moam-icon.png' alt='Musicals on a Mission' />
          </Menu.Item>
          <Menu.Item name='/productions' active={activeItem === "/productions"} onClick={handleItemClick} />
          {profileUser ? (
            <Menu.Menu position='right'>
              <Dropdown item icon={<Avatar profileUser={profileUser} />}>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => router.push("/profile")}>Profile</Dropdown.Item>
                  <Dropdown.Item onClick={() => router.push("/logout")}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Menu>
          ) : (
            <Menu.Menu position='right'>
              <Menu.Item name='/sign-in' active={activeItem === "/sign-in"} onClick={handleItemClick} />
            </Menu.Menu>
          )}
        </Menu>
      </nav>
    </header>
  );
}
