declare module 'tailwind-merge' {
  export function twMerge(...classLists: Array<string | undefined | null | false>): string;
  export function twJoin(...classLists: Array<string | undefined | null | false>): string;
  export function twMergeWithConfig(config: any): (...classLists: Array<string | undefined | null | false>) => string;
}
