import React from 'react'
import createUpdateComponents from 'core/helpers/createUpdateComponents'
import ApiClient from 'api-client/ApiClient'
import SubmitButton from 'core/components/SubmitButton'
import TextField from 'core/components/validatedForm/TextField'
import ValidatedForm from 'core/components/validatedForm/ValidatedForm'
import { prometheusInstancesCacheKey } from 'k8s/components/prometheus/actions'
const { cre } = ApiClient.getInstance()
import createListTableComponent from 'core/helpers/createListTableComponent'


const columns = [
  { id: 'InstanceId', label: 'Instantce Id' },
  { id: 'InstanceType', label: 'Instance Type' },
  { id: 'CurrentCostForYear', label: 'Current Cost (Year)' },
  { id: 'SpotCostForYear', label: 'Spot Cost (Year)' },
  { id: 'PercentageSavingForYear','label':'Percentage Saving (Year)' }
]

const records = [
  {'id':1, 'name':'shyam' , 'scost': 0},
  {'id':2, 'name':'shyam', 'scost': 0 },
  {'id':3, 'name':'shyam' },
  {'id':4, 'name':'shyam' }
]

const ListTable = createListTableComponent({
  title: 'Recommendation',
  emptyText: 'Loading...',
  name: 'ApiAccessList',
  columns,
  paginate: false,
  showCheckboxes: false,
  uniqueIdentifier: 'InstanceId',
})

class ExecuteRecommendationIndexPage extends React.PureComponent {
    data = this.props.initialValues
    constructor(props){
      super(props)
        this.state = { recommendation: [], emptyText: 'Loading..'  };
    }
   
    componentDidMount() {
      const {match} = this.props 
      const recom = []
      const response = cre.executeRecommendationsForAccount({"account_id": match.params.id})
      response.then((recommendation) => {
        if (recommendation) {   
          recommendation.response.data.regions.forEach(element => {
            element['reconciled_rule_results'].forEach(items => {
              items.details.forEach(item => {
                recom.push(item)
              });
            })
          });
        } 
        this.setState({ recommendation: recom })
      }).catch(error => {
        this.setState({ emptyText: 'No data found' })
      })
    }
  
   

  render () {
    const { recommendation } = this.state;
    return (
     <ListTable emptyText={this.state.emptyText} data={this.state.recommendation} /> 
    )
  }
}

export default ExecuteRecommendationIndexPage

