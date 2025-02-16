import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import type { Meta } from "@storybook/react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import * as schema from "./index";

const meta = {} satisfies Meta;
export default meta;

export function Basic() {
  const Fields = schema.form({
    name: schema.textField(),
    age: schema.numberField(),
    color: schema.colorField(),
  });
  type Fields = z.infer<typeof Fields>;

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm({
    resolver: standardSchemaResolver(Fields),
  });

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <input {...register("name")} />
      {errors.name?.message && <p>{errors.name?.message}</p>}
      <input type="number" {...register("age")} />
      {errors.age?.message && <p>{errors.age?.message}</p>}
      <input type="checkbox" {...register("checkbox")} />
      <input type="color" {...register("color")} />
      <input type="date" {...register("date")} />
      <input type="datetime-local" {...register("datetime-local")} />
      <input type="email" {...register("email")} />
      <input type="file" {...register("file")} />
      <input type="hidden" {...register("hidden")} />
      <input type="image" {...register("image")} />
      <input type="month" {...register("month")} />
      <input type="password" {...register("password")} />
      <input type="radio" {...register("radio")} />
      <input type="range" {...register("range")} />
      <input type="search" {...register("search")} />
      <input type="tel" {...register("tel")} />
      <input type="time" {...register("time")} />
      <input type="url" {...register("url")} />
      <input type="week" {...register("week")} />

      <select></select>

      <textarea />
      <button>Submit</button>
    </form>
  );
}
