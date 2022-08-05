import {
  GET_LINKEDIN_USERINFO,
  LINKEDIN_ACESSTOKEN_URL,
  REGISTER_IMAGE_ON_LINKEDIN,
  SHARE_ON_LINKEDINV1,
  SHARE_ON_LINKEDINV2,
  CORS_PROXY
} from './constants'

const axios = require('axios').default;

class Api {
  
  getLinkedUserAccessToken = (code) =>
    new Promise((success, error) => {
      const config = {
        headers: {
          'Content-Type': 'x-www-form-urlencoded',
          'Access-Control-Allow-Origin': '*'
        }
      }
      axios
        .post(LINKEDIN_ACESSTOKEN_URL(code), config)
        .then((result) => {
          success(result)
        })
        .catch((exception) => {
          error(exception)
        })
    })

  getLinkInUserInfo = (access_token) =>
    new Promise((success, error) => {
      const config = {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
      axios
        .get(GET_LINKEDIN_USERINFO, config)
        .then((result) => {
          success(result)
        })
        .catch((exception) => {
          error(exception)
        })
    })

  sharePostOnLinkedInV1 = (access_token, data) =>
    new Promise((success, error) => {
      const config = {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'X-Restli-Protocol-Version': '2.0.0',
          'Content-Type': 'application/json',
          'x-li-format': 'json'
        }
      }
      axios
        .post(SHARE_ON_LINKEDINV1, data, config)
        .then((result) => {
          success(result)
        })
        .catch((exception) => {
          error(exception)
        })
    })

  sharePostOnLinkedInV2 = (access_token, data) =>
    new Promise((success, error) => {
      const config = {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'X-Restli-Protocol-Version': '2.0.0',
          'Content-Type': 'application/json',
          'x-li-format': 'json'
        }
      }
      axios
        .post(SHARE_ON_LINKEDINV2, data, config)
        .then((result) => {
          success(result)
        })
        .catch((exception) => {
          error(exception)
        })
    })

  registerImageOnLinkedIn = (access_token, userId, type) =>
    new Promise((success, error) => {
      const config = {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'X-Restli-Protocol-Version': '2.0.0',
          'Content-Type': 'multipart/form-data'
          //'x-li-format': 'json'
        }
      }
      const body = {
        registerUploadRequest: {
          recipes: [
            `urn:li:digitalmediaRecipe:${
              type.toLowerCase() === 'video'
                ? 'feedshare-video'
                : 'feedshare-image'
            }`
          ],
          owner: `urn:li:person:${userId}`,
          serviceRelationships: [
            {
              relationshipType: 'OWNER',
              identifier: 'urn:li:userGeneratedContent'
            }
          ]
        }
      }
      axios
        .post(REGISTER_IMAGE_ON_LINKEDIN, body, config)
        .then((result) => {
          success(result)
        })
        .catch((exception) => {
          error(exception)
        })
    })

  /*gets image binary*/
  getImg = async (imageUrl) => {
    const response = await fetch(`${CORS_PROXY}/${imageUrl}`)
    const imageBlob = await response.blob()
    const reader = new FileReader()
    reader.readAsDataURL(imageBlob)
    reader.onloadend = () => {
      const base64data = reader.result
      return base64data
    }
  }

  uploadImageBinaryOnLinkedIn = (access_token, uploadUrl, imageUrl) =>
    new Promise((success, error) => {
      const config = access_token
        ? {
            headers: {
              Authorization: `Bearer ${access_token}`,
              'X-Restli-Protocol-Version': '2.0.0',
              'Content-Type': 'application/json',
              'x-li-format': 'json'
            }
          }
        : {
            headers: {
              'X-Restli-Protocol-Version': '2.0.0',
              'Content-Type': 'application/octet-stream'
              //'x-li-format': 'json'
            }
          }
      const data = {
        'upload-file': this.getImg(imageUrl)
      }
      axios
        .put(`${CORS_PROXY}/${uploadUrl}`, data, config)
        .then((result) => {
          success(result)
        })
        .catch((exception) => {
          error(exception)
        })
    })
}

export default Api
