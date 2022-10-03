export interface UseCase<Input, Output> {
  execute(input: Input): Output | Promise<Output>;
  toOutput(entity: any): Output;
}
