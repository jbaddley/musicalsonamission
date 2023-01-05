import { Production } from "@prisma/client";
import _ from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useQuery } from "react-query";
import EditProduction from "../../../components/EditProduction";
import { Layout } from "../../../components/Layout";
import { ProductionsClientAPI, ProductionsServerAPI } from "../../../data";

export default function EditProductionView({ initialProduction }: { initialProduction: Production }) {
  const router = useRouter();
  const { slug } = router.query;
  const { isLoading, data, refetch } = useQuery(["production", slug], () =>
    ProductionsClientAPI.getBySlug(String(slug))
  );

  const production = useMemo(() => {
    if (isLoading) {
      return initialProduction;
    }
    return data;
  }, [isLoading, data, initialProduction]);

  const handleSave = (saved: Production) => {
    refetch();
    router.replace(`/productions/${saved.slug}/edit`);
  };

  return (
    <Layout>
      <Link href='/productions'>Back to Productions</Link>
      <EditProduction isLoading={isLoading} production={production} onSaved={handleSave} />
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
// export async function getServerSideProps(context: any) {
//   const initalProduction = await ProductionsServerAPI.getBySlug(context.params.slug);

//   return {
//     props: { initalProduction },
//   };
// }
