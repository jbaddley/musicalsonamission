import { Production } from "@prisma/client";
import _ from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { ProductionsClientAPI } from "../../data";

interface EditProductionProps {
  production?: Production;
  onSaved?: (saved: Production) => void;
}

export default function EditProduction({ production, onSaved }: EditProductionProps) {
  const [state, setState] = useState<Partial<Production> | undefined>(production);

  useEffect(() => {
    setState({ ...production, ...state });
  }, [production]);

  const handleChangeTitle = ({ target: { value } }: any) => {
    setState({ ...state, slug: state?.slug || production?.slug || _.kebabCase(String(value)) });
  };

  const handleChange = (e: any, { name, value, type }: any) => {
    setState({ ...state, [name]: type === "number" ? +value : value });
  };

  const handleSave = useCallback(() => {
    const toUpsert = { ...state } as Production;

    ProductionsClientAPI.upsert(toUpsert).then((saved) => {
      onSaved?.(saved);
    });
  }, [state]);

  return (
    <Form onSubmit={handleSave}>
      <Form.Input label='Title' name='title' value={state?.title} onBlur={handleChangeTitle} onChange={handleChange} />
      <Form.Input label='Description' name='description' value={state?.description} onChange={handleChange} />
      <Form.Input label='Length' name='length' type='number' value={state?.length} onChange={handleChange} />
      <Form.Input label='Budget' name='budget' type='number' value={state?.budget} onChange={handleChange} />
      <Form.Input label='Slug' name='slug' value={state?.slug} onChange={handleChange} />
      <Button type='submit' primary>
        Save
      </Button>
    </Form>
  );
}
