import ApiService from 'api-client/ApiService'

class Cre extends ApiService {
  endpoint = () => {
    return 'http://127.0.0.1:5000/api/v1/'
  }

  baseUrl = async () => `${await this.endpoint()}`

  executeRecommendationsForAccount = async (params) => {
    return this.client.basicPost('http://127.0.0.1:5000/api/v1/recommend/executerules', params)
  }

  addAccount = async (params) => {
    return this.client.basicPost('http://127.0.0.1:5000/api/v1/account', params)
  }

  modifyAccount = async (params) => {
    return this.client.basicPut('http://127.0.0.1:5000/api/v1/account', params)
  }

  removeAccount = async (params) => {
    return this.client.basicDeleteWithBody('http://127.0.0.1:5000/api/v1/account', params)
  }

  listAccounts = async () => {
    return this.client.basicGet('http://127.0.0.1:5000/api/v1/account')
  }
}

export default Cre
