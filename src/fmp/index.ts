import axios from 'axios'
import config from '../../config.json'

export default axios.create({
  baseURL: 'https://financialmodelingprep.com/api/v3',
  timeout: 2000,
  params: {
    apikey: config.apikey,
  },
})
