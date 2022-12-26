import { useRouter } from "next/router";
import { Container } from "semantic-ui-react";
import _ from "lodash";

export default function Progress() {
  const router = useRouter();
  const { prod } = router.query;

  return (
    <Container>
      <h2>{_.startCase(String(prod))}</h2>
    </Container>
  );
}
