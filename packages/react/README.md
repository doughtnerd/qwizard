# Qwizard React

React bindings for [Qwizard Core](https://www.npmjs.com/package/@doughtnerd/qwizard-core)


## Usage
From this library, you will use two main parts of the API:
- The `FormConfig` object to build your configs
- The `Form` component to render your form

### Using `FormConfig`
This is a helper object to create `FormGroupConfig`s, `FormArrayConfig`s, and `FormControlConfig`s.

To learn more about using the form config types, see [Form Config API](#form-configs)

```tsx
import { 
  FormConfig,
  FormControlConfig,
  FormGroupConfig ,
  FormArrayConfig
} from "@doughtnerd/qwizard-react";

const formControl: FormControlConfig = FormConfig.Control('')
const formGroup: FormGroupConfig = FormConfig.Group({})
const formArray: FormArrayConfig = FormConfig.Array([])
```

### Using `Form` Component
In order for your configs to be useful, you need to use the `Form` component to render your form.

To learn more about how the component works, see [Form API](#form-component)
```tsx
import { 
  Form,
  FormConfig,
  FormControlConfig,
  FormGroupConfig,
  FormArrayConfig
} from "@doughtnerd/qwizard-react";


function ExampleForm(): JSX.Element {
  const formControl: FormControlConfig = FormConfig.Control('')

  // The config prop will accept any form config type from this library
  return <Form config={formControl} />
}
```

## API

### Form Configs


#### `FormControlConfig`
This represents a single input on a form, like "First Name" or "State"

```tsx
import { 
  Form,
  FormConfig,
  FormControlConfig
} from "@doughtnerd/qwizard-react";


const formControl: FormControlConfig = FormConfig.Control('', {
  /**
   * Use renderComponent to specify the component to use to render the input. 
   * You can use any Functional Component here.
   */ 
  renderComponent: MyInput // From MyInput.tsx
  // This is the data used during render
  renderData: {
    /**
     * If you have static props you want to supply to the component, 
     * set them here. They will be passed to your component.
     */ 
    inputProps: {
      id: 'example-input',
      type: 'text'
    },
    // Specify when to run validations. Defaults to blur
    validateOn: 'input',
    // Whether or not to use native HTML spec form validation. Defaults to false.
    enableNativeValidation: false,
    // What to do after the component validates. You shouldn't need to use this.
    onValidated
  }
}, 
  [Validators.notEmpty], // Sync validators go here 
  [] // Async validators go here
)

```

#### `FormGroupConfig`
This represents a grouping of controls on your form.

```tsx
import { 
  Form,
  FormConfig,
  FormControlConfig,
  FormGroupConfig
} from "@doughtnerd/qwizard-react";


const formControl: FormGroupConfig = FormConfig.Group({
  password: FormConfig.Control(''),
  confirmPassword: FormConfig.Control('')
}, {
  /**
   * Use renderComponent to specify the component to use to render your FormGroupConfig. Optional
   */ 
  renderComponent: ({children, errors}) => {
    return children
  } 
  // This is the data used during render
  renderData: {
    /**
     * You can specify a component to use for all form controls in the group.
     */
    componentTemplate: MyInput
    /**
     * If using componentTemplate, this function allows you
     * to dynamically get props for each component
     */
    propsTemplate: (controlName: string) => {
      return {
        id: controlName
      }
    },
    // Specify when to run validations on children. Defaults to blur.
    validateOn: 'input',
    // If the FormGroupConfig should wait until all child forms validate before validating iteself.
    childrenFirst: false,
    // What to do after the component validates. You shouldn't need to use this.
    onValidated
  }
}, 
  [], // Sync validators for the group go here 
  [] // Async validators for the group go here
)

```

#### `FormArrayConfig`
This represents a grouping of controls on your form.

```tsx
import { 
  Form,
  FormConfig,
  FormControlConfig,
  FormArrayConfig
} from "@doughtnerd/qwizard-react";


const formControl: FormArrayConfig = FormConfig.Array([
  FormConfig.Control('')
], {
  /**
   * Use renderComponent to specify the component to use to render your FormArrayConfig. Optional
   */ 
  renderComponent: ({children, errors}) => {
    return children
  } 
  // This is the data used during render
  renderData: {
    /**
     * You can specify a component to use for all form controls in the array.
     */
    componentTemplate: MyInput
    /**
     * If using componentTemplate, this function allows you
     * to dynamically get props for each component
     */
    propsTemplate: (index: number) => {
      return {
        id: `example-input-${index}`
      }
    },
    // Specify when to run validations on children. Defaults to blur.
    validateOn: 'input',
    // If the FormArrayConfig should wait until all child forms validate before validating iteself.
    childrenFirst: false,
    // What to do after the component validates. You shouldn't need to use this.
    onValidated
  }
}, 
  [], // Sync validators for the array go here 
  [] // Async validators for the array go here
)

```

### Form Component
This component will render your entire form.

```tsx

<Form 
  // Your form config goes here
  config={config} 
  // Any props you want to supply to the `form` element go here
  formProps={{style: {display: 'flex'}}}
  // Callback for after the form has validated
  onValidate={
    (results: ValidationResults) => {
      console.log("I've Validated!", results)
    }
  }
  // Callback for when the user submits the form. Prevents default behavior
  onSubmit={
    (event: CustomEvent) => {
      console.log("I'm Submitting!", event.detail)
    }
  }
  // If you'd rather use a function to render the form content (like if you want to reposition the form)
  renderFormContent={
    (childElement: React.ReactNode) => {
      return (
        <>
          <h1>My Cool Form!</h1>
          {childElement}
          <button type="submit">Submit</button>
        </>
      )
    }
  }
  // You can also supply children. They default to rendering below the form
  children={<button type="submit">Submit</button>}
/>

```

---
This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test react` to execute the unit tests via [Jest](https://jestjs.io).
