import { useRouter } from "next/router";

export default function Progress() {
  const router = useRouter();
  const { prod } = router.query;

  return (
    <div>
      <h2>{prod}</h2>
    </div>
  );
}
