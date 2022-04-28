
import { Form, FormControl, FormControlWithValidators, FormGroup } from './elements';
import { isFormControl } from './elements/FormControl';
import { FormControlValidatorFn, validateAbstractControl, Validators } from './validators';
import { ValidationError, ValidatorArgumentError } from './validators/errors';

describe('Advanced Usage Tests', () => {

  test('Can do conditional validators using a Proxy', async () => {
    const formGroup = Form.Group({
      occupation: Form.Control('', [Validators.notEmpty as FormControlValidatorFn]),
      jobTitle: Form.Control('')
    })
    const occupation = formGroup.controls.occupation as FormControlWithValidators

    const proxyOccupationControl = new Proxy(occupation.control, {
      set: (target, key, value) => {
        if (value === 'Other') {
          (formGroup.controls['jobTitle'] as FormControlWithValidators).validators = [Validators.notEmpty as FormControlValidatorFn]
        } else {
          (formGroup.controls['jobTitle'] as FormControlWithValidators).validators = [Validators.notEmpty as FormControlValidatorFn]
        }
        return Reflect.set(target, key, value)
      }
    })

    occupation.control = proxyOccupationControl

    expect(await validateAbstractControl(formGroup)).toEqual({
      errors: {},
      isValid: false,
      occupation: {
        errors: {
          notEmpty: expect.any(ValidationError)
        },
        isValid: false
      },
      jobTitle: {
        errors: {},
        isValid: true
      }
    })

    occupation.control.value = 'Other'

    expect(await validateAbstractControl(formGroup)).toEqual({
      errors: {},
      isValid: false,
      occupation: {
        errors: {},
        isValid: true
      },
      jobTitle: {
        errors: {
          notEmpty: expect.any(ValidationError)
        },
        isValid: false
      }
    })

    ;(formGroup.controls.jobTitle as FormControlWithValidators).control.value = 'Influencer'

    expect(await validateAbstractControl(formGroup)).toEqual({
      errors: {},
      isValid: true,
      occupation: {
        errors: {},
        isValid: true
      },
      jobTitle: {
        errors: {},
        isValid: true
      }
    })
  })

  test('Can do conditional validation with a custom form-accessing validator', async () => {
    function createCustomValidator(formAccessor: () => FormGroup): FormControlValidatorFn {
      return (control: FormControl) => {
        if (!isFormControl(control)) {
          throw new ValidatorArgumentError('custom: control must be a FormControl')
        }

        const form = formAccessor()
        const occupationControl = form.controls.occupation as FormControlWithValidators
        
        if (occupationControl.control.value === 'Other' && !control.control.value) {
          return {
            custom: new ValidationError('Custom Validator Error')
          }
        }
        return undefined
      }
    }

    const formGroup = Form.Group({
      occupation: Form.Control('Other', [Validators.notEmpty as FormControlValidatorFn]),
      jobTitle: Form.Control('', [createCustomValidator(() => formGroup)])
    })

    expect(await validateAbstractControl(formGroup)).toEqual({
      errors: {},
      isValid: false,
      occupation: {
        errors: {},
        isValid: true
      },
      jobTitle: {
        errors: {
          custom: expect.any(ValidationError)
        },
        isValid: false
      }
    })

    ;(formGroup.controls.occupation as FormControlWithValidators).control.value = 'Ahhhh'

    expect(await validateAbstractControl(formGroup)).toEqual({
      errors: {},
      isValid: true,
      occupation: {
        errors: {},
        isValid: true
      },
      jobTitle: {
        errors: {},
        isValid: true
      }
    })
  })

})