export class AssertError extends Error {}

export function assert<T> (
  input: unknown,
  condition: (input: unknown) => boolean,
  message: string
): T {
  if (condition(input)) {
    return input as T
  }

  throw new AssertError(message)
}
