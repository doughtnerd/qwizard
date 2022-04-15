import {
  AbstractControl,
  AsyncFormControlValidatorFn,
  FormControl,
  FormControlValidatorFn,
  FormGroupValidatorFn,
  isFormControl,
  isFormGroup,
  Nothing,
  ValidationError,
  ValidationErrors,
  ValidatorArgumentError,
} from "@doughtnerd/qwizard-core";

export const exampleFormGroupValidator: FormGroupValidatorFn = (
  input: AbstractControl
) => {
  if (!isFormGroup(input)) {
    throw new ValidatorArgumentError(
      "exampleFormGroupValidator: Expected control to be a form group"
    );
  }

  const passwordText = (input.controls.password as FormControl).control.value;
  const confirmPasswordText = (input.controls.confirmPassword as FormControl)
    .control.value;

  if (passwordText !== confirmPasswordText) {
    return {
      confirmPassword: new ValidationError("Passwords do not match"),
    };
  }

  return
};

export const usernameAlreadyExistsValidator: AsyncFormControlValidatorFn = async (
  input: AbstractControl
) => {
  const username = (input as FormControl).control.value;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === "username@gmail.com") {
        resolve({
          username: new ValidationError("Username already exists"),
        });
      } else {
        resolve(undefined as Nothing);
      }
    }, 1000);
  });
};

export const passwordComplexityValidator: FormGroupValidatorFn = (
  input: AbstractControl
) => {
  if (isFormGroup(input)) {
    const password = (input.controls.password as FormControl).control.value;

    const errors: ValidationErrors = {};

    if (!password || password.length < 8) {
      errors.passwordLength = new ValidationError(
        "Password must be at least 8 characters"
      );
    }

    if (!/[_!@#$%^&*]{1,}/.test(password)) {
      errors.mustContainSpecialCharacters = new ValidationError(
        "Password must contain at least one special character"
      );
    }

    return errors;
  }
  throw new ValidatorArgumentError(
    "passwordComplexityValidator: Expected control to be a form group"
  );
};

export const mustAccept: FormControlValidatorFn = (input: AbstractControl) => {
  if (!isFormControl(input)) {
    throw new ValidatorArgumentError('exampleFormGroupValidator: Expected control to be a form group');
  }

  const value = Boolean(input.control.value) ?? false

  if (value !== true) {
    return { mustBeTrue: new ValidationError('Must accept the terms and conditions') }
  }

  return
}