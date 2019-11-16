import { create } from 'dva-core'
import { createLogger } from 'redux-logger'
import createLoading from 'dva-loading'
import Config from '../config'

let app
let store
let dispatch
let registered

const createApp = opt => {
    const { logger } = Config.store
    if (logger) {
        opt.onAction = [createLogger()]
    }

    app = create(opt)
    app.use(createLoading({}))

    if (!registered) {
        opt.models.forEach(model => app.model(model))
    }
    registered = true

    app.start()

    store = app._store
    app.getStore = () => store
    app.use({
        onError(err) {
            console.log(err)
        }
    })

    dispatch = store.dispatch
    app.dispatch = dispatch

    return app
}

export default {
    createApp,
    getDispatch: () => app.dispatch
}
