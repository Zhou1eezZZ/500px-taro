import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtAvatar, AtIcon } from 'taro-ui'
import { connect } from '@tarojs/redux'
import action from '../../utils/action'
import { getPicDetail } from '../../api'
import moment from '../../utils/moment'

import './index.scss'
import { bindShow } from '../../utils/style'

@connect(({ app }) => {
    return { ...app }
})
class Index extends Component {
    state = {
        picInfo: {
            url: {
                baseUrl:
                    'https://img.500px.me/5fed9c5f6437294ada1331f3506878691_1452676245638.jpg'
            }
        },
        isLoading: false
    }

    config = {
        navigationBarTitleText: '详情页'
    }

    componentWillMount() {}

    componentDidMount() {
        const { id, title } = this.$router.params
        Taro.setNavigationBarTitle({ title: title ? title : '无题' })
        this.getPicDetail({ id })
    }

    componentWillUnmount() {}

    componentDidShow() {}

    componentDidHide() {}

    getPicDetail = async ({ id }) => {
        try {
            this.setState({ isLoading: true })
            const res = await getPicDetail({ id })
            this.setState({ picInfo: res, isLoading: false })
        } catch (error) {
            console.log(error)
        }
    }

    render() {
        const { isLoading, picInfo } = this.state
        const { exifInfo, category } = picInfo
        return isLoading ? (
            <View>loading...</View>
        ) : (
            <View className='detail__page'>
                <Image
                    className='detail__page__img'
                    src={
                        picInfo.url.p5
                            ? picInfo.url.p5
                            : `${picInfo.url.baseUrl}!p4`
                    }
                    mode='widthFix'
                />
                <View>
                    <View className='detail__page__uploader'>
                        <AtAvatar
                            circle
                            size='small'
                            image={
                                picInfo.uploaderInfo &&
                                picInfo.uploaderInfo.avatar &&
                                picInfo.uploaderInfo.avatar.baseUrl
                                    ? `${picInfo.uploaderInfo.avatar.baseUrl}!a1`
                                    : ''
                            }
                        />
                        <View className='detail__page__uploader__info'>
                            <Text className='detail__page__uploader__info__name'>
                                {picInfo.uploaderInfo.nickName}
                            </Text>
                            <Text className='detail__page__uploader__info__fans'>
                                粉丝数 {picInfo.uploaderInfo.userFollowedCount}
                            </Text>
                        </View>
                    </View>
                    <View className='detail__page__des'>
                        <View className='detail__page__des__title'>
                            {picInfo.title}
                        </View>
                        <View className='detail__page__des__content'>
                            {picInfo.description}
                        </View>
                    </View>
                </View>
                <View className='detail__page__detail'>
                    <View className='detail__page__detail__basic'>
                        <View className='detail__page__detail__heat'>
                            <Text className='detail__page__detail__heat__title'>
                                热度
                            </Text>
                            <Text className='detail__page__detail__heat__content'>
                                {parseFloat(picInfo.ratingMax).toFixed(1)}
                            </Text>
                            <Text className='detail__page__detail__time'>
                                {moment(picInfo.ratingMaxDate).format(
                                    'YYYY.MM.DD'
                                )}
                            </Text>
                        </View>
                        <View className='detail__page__detail__pv'>
                            <Text className='detail__page__detail__pv__title'>
                                浏览量
                            </Text>
                            <Text>{picInfo.picturePvCount}</Text>
                            <View className='detail__page__detail__placeholder'>
                                {' '}
                            </View>
                        </View>
                        <View className='detail__page__detail__like'>
                            <Text className='detail__page__detail__like__title'>
                                点赞数
                            </Text>
                            <Text>{picInfo.pictureLikeedCount}</Text>
                            <View className='detail__page__detail__placeholder'>
                                {' '}
                            </View>
                        </View>
                        <View className='detail__page__detail__hot'>
                            <Text className='detail__page__detail__hot__title'>
                                热门
                            </Text>
                            <AtIcon
                                value='star-2'
                                size='18'
                                color='#525558'
                            ></AtIcon>
                            <Text className='detail__page__detail__time'>
                                {moment(picInfo.riseUpDate).format(
                                    'YYYY.MM.DD'
                                )}
                            </Text>
                        </View>
                    </View>
                </View>
                <View className='detail__page__camera'>
                    <Text className='detail__page__camera__title'>
                        {exifInfo.modelVcg}
                    </Text>
                    <Text className='detail__page__camera__subtitle'>
                        {exifInfo.lens}
                    </Text>
                    <View className='detail__page__camera__flex'>
                        <View className='detail__page__camera__flex__item'>
                            <Image
                                className='detail__page__camera__flex__item__img'
                                src='https://cdn.500px.me/images/photoDetail/aperture.svg'
                            ></Image>
                            <Text>光圈 {exifInfo.aperture}</Text>
                        </View>
                        <View className='detail__page__camera__flex__item'>
                            <Image
                                className='detail__page__camera__flex__item__img'
                                src='https://cdn.500px.me/images/photoDetail/time.svg'
                            ></Image>
                            <Text>
                                快门速度 {`${exifInfo.exposureTimeVcg} s`}
                            </Text>
                        </View>
                        <View className='detail__page__camera__flex__item'>
                            <Image
                                className='detail__page__camera__flex__item__img'
                                src='https://cdn.500px.me/images/photoDetail/focus.svg'
                            ></Image>
                            <Text>焦距 {exifInfo.focalLength}</Text>
                        </View>
                        <View className='detail__page__camera__flex__item'>
                            <Image
                                className='detail__page__camera__flex__item__img'
                                src='https://cdn.500px.me/images/photoDetail/iso.svg'
                            ></Image>
                            <Text>{`ISO ${exifInfo.iso}`}</Text>
                        </View>
                    </View>
                </View>
                <View className='detail__page__class'>
                    <View className='detail__page__class__line'>
                        <Text className='detail__page__class__line__title'>
                            分类
                        </Text>
                        <Text className='detail__page__class__line__content'>
                            {category.name}
                        </Text>
                    </View>
                    <View className='detail__page__class__line'>
                        <Text className='detail__page__class__line__title'>
                            上传时间
                        </Text>
                        <Text className='detail__page__class__line__content'>
                            {moment(picInfo.uploadedDate).format(
                                'YYYY.MM.DD HH:mm:ss'
                            )}
                        </Text>
                    </View>
                    <View className='detail__page__class__line'>
                        <Text className='detail__page__class__line__title'>
                            拍摄时间
                        </Text>
                        <Text className='detail__page__class__line__content'>
                            {moment(exifInfo.dateTime).format(
                                'YYYY.MM.DD HH:mm:ss'
                            )}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }
}
export default Index
