const cloud = require("wx-server-sdk");

cloud.init();

const db = cloud.database();
const userCollection = db.collection("user");

exports.main = async (event) => {
  const wxContext = cloud.getWXContext();
  const openId = wxContext.OPENID;

  // 根据openid去获取数据库user集合中的数据
  const result = await userCollection.where({ openId }).get();

  if (result.data.length === 0) {
    // 若数据库中不存在该用户的数据，则返回前端一个提示（正常情况不会发生这种事，但是为了接口的健壮性还是加了判断）
    return { success: false, message: "您当前账户未登录" };
  }

  // 从用户的信息中获取到已经收藏的列表
  const userInfo = result.data[0];
  const { collectPhotographerList } = userInfo;
  // 计算当前即将取消收藏的内容是否已经存在在收藏列表中
  const isCollect = collectPhotographerList.some((e) => e.id === event.id);
  if (!isCollect) {
    // 若未收藏过则直接返回用户信息
    return userInfo;
  }

  // 收藏过，处理并更新收藏列表（删掉该项）
  const filterArr = collectPhotographerList.filter((e) => e.id !== event.id);
  userInfo.collectPhotographerList = filterArr;
  delete userInfo._id;
  // 将更新后的数据同步到数据库
  await userCollection.where({ openId }).update({ data: userInfo });

  // 返回新的用户信息给前端
  return userInfo;
};
