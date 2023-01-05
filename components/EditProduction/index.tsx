import { Production } from "@prisma/client";
import _ from "lodash";
import { useCallback, useEffect, useState } from "react";
import { Button, Container, Form, Icon, Input, Label, TextArea } from "semantic-ui-react";
import { ProductionsClientAPI } from "../../data";

interface EditProductionProps {
  production?: Production;
  onSaved?: (saved: Production) => void;
  isLoading?: boolean;
}

export default function EditProduction({ production, onSaved, isLoading }: EditProductionProps) {
  const [state, setState] = useState<Partial<Production> | undefined>(production);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    setState({ ...production, ...state });
  }, [production]);

  const handleChangeTitle = ({ target: { value } }: any) => {
    setState({ ...state, slug: state?.slug || production?.slug || _.kebabCase(String(value)) });
  };

  const handleResetSlug = useCallback(() => {
    setState({ ...state, slug: _.kebabCase(String(state?.title || production?.title)) });
  }, [state, production]);

  const handleChange = (e: any, { name, value, type }: any) => {
    setState({ ...state, [name]: type === "number" ? +value : value });
  };

  const handleSave = useCallback(() => {
    setIsSaving(true);
    const toUpsert = { ...state } as Production;

    ProductionsClientAPI.upsert(toUpsert).then((saved) => {
      onSaved?.(saved);
      setIsSaving(false);
    });
  }, [state]);

  return (
    <Form onSubmit={handleSave} style={{ width: 400, margin: "auto" }} disabled={isLoading || isSaving}>
      <Form.Input label='Title' name='title' value={state?.title} onBlur={handleChangeTitle} onChange={handleChange} />
      <Form.Field>
        <label>Description</label>
        <TextArea name='description' value={state?.description} onChange={handleChange} />
      </Form.Field>
      <Form.Input label='Length' />
      <Form.Field>
        <label>Length</label>
        <Input labelPosition='right' type='number' name='length' value={state?.length} onChange={handleChange}>
          <input />
          <Label>minutes</Label>
        </Input>
      </Form.Field>
      <Form.Field>
        <label>Budget</label>
        <Input labelPosition='right' type='number' name='budget' value={state?.budget} onChange={handleChange}>
          <Label>$</Label>
          <input />
          <Label>.00</Label>
        </Input>
      </Form.Field>
      <Form.Field>
        <label>Slug</label>
        <Input labelPosition='left' name='slug' value={state?.slug} onChange={handleChange}>
          <Label basic style={{ cursor: "pointer" }}>
            <Icon name='refresh' style={{ margin: 0 }} onClick={handleResetSlug} />
          </Label>
          <input />
        </Input>
      </Form.Field>
      <Container textAlign='right'>
        <Button disabled={isLoading || isSaving} type='submit' loading={isSaving} primary>
          Save
        </Button>
      </Container>
    </Form>
  );
}
