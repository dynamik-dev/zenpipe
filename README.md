# ZenPipe

ZenPipe is a versatile utility function for composing and executing a series of functions in a pipeline. It allows for both synchronous and asynchronous function composition, with flexible execution options.

## Features

- Compose multiple functions into a single pipeline
- Support for both synchronous and asynchronous functions
- Option to run all functions asynchronously
- Automatic handling of mixed synchronous and asynchronous functions
- TypeScript support with generics for input and output types

## Usage

```typescript
import { zenpipe } from './zenpipe';

// Example functions
const double = (x: number) => x * 2;
const addOne = (x: number) => x + 1;
const asyncSquare = async (x: number) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return x * x;
};

// Create a pipeline
const pipeline = zenpipe([double, addOne, asyncSquare]);

// Use the pipeline
pipeline(5).then(result => console.log(result)); // Output: 121
```

## API

### `zenpipe<I, O>(fns: AnyFunc[], options?: ZenPipeOptions): (input: I) => Promise<O>`

Creates a pipeline of functions that can be executed with a single input.

#### Parameters

- `fns`: An array of functions to be composed into a pipeline.
- `options` (optional): An object with the following properties:
  - `runAsync` (optional): If set to `true`, all functions in the pipeline will be executed asynchronously. Default is `false`.

#### Returns

A function that takes an input of type `I` and returns a Promise resolving to type `O`.

## Behavior

1. By default, ZenPipe executes synchronous functions immediately and groups asynchronous functions to be executed at the end of the pipeline.
2. When `runAsync` is set to `true`, all functions are treated as asynchronous and executed in order.
3. The pipeline always returns a Promise, regardless of whether the functions are synchronous or asynchronous.

## Types

```typescript
type AnyFunc = (...args: any[]) => any;

interface ZenPipeOptions {
  runAsync?: boolean;
}
```

## Examples

### Mixed Synchronous and Asynchronous Functions

```typescript
const pipeline = zenpipe([
  (x: number) => x + 1,
  async (x: number) => x * 2,
  (x: number) => x.toString()
]);

pipeline(5).then(console.log); // Output: "12"
```

### Forcing Asynchronous Execution

```typescript
const pipeline = zenpipe([
  (x: number) => x + 1,
  (x: number) => x * 2,
  (x: number) => x.toString()
], { runAsync: true });

pipeline(5).then(console.log); // Output: "12"
```

## Notes

- The pipeline preserves the order of function execution as specified in the input array.
- When using TypeScript, you can specify input and output types for better type inference: `zenpipe<number, string>([...])`.
- Error handling should be implemented by the user, either within the pipeline functions or when consuming the result of the pipeline.

## Contributing

Feel free to submit issues or pull requests if you have suggestions for improvements or find any bugs.
