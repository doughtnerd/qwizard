import React from 'react';
import { InterdependentForm } from './Forms/InterdependentForm/InterdependentForm';
import { SignUpForm } from './Forms/SignUp/SignUpForm';

function App() {
  return (
    <>
      <h1>Sign Up Form Demo</h1>
      <p>
        A Demo of using a form with a form group validator
      </p>
      <SignUpForm />
      <h1>Form Demo with </h1>
      <InterdependentForm />
    </>
  );
}

export default App;
