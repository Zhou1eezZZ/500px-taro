const cloud = require("wx-server-sdk");

cloud.init();

const db = cloud.database();
const userCollection = db.collection("user");

exports.main = async (event) => {
  const res = await cloud.getOpenData({
    list: [event.cloudID],
  });
  const { openId, avatarUrl, country, gender, nickName } = res.list[0].data;
  const result = await userCollection.where({ openId }).get();

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
    await userCollection.add({ data });
    return data;
  } else {
    // await userCollection.where({ openId }).update({ data });
    return result.data[0];
  }
};
