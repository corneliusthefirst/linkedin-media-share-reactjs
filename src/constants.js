const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/'
const LINKEDIN_STATE = 'unikstringhardtoguessforcsrf'
const LINKEDIN_SCOPE = 'r_liteprofile r_emailaddress w_member_social'
const LINKEDIN_REDIRECT = 'http://localhost:3000'
const LINKEDIN_CLIENT_ID = '786pgkqkaz5dbv'
const LINKEDIN_CLIENT_SECRET = 'c8vknO9j1oDxL4xg'

const SHARE_ON_LINKEDINV1 = `${CORS_PROXY}/https://api.linkedin.com/v2/shares`
const SHARE_ON_LINKEDINV2 = `${CORS_PROXY}/https://api.linkedin.com/v2/ugcPosts`

const GET_LINKEDIN_USERINFO = `${CORS_PROXY}/https://api.linkedin.com/v2/me`

const REGISTER_IMAGE_ON_LINKEDIN = `${CORS_PROXY}/https://api.linkedin.com/v2/assets?action=registerUpload`
const LINKEDIN_URL_SHARE_REDIRECT = `https://www.linkedin.com/feed/update/`


export {CORS_PROXY, LINKEDIN_STATE, LINKEDIN_SCOPE, LINKEDIN_REDIRECT, LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, 
SHARE_ON_LINKEDINV1, SHARE_ON_LINKEDINV2, GET_LINKEDIN_USERINFO, REGISTER_IMAGE_ON_LINKEDIN, LINKEDIN_URL_SHARE_REDIRECT}