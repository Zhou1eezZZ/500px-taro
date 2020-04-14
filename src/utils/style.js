// eslint-disable-next-line import/prefer-default-export
export const bindShow = status => {
    return status ? { opacity: 1, transition: 'all .3s' } : { height: 0, opacity: 0, overflow: 'hidden', transition: 'all .3s', padding: 0, margin: 0 }
}
