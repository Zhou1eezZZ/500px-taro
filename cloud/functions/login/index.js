const cloud = require("wx-server-sdk");

cloud.init();

const db = cloud.database();
const userCollection = db.collection("user");

exports.main = async () => {
  const wxContext = cloud.getWXContext();

  // 查找当前用户的openid是否已在数据库的user集合中存在
  const result = await userCollection.where({ openId: wxContext.OPENID }).get();
  if (result.data.length === 0) {
    // 未在数据库中找到记录，则表明未曾登录过本系统
    return {
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
    };
  } else {
      // 找到记录，说明曾登录过 直接返回用户信息
    return {
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
      userInfo: result.data[0],
    };
  }
};
