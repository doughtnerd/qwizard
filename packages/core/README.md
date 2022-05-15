# Qwizard Core

- [Jump to usage](#usage)
  - [Building Forms](#building-forms)
  - [Validating Forms](#validating-forms)
  - [Custom Validators](#custom-validators)

## What is it?
Right now, it's a framework-agnostic, stateless, form-building library with an API modeled after Angular's form API.

## Why is it?
This mostly began as an experiment to see what building a JS focused, stateless, semi-functional-programming style forms library might look like. 

In it's future though, I hope to turn it into a forms-as-data focused library where an entire wizard-style form workflow could be modeled as json with this library generating the runtime necessary to facilitate the experience. If that can be pulled off, a dev team could develop the simple building blocks (a component library) tailored to company UX and infrastructure and **anyone** could then build/manage complex form-based workflows and make live changes without requiring deployments or dev intervention, just by using a GUI and saving their 'Wizard' experience as JSON in a DB.

## Usage

### Building Forms
The most fundamental part of the API is the `Form` object. You use it to build your forms.


You use it to construct a single-input control of your form, called a `FormControl`.

```tsx
import { Form, FormControl, Validators } from '@doughtnerd/qwizard-core'

// A FormControl represents an individual 'input' of the form
const formControl: FormControl = Form.Control()

// You can provide a default value
const formControl: FormControl = Form.Control("I'm a default!")

// You can set the validators to use
const formControl: FormControl = Form.Control('', [Validators.notEmpty])

// You can use async validation
const formControl: FormControl = Form.Control('user@email.com', [], [checkWithServerToEnsureUsernameNotTakenValidator])

```

Or to construct a grouping of controls, called a `FormGroup`.
```tsx
import { Form, FormGroup, Validators } from '@doughtnerd/qwizard-core'

// Here we group two different FormControls like you might find on a Login page
const formGroup: FormGroup = Form.Group({
  username: Form.Control(),
  password: Form.Control()
})

// You can validate a whole FormGroup, like you might find on a sign-up page
const formGroup: FormGroup = Form.Group({
  password: Form.Control(),
  confirmPassword: Form.Control()
}, [passwordsMatchValidator])

// You can also use async validation on a FormGroup, like when you have a list of names on a server of people you don't like.
const formGroup: FormGroup = Form.Group({
  firstName: Form.Control(),
  lastName: Form.Control()
}, [], [checkThatWeDontHateYouValidator])
```

Or to construct an array of controls, called a `FormArray`
```tsx
import { Form, FormArray, Validators } from '@doughtnerd/qwizard-core'

// Here we create an array where a user can enter an ice-cream flavor and notes about it with one default entry.
const formArray: FormArray = Form.Array([
  Form.Group({
    flavorName: Form.Control(),
    notes: Form.Control()
  })
])

// You can use validators and async validators on arrays, just like Groups or Controls
const formArray: FormArray = Form.Array([
  Form.Group({
    flavorName: Form.Control(),
    notes: Form.Control()
  })
], [Validators.maxLength(5)])

// You can treat the controls array on the FormArray just like you would a normal array. Want to add a control? Do it.
const formArray: FormArray = Form.Array([], [Validators.maxLength(5)])

formArray.controls.push(
  Form.Group({
    flavorName: Form.Control(),
    notes: Form.Control()
  })
)

// Same goes for removing or completely reassigning the array
const formArray: FormArray = Form.Array([])

// This works
formArray.controls.pop() 

// This works too
formArray.controls = [
  Form.Group({
    flavorName: Form.Control(),
    notes: Form.Control()
  })
] 

```

### Validating Forms
The easiest way to validate your form is to use the `validateAbstractControl` function.

```tsx
import { 
  Form, 
  Validators,
  ValidationResultsTree, 
  validateAbstractControl 
} from '@doughtnerd/qwizard-core'

const formGroup = Form.Group({
  password: Form.Control('', [Validators.notEmpty]),
  confirmPassword: Form.Control()
});

async function runValidation() {
  const validationResult: ValidationResultsTree = await validateAbstractControl(formGroup)

  // Do something with the result
}
```

### Custom Validators
The library has a handful of built-in validators provided on the `Validators` object but you can easily make your own.

```tsx
import { 
  AbstractControl,
  Form, 
  FormControlValidatorFn,
  FormControl,
  ValidatorFn, 
  ValidationError,
  ValidationErrors,
  ValidatorArgumentError,
  isFormControl,
  isFormGroup
} from '@doughtnerd/qwizard-core'

// Here we make a validator that only works with FormControls
const myCustomValidator: FormControlValidatorFn = (input: FormControl) => {
  // If you're not working with TS, it may be helpful to use the `isFormControl` function here, just in case...
  if(!isFormControl(input)) {
    throw new ValidatorArgumentError('Hey, quit trying to use me on anything but a FormControl')
  }
  
  const controlValue = input.control.value
  if(controlValue === 'Gilgamesh') {
    return {
      notGilgamesh: new ValidationError("Sorry, Emiya doesn't like Gilgamesh")
    }
  }

  return
}

// Want your validator to work with more than one type of form control? Use the `ValidatorFn` type instead.
const myCustomValidator: ValidatorFn = (input: AbstractControl) => {
  // You should still check to make sure the validator is getting used on the right types of controls though.

  if(isFormGroup(input)) {
    // Do your validator logic
  }

  if(isFormControl(input)) {
    // Do your validator logic
  }

  return
}

// Pro tip, need to provide an argument to your validator? Use higher-order-functions, just like the built-in regex validator does.
function regexValidator(regex: RegExp): ValidatorFn {
  const validator: ValidatorFn = (input: FormControl) => {
    if (!isFormControl(input)) {
      throw new ValidatorArgumentError('regex: input is not a FormControl')
    }
    
    const isValid = regex.test(input.control.value)

    if(!isValid) {
      return { regex: new ValidationError(`Input value must match the pattern ${regex}. Value was ${input.control.value}`) }
    }

    return
  }

  return validator
}
```


---
## Building

Run `nx build core` to build the library.

## Running unit tests

Run `nx test core` to execute the unit tests via [Jest](https://jestjs.io).
