const cloud = require("wx-server-sdk");

cloud.init();

const db = cloud.database();
const userCollection = db.collection("user");

exports.main = async () => {
  const wxContext = cloud.getWXContext();

  const result = await userCollection.where({ openId: wxContext.OPENID }).get();
  if (result.data.length === 0) {
    // 未曾登录过本系统
    return {
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
    };
  } else {
      // 曾登录过 直接返回用户信息
    return {
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
      userInfo: result.data[0],
    };
  }
};
