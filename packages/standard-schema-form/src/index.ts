import { ZodString, z } from "zod";

export const form = z.object;

class TextField extends ZodString {
  hex() {
    return new TextField({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: "regex",
          regex: /^#([0-9a-fA-F]{6})$/,
        },
      ],
    });
  }

  static create(params?: unknown) {
    return new TextField({ ...params });
  }
}

export function textField({ required }: { required?: boolean } = {}) {
  let schema = TextField.create();

  if (required) {
    schema = schema.nonempty();
  }

  return schema;
}

export function numberField({ required }: { required?: boolean } = {}) {
  let schema = z.coerce.number();

  if (required) {
    schema = schema.min(1);
  }

  return schema;
}

export function colorField() {
  return z.custom<`#${string}`>((value) =>
    TextField.create().hex().parse(value),
  );
}
