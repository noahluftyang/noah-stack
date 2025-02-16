import type { StandardSchemaV1 } from "@standard-schema/spec";

// 기본 스키마 타입 정의
interface BaseSchema<T> extends StandardSchemaV1<T> {
  readonly "~standard": StandardSchemaV1.Props<T>;
}

// 문자열 스키마
export function createStringSchema(
  options: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
  } = {},
): BaseSchema<string> {
  return {
    "~standard": {
      version: 1,
      vendor: "standard-schema-form",
      validate(value: unknown) {
        if (typeof value !== "string") {
          return {
            issues: [{ message: "문자열이어야 합니다." }],
          };
        }

        if (options.required && value.length === 0) {
          return {
            issues: [{ message: "필수 입력값입니다." }],
          };
        }

        if (options.minLength && value.length < options.minLength) {
          return {
            issues: [
              { message: `최소 ${options.minLength}자 이상이어야 합니다.` },
            ],
          };
        }

        if (options.maxLength && value.length > options.maxLength) {
          return {
            issues: [
              { message: `최대 ${options.maxLength}자까지 가능합니다.` },
            ],
          };
        }

        if (options.pattern && !options.pattern.test(value)) {
          return {
            issues: [{ message: "올바른 형식이 아닙니다." }],
          };
        }

        return { value };
      },
      types: {
        input: String() as string,
        output: String() as string,
      },
    },
  };
}

// 숫자 스키마
export function createNumberSchema(
  options: {
    required?: boolean;
    min?: number;
    max?: number;
    integer?: boolean;
  } = {},
): BaseSchema<number> {
  return {
    "~standard": {
      version: 1,
      vendor: "standard-schema-form",
      validate(value: unknown) {
        const num = Number(value);

        if (isNaN(num)) {
          return {
            issues: [{ message: "유효한 숫자가 아닙니다." }],
          };
        }

        if (options.required && value === undefined) {
          return {
            issues: [{ message: "필수 입력값입니다." }],
          };
        }

        if (options.min !== undefined && num < options.min) {
          return {
            issues: [{ message: `${options.min} 이상이어야 합니다.` }],
          };
        }

        if (options.max !== undefined && num > options.max) {
          return {
            issues: [{ message: `${options.max} 이하여야 합니다.` }],
          };
        }

        if (options.integer && !Number.isInteger(num)) {
          return {
            issues: [{ message: "정수여야 합니다." }],
          };
        }

        return { value: num };
      },
      types: {
        input: Number() as number,
        output: Number() as number,
      },
    },
  };
}

// 이메일 스키마
export function createEmailSchema(
  options: { required?: boolean } = {},
): BaseSchema<string> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return {
    "~standard": {
      version: 1,
      vendor: "standard-schema-form",
      validate(value: unknown) {
        if (typeof value !== "string") {
          return {
            issues: [{ message: "이메일은 문자열이어야 합니다." }],
          };
        }

        if (options.required && value.length === 0) {
          return {
            issues: [{ message: "이메일은 필수 입력값입니다." }],
          };
        }

        if (!emailRegex.test(value)) {
          return {
            issues: [{ message: "유효한 이메일 형식이 아닙니다." }],
          };
        }

        return { value };
      },
      types: {
        input: String() as string,
        output: String() as string,
      },
    },
  };
}

// 폼 스키마 생성 헬퍼
export function createFormSchema<T extends Record<string, BaseSchema<any>>>(
  schema: T,
) {
  return {
    "~standard": {
      version: 1,
      vendor: "standard-schema-form",
      validate(value: unknown) {
        if (typeof value !== "object" || value === null) {
          return {
            issues: [{ message: "객체여야 합니다." }],
          };
        }

        const issues: StandardSchemaV1.Issue[] = [];
        const result: Record<string, any> = {};

        for (const [key, fieldSchema] of Object.entries(schema)) {
          const fieldValue = (value as any)[key];
          const fieldResult = fieldSchema["~standard"].validate(fieldValue);

          if ("issues" in fieldResult) {
            issues.push(
              ...fieldResult.issues.map((issue) => ({
                ...issue,
                path: [key, ...(issue.path || [])],
              })),
            );
          } else {
            result[key] = fieldResult.value;
          }
        }

        if (issues.length > 0) {
          return { issues };
        }

        return { value: result };
      },
    },
  };
}
