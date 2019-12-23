import React from 'react'
import FormWrapper from 'core/components/FormWrapper'
import ValidatedForm from 'core/components/validatedForm/ValidatedForm'
import SubmitButton from 'core/components/SubmitButton'
import KeyValuesField from 'core/components/validatedForm/KeyValuesField'

const listUrl = 'http://127.0.0.1:5000/api/v1/setriskprofile'

const handleSubmit = (account) => {
  console.log(account)
}

const RiskProfilePage = () => {
  return <FormWrapper
    title='Add Custom Risk Profile'
    backUrl={listUrl}
  >
    <ValidatedForm onSubmit={handleSubmit}>
      <KeyValuesField
        id="risk_levels"
        label="Risk Levels"
        info="Add keys in the format risk_level_1 and value as percentage of risk you would like to take for that level"
      />
      <SubmitButton>Add Risk Profile</SubmitButton>
    </ValidatedForm>

  </FormWrapper>
}

export default RiskProfilePage
