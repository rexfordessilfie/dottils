export function raise(str: string): never {
  throw new Error(str);
}
