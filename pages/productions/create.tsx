import _ from "lodash";
import Link from "next/link";
import { Layout } from "../../components/Layout";
import EditProduction from "./[slug]/edit";

export default function CreateProduction() {
  return (
    <Layout>
      <Link href='/productions'>Back to Productions</Link>
      <EditProduction />
    </Layout>
  );
}
