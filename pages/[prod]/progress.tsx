import { useRouter } from "next/router";
import { Container } from "semantic-ui-react";

export default function Progress() {
  const router = useRouter();
  const { prod } = router.query;

  return (
    <Container>
      <h2>{prod}</h2>
    </Container>
  );
}
