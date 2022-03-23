import React from 'react'
import { ValidationErrors } from '@qwizard/core';

export function PasswordCriteriaList({
  hasValidated,
  errors,
}: {
  hasValidated: boolean;
  errors: ValidationErrors;
}): JSX.Element {
  return (
    <sub>
      <h4 style={{ margin: "0" }}>Password Criteria</h4>
      <ul>
        <li>
          At least 8 characters{" "}
          {hasValidated
            ? (errors as ValidationErrors).passwordLength
              ? "✖"
              : "✓"
            : "○"}
        </li>
        <li>
          Contains a special character{" "}
          {hasValidated
            ? (errors as ValidationErrors).mustContainSpecialCharacters
              ? "✖"
              : "✓"
            : "○"}
        </li>
        <li>
          Passwords Match{" "}
          {hasValidated
            ? (errors as ValidationErrors).confirmPassword
              ? "✖"
              : "✓"
            : "○"}
        </li>
      </ul>
    </sub>
  );
}