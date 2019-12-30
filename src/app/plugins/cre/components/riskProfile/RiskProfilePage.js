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
  return <div>
    <h1>RiskProfile</h1> 
    <span>Coming soon</span>
  </div>
}

export default RiskProfilePage
