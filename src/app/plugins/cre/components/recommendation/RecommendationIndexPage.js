import React from 'react'
import PageContainer from 'core/components/pageContainer/PageContainer'
import Tabs from 'core/components/tabs/Tabs'
import Tab from 'core/components/tabs/Tab'
import RecommendationPage from './RecommendationPage'

const RecommendationIndexPage = () => {
  return (
    <PageContainer>
      <Tabs>
        <Tab value="accounts" label="Accounts"><RecommendationPage /></Tab>
      </Tabs>
    </PageContainer>
  )
}

export default RecommendationIndexPage
