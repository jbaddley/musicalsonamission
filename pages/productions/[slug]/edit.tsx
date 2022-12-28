import { Production } from "@prisma/client";
import _ from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Button, Form, Modal } from "semantic-ui-react";
import EditProduction from "../../../components/EditProduction";
import { Layout } from "../../../components/Layout";
import { ProductionsClientAPI, ProductionsServerAPI } from "../../../data";

export default function EditProductionView({ initialProduction }: { initialProduction: Production }) {
  const router = useRouter();
  const { slug } = router.query;
  const { data: production = initialProduction, refetch } = useQuery(["production", slug], () =>
    ProductionsClientAPI.getBySlug(String(slug))
  );
  const [state, setState] = useState<Partial<Production> | undefined>();

  useEffect(() => {
    setState({ ...production, ...state });
  }, [production]);

  const handleSave = (saved: Production) => {
    setState(saved);
    refetch();
    router.replace(`/productions/${saved.slug}/edit`);
  };

  return (
    <Layout>
      <Link href='/productions'>Back to Productions</Link>
      <EditProduction production={production} onSaved={handleSave} />
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
