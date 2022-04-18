import { getAbstractControlValue } from ".";
import { Form } from './elements/index';




describe('extractValues', () => {


  test('should extract values from a simple formGroup', () => {
    const form = Form.Group({
      'login': Form.Control('some login'),
      'password': Form.Control('some password')
    });

    expect(getAbstractControlValue(form)).toEqual({
      'login': 'some login',
      'password': 'some password'
    });
  })

  test('should extract values from a formGroup with nesting', () => {
    const form = Form.Group({
      'login': Form.Control('some login'),
      'password': Form.Control('some password'),
      'nested': Form.Group({
        'nestedLogin': Form.Control('some nested login'),
        'nestedPassword': Form.Control('some nested password')
      })
    });
    
    expect(getAbstractControlValue(form)).toEqual({
      'login': 'some login',
      'password': 'some password',
      'nested': {
        'nestedLogin': 'some nested login',
        'nestedPassword': 'some nested password'
      }
    });
  })


  test('should extract values from a formGroup with nested array', () => {
    const form = Form.Group({
      'login': Form.Control('some login'),
      'password': Form.Control('some password'),
      'nested': Form.Array([
        Form.Group({
          'nestedLogin': Form.Control('some nested login'),
          'nestedPassword': Form.Control('some nested password')
        })
      ])
    });
    
    expect(getAbstractControlValue(form)).toEqual({
      'login': 'some login',
      'password': 'some password',
      'nested': [
        {
          'nestedLogin': 'some nested login',
          'nestedPassword': 'some nested password'
        }
      ]
    });
  })
})