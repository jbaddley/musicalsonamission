import { Tab } from "semantic-ui-react";
import BasicInformation from "./BasicInformation";
import { ProfileUser } from "../../data";
import { User } from "@prisma/client";
import Bio from "./Bio";

interface EditUserProps {
  user?: Partial<ProfileUser>;
  onSaved?: (saved: User) => void;
  isLoading?: boolean;
}

export default function EditUser(props: EditUserProps) {
  const panes = [
    {
      menuItem: "Basic Information",
      render: () => (
        <Tab.Pane>
          <BasicInformation {...props} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Your Story",
      render: () => (
        <Tab.Pane>
          <Bio {...props} />
        </Tab.Pane>
      ),
    },
    { menuItem: "Skills", render: () => <Tab.Pane>Tab 3 Content</Tab.Pane> },
  ];
  return <Tab panes={panes} />;
}
