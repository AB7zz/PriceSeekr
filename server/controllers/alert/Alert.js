import AlertCron from '../../helpers/alert/AlertCron.js'

const alert = async(req, res) => {
    try {
        AlertCron()
        res.send('Alerts are running successfully')
    } catch (error) {
        console.log(error)
    }
}

export default alert