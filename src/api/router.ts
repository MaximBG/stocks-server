import { Router } from 'express'
import { getExchanges } from './actions/getExchanges'
import { login, register } from './middleware/auth'
import { findStocks } from './actions/findStocks'
import { getStockData } from './actions/getStockData'
import { setPortfolio } from './actions/setPortfolio'
import { getPortfolio } from './actions/getPortfolio'

export const router = Router()

router.post('/user/login', login)
router.post('/user/register', register)
router.post('/user/portfolio', setPortfolio)
router.get('/user/portfolio', getPortfolio)

router.get('/data/exchanges', getExchanges)
router.get('/data/stock/search/:query', findStocks)
router.get('/data/stock', getStockData)
