import Api from "./apis"
import { CORS_PROXY, LINKEDIN_CLIENT_ID, LINKEDIN_SCOPE, LINKEDIN_STATE , LINKEDIN_REDIRECT, LINKEDIN_CLIENT_SECRET} from "./constants"

const apiSA = new Api()

export const popupWindow = (url, windowName, win, w, h) => {
  const y = win.top.outerHeight / 2 + win.top.screenY - h / 2
  const x = win.top.outerWidth / 2 + win.top.screenX - w / 2
  return win.open(
    url,
    windowName,
    `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${y}, left=${x}`
  )
}


export const queryToObject = (queryString) => {
  const pairsString =
    queryString[0] === '?' ? queryString.slice(1) : queryString
  const pairs = pairsString
    .split('&')
    .map((str) => str.split('=').map(decodeURIComponent))
  return pairs.reduce(
    (acc, [key, value]) => (key ? { ...acc, [key]: value } : acc),
    {}
  )
}

export const tokenValid = (token = {}) => {
  const now = Date.now() / 1000
  const expiry = token.created_at + token.expires_in
  return now < expiry
}

export const getURLWithQueryParams = (base, params) => {
  const query = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&')

  return `${base}?${query}`
}

export const LINKEDIN_URL = getURLWithQueryParams(
  'https://www.linkedin.com/oauth/v2/authorization',
  {
    response_type: 'code',
    client_id: LINKEDIN_CLIENT_ID,
    redirect_uri: LINKEDIN_REDIRECT,
    state: LINKEDIN_STATE,
    scope: LINKEDIN_SCOPE
  }
)

export const LINKEDIN_ACESSTOKEN_URL = (code) =>
  getURLWithQueryParams(
    `${CORS_PROXY}/https://www.linkedin.com/oauth/v2/accessToken`,
    {
      grant_type: 'authorization_code',
      code: code,
      client_id: LINKEDIN_CLIENT_ID,
      client_secret: LINKEDIN_CLIENT_SECRET,
      redirect_uri: LINKEDIN_REDIRECT
    }
  )


  export const receiveLinkedInMessage = ({
    origin,
    data: { state, code, error, ...rest },
    popup,
    feed
  }) => {
    console.log('heredata1', origin, window.location.origin)
    console.log(
      'heredata2',
      state,
      LINKEDIN_STATE,
      'code',
      code,
      'error',
      error,
      rest
    )
  
    popup.close()
  }
