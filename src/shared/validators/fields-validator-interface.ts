export type FieldsErrors = {
  [field: string]: string[];
};

export interface FieldsValidatorInterface<ValidatedProps> {
  errors: FieldsErrors;
  validatedData: ValidatedProps;
  validate(data: any): boolean;
}
