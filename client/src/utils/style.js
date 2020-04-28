// eslint-disable-next-line import/prefer-default-export
export const bindShow = (status, opacityOnly = false) => {
    return status
        ? { opacity: 1, transition: 'all .8s' }
        : opacityOnly
        ? { opacity: 0, transition: 'all .8s' }
        : {
              height: 0,
              opacity: 0,
              overflow: 'hidden',
              transition: 'all .3s',
              padding: 0,
              margin: 0,
          }
}
