const cloud = require("wx-server-sdk");

cloud.init();

const db = cloud.database();
const userCollection = db.collection("user");

exports.main = async (event) => {
  const wxContext = cloud.getWXContext();
  const openId = wxContext.OPENID;

  const result = await userCollection.where({ openId }).get();

  if (result.data.length === 0) {
    return { success: false, message: "您当前账户未登录" };
  }

  const userInfo = result.data[0];
  const { collectPhotographerList } = userInfo;
  const isCollect = collectPhotographerList.some((e) => e.id === event.id);
  if (!isCollect) {
    return userInfo;
  }

  const filterArr = collectPhotographerList.filter((e) => e.id !== event.id);
  userInfo.collectPhotographerList = filterArr;
  delete userInfo._id;
  await userCollection.where({ openId }).update({ data: userInfo });

  return userInfo;
};