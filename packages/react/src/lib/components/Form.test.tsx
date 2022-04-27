
import { act, render } from '@testing-library/react';
import { PropsWithChildren } from 'react';
import { AbstractFormControlConfig, FormConfig as FFactory } from '.';
import { Form, FormConfig } from './Form';

const form1: AbstractFormControlConfig = FFactory.Group({
  name: FFactory.Control('')
}, {
  renderComponent: () => <div>form1</div>,
  renderData: {}
})

const form2: AbstractFormControlConfig = FFactory.Group({
  name: FFactory.Control('')
}, {
  renderComponent: () => <div>form2</div>,
  renderData: {}
})

const defaultProps: PropsWithChildren<FormConfig> = {
  config: form1,
}

describe('Form', () => {

  test('it can be set to one config and switched to another', () => {
    const {getByText, rerender} = render(<Form {...{...defaultProps, config: form1}}></Form>)

    getByText('form1')

    act(() => {
      rerender(<Form {...{...defaultProps, config: form2}}></Form>)
    })

    getByText('form2')
  })
})