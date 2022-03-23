import { Form, FormConfig } from '@qwizard/react';
import React from 'react';
import { MyInput } from '../Inputs/MyInput';
import { mustAccept } from '../validators';




function TocFormComponent({children}: any): JSX.Element {
  return (
    <>
      <h3>Terms and Conditions</h3>
      {children}
      <button type="submit">Submit</button>
    </>
  )
}

export function TOCForm() {
  const tocForm = FormConfig.Array([
    FormConfig.Control(false, undefined, [mustAccept]),
    FormConfig.Control(false, undefined, [mustAccept]),
    FormConfig.Control(false, undefined, [mustAccept]),
    FormConfig.Control(false, undefined, [mustAccept]),
  ], {
    renderComponent: TocFormComponent,
    renderData: {
      componentTemplate: MyInput,
      propsTemplate: (controlName: string) => ({
        id: `toc-${controlName}`,
        type: 'checkbox',
        name: `toc-${controlName}`,
        labelText: 'TOC ' + (Number.parseInt(controlName) + 1),
      }),
      validateOn: 'input'
    }
  })
 
  return (
    <Form config={tocForm} />
    
  );
}
