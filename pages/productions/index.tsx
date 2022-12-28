import { faL } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Production } from "@prisma/client";
import _ from "lodash";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Button, Form, Icon, Modal } from "semantic-ui-react";
import { Layout } from "../../components/Layout";
import { ProductionCard } from "../../components/ProductionCard";
import { ProductionsServerAPI, ProductionsClientAPI } from "../../data";

interface ProductionsProps {
  initialProductions: Production[];
}

export default function Productions({ initialProductions }: ProductionsProps) {
  const {
    data: productions = initialProductions,
    isLoading,
    refetch,
  } = useQuery(["productions"], ProductionsClientAPI.getList);

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
  const productions = await ProductionsServerAPI.getList();

  return {
    props: { productions },
  };
}
