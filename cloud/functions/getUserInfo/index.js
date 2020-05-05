const cloud = require("wx-server-sdk");

cloud.init();

const db = cloud.database();
const userCollection = db.collection("user");

exports.main = async (event) => {
  // 通过微信提供的方法获取用户的微信基本信息（包括用户头像，用户名，用户性别等）
  const res = await cloud.getOpenData({
    list: [event.cloudID],
  });
  const { openId, avatarUrl, country, gender, nickName } = res.list[0].data;
  // 在数据库的user集合中查询是否存在该用户openid的数据
  const result = await userCollection.where({ openId }).get();

  // 定义一个对应该用户的初始化要存入数据库user集合中的对象
  const data = {
    openId,
    avatarUrl,
    country,
    gender,
    nickName,
    collectPhotoList: [],
    collectPhotographerList: [],
    commentsList: [],
    updateTime: new Date().getTime(),
  };

  if (result.data.length === 0) {
    // 如果数据库中不存在该用户的数据，则向表中添加上方初始化好的数据，并返回用户信息给前端
    await userCollection.add({ data });
    return data;
  } else {
    // 如果数据库中存在该用户的数据，则直接返回该信息给前端
    // await userCollection.where({ openId }).update({ data });
    return result.data[0];
  }
};
