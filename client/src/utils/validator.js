import { isMobilePhone, isEmail } from 'validator'

export const validateMobilePhone = value => isMobilePhone(value, ['zh-CN'])

export const validateEmail = value => isEmail(value)

export const validatePassword = value => {
    // 密码必须至少8个字符，而且同时包含字母和数字
    const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,}$/

    return reg.test(value)
}
