import _ from "lodash";
import Link from "next/link";
import EditProduction from "../../components/EditProduction";
import { Layout } from "../../components/Layout";

export default function CreateProduction() {
  return (
    <Layout>
      <Link href='/productions'>Back to Productions</Link>
      <EditProduction />
    </Layout>
  );
}
