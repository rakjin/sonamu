/*
  fetch
*/
import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import { z, ZodIssue } from "zod";

export async function fetch(options: AxiosRequestConfig) {
  try {
    const res = await axios({
      ...options,
    });
    return res.data;
  } catch (e: unknown) {
    if (axios.isAxiosError(e) && e.response && e.response.data) {
      const d = e.response.data as {
        message: string;
        issues: ZodIssue[];
      };
      throw new SonamuError(e.response.status, d.message, d.issues);
    }
    throw e;
  }
}

export class SonamuError extends Error {
  isSonamuError: boolean;

  constructor(
    public code: number,
    public message: string,
    public issues: z.ZodIssue[]
  ) {
    super(message);
    this.isSonamuError = true;
  }
}
export function isSonamuError(e: any): e is SonamuError {
  return e && e.isSonamuError === true;
}

export function defaultCatch(e: any) {
  if (isSonamuError(e)) {
    alert(e.message);
  } else {
    alert("에러 발생");
  }
}

/*
  Isomorphic Types
*/
export type ListResult<T> = {
  rows: T[];
  total?: number;
};

export type EnumsLabel<T extends string, L extends "ko" | "en"> = {
  [key in T]: { [lang in L]: string };
};
export type EnumsLabelKo<T extends string> = EnumsLabel<T, "ko">;

/*
  SWR
*/
export type SwrOptions = {
  conditional?: () => boolean;
};
export type SWRError = {
  name: string;
  message: string;
  statusCode: number;
};
export async function swrFetcher(
  url: string,
  params: string = ""
): Promise<any> {
  try {
    const res = await axios.get(url + "?" + params);
    return res.data;
  } catch (e: any) {
    const error: any = new Error(
      e.response.data.message ?? e.response.message ?? "Unknown"
    );
    error.statusCode = e.response?.data.statusCode ?? e.response.status;
    throw error;
  }
}
export function handleConditional(
  route: string | string[],
  conditional?: () => boolean
): string | string[] | null {
  if (conditional) {
    return conditional() ? route : null;
  }
  return route;
}

/*
  Utils
*/
export function zArrayable<T extends z.ZodTypeAny>(
  shape: T
): z.ZodUnion<[T, z.ZodArray<T, "many">]> {
  return z.union([shape, shape.array()]);
}

/*
  Custom Scalars
*/
export const SQLDateTimeString = z
  .string()
  .regex(/([0-9]{4}-[0-9]{2}-[0-9]{2}( [0-9]{2}:[0-9]{2}:[0-9]{2})*)$/, {
    message: "잘못된 SQLDate 타입",
  })
  .min(10)
  .max(19)
  .describe("SQLDateTimeString");
export type SQLDateTimeString = z.infer<typeof SQLDateTimeString>;
