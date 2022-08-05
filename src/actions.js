import Api from "./apis"
import { CORS_PROXY, LINKEDIN_CLIENT_ID, LINKEDIN_SCOPE, LINKEDIN_STATE , LINKEDIN_REDIRECT, LINKEDIN_CLIENT_SECRET} from "./constants"

const apiSA = new Api()

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


  export const receiveLinkedInMessageV2 = ({
    origin,
    data: { state, code, error, ...rest }
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
    if (origin !== window.location.origin || state !== LINKEDIN_STATE) return

    console.log('heredatabro', state, 'code', code)
    if (code) {
      const postType = "IMAGE" //IMAGE or VIDEO - mediaTypeByPostLinkedInKey[feed.type.toUpperCase()] || 'IMAGE'

      apiSA.getLinkedUserAccessToken(code).then((token) => {
        console.log('token', token)
        apiSA.getLinkInUserInfo(token.data.access_token).then((userInfo) => {
          console.log('userInfo', userInfo)

          apiSA
            .registerImageOnLinkedIn(
              token.data.access_token,
              userInfo.data.id,
              postType
            )
            .then((registrationInfo) => {
              console.log('registrationInfo', registrationInfo)
              const registerData = {
                uploadUrl:
                  registrationInfo.data.value.uploadMechanism[
                    'com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'
                  ].uploadUrl,
                asset: registrationInfo.data.value.asset
              }

              apiSA
                .uploadImageBinaryOnLinkedIn(
                  postType === 'VIDEO' ? null : token.data.access_token,
                  registerData.uploadUrl,
                  //getMediaUrl(feed.type, feed.mediaId) this is the url of the media to upload
                )
                .then((uploadInfo) => {
                  console.log('upload sucessful', uploadInfo)

                  //proceed to sharing

                  const shared_data = {
                    author: `urn:li:person:${userInfo.data.id}`,
                    lifecycleState: 'PUBLISHED',
                    specificContent: {
                      'com.linkedin.ugc.ShareContent': {
                        shareCommentary: {
                          text: 'here the commentary before post'
                        },
                        shareMediaCategory: postType,
                        media: [
                          {
                            status: 'READY',
                            description: {
                              text: "text", //feed.text
                            },
                            media: registerData.asset,
                            originalUrl: "the share url that can permit redirection to the app", //shareUrl,
                            title: {
                              text: "the title of the post" //title
                            }
                          }
                        ]
                      }
                    },
                    visibility: {
                      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
                    }
                  }

               

                  apiSA
                    .sharePostOnLinkedIn(
                      token.data.access_token,
                      JSON.stringify(shared_data)
                    )
                    .then((result) => {
                      console.log('shared data', shared_data)
                      console.log('shared on linked in', result)
                    })
                })
            })
        })
      })
    } else if (
      error &&
      !['user_cancelled_login', 'user_cancelled_authorize'].includes(error)
    ) {
    
    }
  }
