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

  // 从用户的信息中获取到现有的评论列表
  const userInfo = result.data[0];
  const { commentsList } = userInfo;
  // 计算当前评论的作品是否已经存在在评论列表中
  const isComment = commentsList.some((e) => e.id === event.id);
  if (isComment) {
    // 已经评论过则直接返回用户信息
    return userInfo;
  }

  // 未评论过，处理并更新评论列表
  delete event.userInfo;
  userInfo.commentsList.push(event);
  delete userInfo._id;
  // 将更新后的数据同步到数据库
  await userCollection.where({ openId }).update({ data: userInfo });

  // 返回新的用户信息给前端
  return userInfo;
};
