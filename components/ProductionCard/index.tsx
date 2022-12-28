import { Production } from "@prisma/client";
import Link from "next/link";
import { Icon } from "semantic-ui-react";
import { ProductionsClientAPI } from "../../data";

export function ProductionCard({ production, onDelete }: { production: Production; onDelete: () => void }) {
  const handleDelete = async (e: any) => {
    e.stopPropagation();
    await ProductionsClientAPI.delete(production.id);
    onDelete?.();
  };
  return (
    <li key={production.id}>
      {production.title}
      <Link href={`/productions/${production.slug}/edit`}>
        <Icon name='edit' style={{ cursor: "pointer" }} />
      </Link>
      <Icon name='delete' style={{ cursor: "pointer" }} onClick={handleDelete} />
    </li>
  );
}
