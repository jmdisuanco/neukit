import * as color from '8colors'
const c = () => Object.assign({}, color)
const statusEmojis = {
    success: '✔',
    info: 'ℹ️',
    warning: '⚠️',
    error: '❌',
    tip: '💡'
}

export const alertSuccess = (message: string) => {
    console.log(c().g(`${statusEmojis.success} : ${message}`).end())
}

export const alertInfo = (message: string) => {
    console.log(c().b(`${statusEmojis.info}  : ${message}`).end())
}

export const alertWarning = (message: string) => {
    console.log(c().y(`${statusEmojis.warning} : ${message}`).end())
}

export const alertError = (message: string) => {
    console.log(c().r(`${statusEmojis.error} Error  :`).br(message).end())
}
export const alertTip = (message: string) => {
    console.log(c().w(`${statusEmojis.tip} : ${message}`).end())
}


