import express from 'express'
import Alert from '../controllers/alert/Alert.js'
const router = express.Router()

router.post('/alert', Alert)

export default router