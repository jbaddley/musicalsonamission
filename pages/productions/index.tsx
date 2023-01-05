import { Production } from "@prisma/client";
import _ from "lodash";
import React, { useMemo } from "react";
import { useQuery } from "react-query";
import { Layout } from "../../components/Layout";
import { ProductionCard } from "../../components/ProductionCard";
import { ProductionsServerAPI, ProductionsClientAPI } from "../../data";

interface ProductionsProps {
  initialProductions: Production[];
}

export default function Productions({ initialProductions }: ProductionsProps) {
  const { data, isLoading, refetch } = useQuery(["productions"], ProductionsClientAPI.getList);

  const productions = useMemo(() => {
    if (isLoading) {
      return initialProductions || [];
    }
    return data;
  }, [initialProductions, data, isLoading]);

  return (
    <Layout>
      <h3>Productions</h3>
      <ul>
        {productions?.map((prod) => (
          <ProductionCard key={prod.id} production={prod} onDelete={refetch} />
        ))}
      </ul>
    </Layout>
  );
}

export async function getStaticProps() {
  const initialProductions = await ProductionsServerAPI.getList();

  return {
    props: { initialProductions },
  };
}
