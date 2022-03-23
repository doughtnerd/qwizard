import { Form, FormConfig } from "@qwizard/react";
import React from "react";
import { MyInput } from "../../Inputs/MyInput";
import {
  exampleFormGroupValidator,
  passwordComplexityValidator,
  usernameAlreadyExistsValidator
} from "../../validators";
import { PasswordCriteriaList } from "./components/PasswordCriteriaList";



function PasswordsFormGroup({ children, errors, hasValidated }: any) {
  return (
    <>
      {children}
      <PasswordCriteriaList errors={errors} hasValidated={hasValidated} />
    </>
  );
}

export function SignUpForm() {
  const signUpForm = FormConfig.Group(
    {
      username: FormConfig.Control(
        "",
        {
          renderComponent: MyInput,
          renderData: {
            inputProps: {
              id: "username",
              type: "email",
              name: "username",
              labelText: "Username",
            },
            validateOn: "blur",
          },
        },
        [],
        [usernameAlreadyExistsValidator]
      ),
      passwords: FormConfig.Group(
        {
          password: FormConfig.Control("", {
            renderComponent: MyInput,
            renderData: {
              inputProps: {
                id: "password",
                type: "password",
                name: "password",
                labelText: "Password",
              },
            },
          }),
          confirmPassword: FormConfig.Control("", {
            renderComponent: MyInput,
            renderData: {
              inputProps: {
                id: "confirmPassword",
                type: "password",
                name: "confirmPassword",
                labelText: "Confirm Password",
              },
            },
          }),
        },
        {
          renderComponent: PasswordsFormGroup,
          renderData: {
            validateOn: "input",
          },
        },
        [exampleFormGroupValidator, passwordComplexityValidator]
      ),
    },
    {
      renderComponent: ({ children }) => {
        return (
          <>
            <h3>Sign Up</h3>
            {children}
            <button type="submit">Sign Up</button>
          </>
        );
      },
      renderData: {
        childrenFirst: true,
        onValidated: () => {
          console.log("onValidated");
        },
      },
    }
  );

  return (
    <Form
      formProps={{
        style: { display: "flex", flexDirection: "column", margin: "16px" },
      }}
      onSubmit={({detail}) => {console.log(detail)}}
      config={signUpForm}
    />
  );
}
