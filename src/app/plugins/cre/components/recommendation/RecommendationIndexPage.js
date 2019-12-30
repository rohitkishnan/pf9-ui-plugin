import React from 'react'
import Tabs from 'core/components/tabs/Tabs'
import Tab from 'core/components/tabs/Tab'
import RecommendationListPage from './RecommendationListPage'
import PageContainer from 'core/components/pageContainer/PageContainer'

const RecommendationIndexPage = () => (
  <PageContainer>
    <Tabs>
      <Tab value="Recommendation" label="Recommendation"> <RecommendationListPage/></Tab>
    </Tabs>
  </PageContainer>
)

export default RecommendationIndexPage
