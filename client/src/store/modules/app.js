export default {
    namespace: 'app',
    state: {
        userInfo: {},
        openId:''
    },
    reducers: {
        setUserInfo(state, { payload }) {
            const { userInfo } = payload
            return { ...state, userInfo }
        },
        setOpenId(state, { payload }) {
            const { openId } = payload
            return { ...state, openId }
        },
    },
    effects: {},
}
