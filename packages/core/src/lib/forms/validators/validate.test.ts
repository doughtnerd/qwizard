
import { Nothing } from '../../utility-types';
import { AbstractControl, Form } from '../elements';
import { FormControl } from '../elements/FormControl';
import { isFormGroup } from '../elements/FormGroup';
import { ValidationError, ValidatorArgumentError } from './errors';
import { AsyncFormControlValidatorFn, Validators } from './index';
import { validateFormArray, validateFormControl, validateFormGroup } from './validate';
import { FormArrayValidatorFn, FormControlValidatorFn, FormGroupValidatorFn } from './validator.types';


const exampleFormGroupValidator: FormGroupValidatorFn = (input: AbstractControl) => {
  if (!isFormGroup(input)) {
    throw new ValidatorArgumentError('exampleFormGroupValidator: Expected control to be a form group');
  }

  const passwordText = (input.controls.password as FormControl).control.value
  const confirmPasswordText = (input.controls.confirmPassword as FormControl).control.value

  if (passwordText !== confirmPasswordText) {
    return {
      confirmPassword: new ValidationError('Passwords do not match')
    }
  }

  return
} 

const usernameAlreadyExistsValidator: AsyncFormControlValidatorFn = async (input: AbstractControl) => {

  const username = (input as FormControl).control.value;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === 'username') {
        resolve({
          username: new ValidationError('Username already exists')
        })
      } else {
        resolve(undefined as Nothing)
      }
    }, 1000);
  })
}

describe('#validateFormGroup', () => {

  it('Should validate top level validator', async () => {
    const formGroup = Form.Group({
      password: Form.Control('', []),
      confirmPassword: Form.Control('asdf', [])
    }, [exampleFormGroupValidator]);

    const validationResult = await validateFormGroup(formGroup)

    const expectedErrorsObject = {
      errors: {
        confirmPassword: expect.any(ValidationError)
      },
      isValid: false,
      password: {
        errors: {},
        isValid: true,
      },
      confirmPassword: {
        errors: {},
        isValid: true,
      }
    }

    expect(validationResult).toEqual(expectedErrorsObject)
  })

  it('Should be able to validate with an async validator', async () => {
    const formGroup = Form.Group({
      username: Form.Control('username', [],[usernameAlreadyExistsValidator as AsyncFormControlValidatorFn]),
    }, []);

    const validationResult = await validateFormGroup(formGroup)

    const expectedErrorsObject = {
      errors: {},
      isValid: false,
      username: {
        isValid: false,
        errors: {
          username: expect.any(ValidationError)
        },
      }
    }

    expect(validationResult).toEqual(expectedErrorsObject)
  })
})

describe('#validateFormArray', () => {

  it('Should validate with top level validator', async () => {
    const formArray = Form.Array([
      Form.Control('', []),
    ], [Validators.maxLength(0) as FormArrayValidatorFn])

    const validationResult = await validateFormArray(formArray)

    const expectedErrorsObject = {
      errors: {
        maxLength: expect.any(ValidationError)
      },
      isValid: false,
      0: {
        errors: {},
        isValid: true
      }
    }

    expect(validationResult).toEqual(expectedErrorsObject)
  })

  it('Should validate with multiple top level validators', async () => {
    const formArray = Form.Array([
      Form.Control('', []),
    ], [Validators.maxLength(0) as FormArrayValidatorFn, Validators.minLength(2) as FormArrayValidatorFn])

    const validationResult = await validateFormArray(formArray)

    const expectedErrorsObject = {
      errors: {
        maxLength: expect.any(ValidationError),
        minLength: expect.any(ValidationError)
      },
      isValid: false,
      0: {
        errors: {},
        isValid: true
      }
    }

    expect(validationResult).toEqual(expectedErrorsObject)
  })

  it('Should validate with control element validators', async () => {
      const formArray = Form.Array([
        Form.Control('', [Validators.notEmpty as FormControlValidatorFn]),
      ], [])

      const validationResult = await validateFormArray(formArray)
  
      const expectedErrorsObject = {
        errors: {},
        isValid: false,
        0: {
          errors: {
            notEmpty: expect.any(ValidationError)
          },
          isValid: false,
        }
      }
  
      expect(validationResult).toEqual(expectedErrorsObject)
  })

  it('Should validate with a nested (formArray -> formControl) validators', async () => {
    const formArray = Form.Array([
      Form.Array([
        Form.Control('', [Validators.notEmpty as FormControlValidatorFn]),
        Form.Control('abc', [Validators.maxLength(2) as FormControlValidatorFn]),
      ], [])
    ], [])

    const validationResult = await validateFormArray(formArray)
  
    const expectedErrorsObject = {
      0: {
        0: {
          errors: {
            notEmpty: expect.any(ValidationError)
          },
          isValid: false,
        },
        1: {
          errors: {
            maxLength: expect.any(ValidationError)
          },
          isValid: false
        },
        errors: {},
        isValid: false,
      },
      isValid: false,
      errors: {}
    }
  
    expect(validationResult).toEqual(expectedErrorsObject)
  })

  it('Should validate a complex nested form with any and all validators', async () => {
    const formArray = Form.Array([
      Form.Array([
        Form.Group({
          password: Form.Control('', [Validators.notEmpty as FormControlValidatorFn]),
          confirmPassword: Form.Control('asdf', [Validators.notEmpty as FormControlValidatorFn]),
          bar: Form.Array([
            Form.Group({
              foo: Form.Control('', [Validators.notEmpty as FormControlValidatorFn]),
            }, [])
          ], [])
        }, [exampleFormGroupValidator]),
        Form.Control('abc', [Validators.maxLength(2) as FormControlValidatorFn]),
      ], [])
    ], [])

    const validationResult = await validateFormArray(formArray)
  
    const expectedErrorsObject = {
      0: {
        0: {
          errors: {
            confirmPassword: expect.any(ValidationError),
          },
          isValid: false,
          password: {
            errors: {
              notEmpty: expect.any(ValidationError)
            },
            isValid: false,
          },
          confirmPassword: {
            errors: {},
            isValid: true,
          },
          bar: {
            0: {
              foo: {
                errors: {
                  notEmpty: expect.any(ValidationError)
                },
                isValid: false,
              },
              errors: {},
              isValid: false,
            },
            errors: {},
            isValid: false,
          }
        },
        1: {
          errors: {
            maxLength: expect.any(ValidationError),
          },
          isValid: false,
        },
        errors: {},
        isValid: false,
      },
      errors: {},
      isValid: false,
    }
  
    expect(validationResult).toEqual(expectedErrorsObject)
  })
})

describe('#validateFormControl', () => {

  it('Should be able to validate with an async validator', async () => {
    const formControl = Form.Control('username', [],[usernameAlreadyExistsValidator as AsyncFormControlValidatorFn])

    const validationResult = await validateFormControl(formControl)

    const expectedErrorsObject = {
      errors: {
        username: expect.any(ValidationError)
      },
      isValid: false,
    }

    expect(validationResult).toEqual(expectedErrorsObject)
  })

  it('Should be able to validate with a mix of sync and async validators', async () => {
    const formControl = Form.Control('username', [Validators.maxLength(2) as FormControlValidatorFn],[usernameAlreadyExistsValidator as AsyncFormControlValidatorFn])

    const validationResult = await validateFormControl(formControl)

    const expectedErrorsObject = {
      errors: {
        username: expect.any(ValidationError),
        maxLength: expect.any(ValidationError)
      },
      isValid: false,
    }

    expect(validationResult).toEqual(expectedErrorsObject)
  })


  it('Should validate with a top level validator', async () => {
    const formControl = Form.Control('', [Validators.regex(/[a-z]/) as FormControlValidatorFn])

    const validationResult = await validateFormControl(formControl)

    const expectedErrorsObject = {
      errors: {
        regex: expect.any(ValidationError),
      },
      isValid: false,
    }

    expect(validationResult).toEqual(expectedErrorsObject)
  })

  it('Should validate with multiple top level validators', async () => {
    const formControl = Form.Control('', [Validators.minLength(1) as FormControlValidatorFn, Validators.notEmpty as FormControlValidatorFn])

    const validationResult = await validateFormControl(formControl)

    const expectedErrorsObject = {
      errors: {
        minLength: expect.any(ValidationError),
        notEmpty: expect.any(ValidationError),
      },
      isValid: false,
    }

    expect(validationResult).toEqual(expectedErrorsObject)
  })
})