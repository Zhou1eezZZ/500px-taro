import dva from '../utils/dva'
import app from './modules/app'

const dvaApp = dva.createApp({
    initialState: {},
    models: [app]
})

const store = dvaApp.getStore()

export default store
