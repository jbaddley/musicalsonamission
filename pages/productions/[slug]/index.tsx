import { Production } from "@prisma/client";
import _ from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { Layout } from "../../../components/Layout";
import { ProductionsClientAPI, ProductionsServerAPI } from "../../../data";

export default function ProductionView({ initialProduction }: { initialProduction: Production }) {
  const router = useRouter();
  const { slug } = router.query;
  const { data: production = initialProduction } = useQuery(["production", slug], () =>
    ProductionsClientAPI.getBySlug(String(slug))
  );
  return (
    <Layout>
      <Link href='/productions'>Back to Productions</Link>
      <pre>{JSON.stringify(production, null, 2)}</pre>
    </Layout>
  );
}

export async function getStaticPaths() {
  const productions = await ProductionsServerAPI.getList();
  return {
    paths: productions.map(({ slug }) => ({ params: { slug } })),
    fallback: false, // can also be true or 'blocking'
  };
}

export async function getStaticProps({ params }: any) {
  const initalProduction = await ProductionsServerAPI.getBySlug(params.slug);

  return {
    props: { initalProduction },
  };
}
