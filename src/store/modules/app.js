export default {
    namespace: 'app',
    state: {
        number: 100
    },
    reducers: {
        changeNumber(state, { payload }) {
            const { step } = payload
            return { ...state, number: state.number + step }
        }
    },
    effects: {}
}
