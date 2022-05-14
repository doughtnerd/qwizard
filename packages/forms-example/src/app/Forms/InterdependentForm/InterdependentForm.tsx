import { FormControl, ValidationError, ValidatorFn } from "@doughtnerd/qwizard-core";
import { Form, FormConfig } from "@doughtnerd/qwizard-react";
import { MyInput } from "../../Inputs/MyInput";

const ageValidator: ValidatorFn = (formControl: FormControl) => {
  if (formControl.control.value > 100) {
    return {
      age: new ValidationError('Age must be less than 100')
    }
  }

  return undefined
}

function createStateAgeValidator(ageControlAccessor: () => FormControl) {
  return (stateFormControl: FormControl) => {
    if (stateFormControl.control.value === 'UT' && ageControlAccessor().control.value > 100) {
      return {
        ageForState: new ValidationError('Age must be less than 100 in UT')
      }
    }

    return undefined
  }
}

const ageForm = FormConfig.Control('', {
  renderComponent: MyInput,
  renderData: {
    inputProps: {
      type: 'number',
      placeholder: 'Age',
      name: 'age'
    },
    validateOn: 'input'
  }
}, [ageValidator])

const stateForm = FormConfig.Control('', {
  renderComponent: MyInput,
  renderData: {
    inputProps: {
      placeholder: 'State',
      name: 'state'
    },
    validateOn: 'input'
  }
}, [createStateAgeValidator(() => ageForm)])

const formParent = FormConfig.Group({
  age: ageForm,
  state: stateForm
}, {
  renderData: {}
})

export function InterdependentForm() {
  return (
    <>
    <Form formProps={{
          style: { display: "flex", flexDirection: "column", margin: "16px" },
        }} 
        config={formParent} 
      />
      {/* <Form formProps={{
          style: { display: "flex", flexDirection: "column", margin: "16px" },
        }} 
        config={formParent.controls.age} 
      />
      <Form formProps={{
          style: { display: "flex", flexDirection: "column", margin: "16px" },
        }} 
        config={formParent.controls.state} 
      /> */}
    </>
  )
}