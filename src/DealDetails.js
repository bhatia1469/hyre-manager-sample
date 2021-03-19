import { useNavigation, useIsFocused } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { Dimensions, ImageBackground, Image, Text, TouchableOpacity, View, FlatList, StatusBar } from 'react-native';
import { BoxShadow } from 'react-native-shadow';
import Divider from '../common/Divider';
import styles, { fonts } from '../common/styles';
import TitleHeader from '../common/TitleHeader';
import { ScrollView } from 'react-native-gesture-handler';
import Webservice from '../common/Webservice';
import Const from '../common/Const';
import AsyncStorage from "@react-native-community/async-storage";
import { colors } from '../common/colors';
import ReactNativeModal from 'react-native-modal';
import SimpleToast from 'react-native-simple-toast';

export default function DealDetails({ route }) {
    const [details, setDetails] = useState("")
    const [name, setName] = useState("")
    const [image, setImage] = useState("")
    const [finalPrice, setFinalPrice] = useState("")
    const [refundModalVisibility, setRefundModalVisibility] = useState(false)
    const [currentMilestoneDetails, setCurrentMilestoneDetails] = useState({})


    const navigation = useNavigation();
    const isFocused = useIsFocused()

    const { dealId } = route.params

    useEffect(() => {
        AsyncStorage.getItem("name").then(setName)
        AsyncStorage.getItem("image").then(setImage)
        getDetails()
    }, [])

    function getDetails() {
        Webservice.call("deals/" + dealId, "GET", null, true).then(result => {
            console.log(JSON.stringify(result))
            if (result) {
                setDetails(result.data)
                let g = 0
                result.data.milestones.forEach(element => {
                    g = g + parseInt(element.price)
                });
                setFinalPrice(g)
            }
        }).catch(err => {
            console.log(err)
        })
    }

    function requestMilestone(id, status) {
        setRefundModalVisibility(false)
        setTimeout(() => {
            let body = {
                milestone_id: id,
                status: status
            }
            Webservice.call("deals/accept/refund", "PUT", JSON.stringify(body), true).then(result => {
                console.log(JSON.stringify(result))
                getDetails()
            }).catch(err => {
                console.log(err)
            })
        }, 500);

    }


    const refundModal = () => {
        return (
            <ReactNativeModal isVisible={refundModalVisibility}
                onBackButtonPress={() => { setRefundModalVisibility(false) }}
                useNativeDriver={true}
                animationIn={"fadeIn"} animationOut={'fadeOut'}
            >
                <View style={[styles.containerModal, { padding: 20, height: 250 }]}>
                    <View style={{
                        flexDirection: 'row', justifyContent: 'space-between',
                        alignItems: 'center', width: '100%', marginBottom: 20
                    }}>

                        <TouchableOpacity onPress={() => setRefundModalVisibility(false)}>
                            <Image style={globalStyles.iconMini} source={require('../assets/images/close.png')} />
                        </TouchableOpacity>
                        <Text style={[styles.textBold, { fontSize: 16 }]}>Milestone {details?.milestones?.indexOf(currentMilestoneDetails) + 1}</Text>
                        <View />
                    </View>

                    <View style={{ height: 1, width: '60%', backgroundColor: 'gray' }} />

                    <View style={{ flex: 1, width: '100%', paddingHorizontal: 20, justifyContent: 'center', marginVertical: 10 }}>
                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                            <Text style={{ fontSize: 18, fontFamily: fonts.regular }}>Total Refund</Text>
                            <Text style={{ fontSize: 18, fontFamily: fonts.regular }}>₹{currentMilestoneDetails.price}</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}>
                        <TouchableOpacity style={[styles.buttonOrange, { width: '40%', height: 45, margin: null }]} onPress={() => { requestMilestone(currentMilestoneDetails._id, "REJ") }}>
                            <Text style={styles.buttonOrangeText}>Deny</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.buttonOrange, { width: '40%', height: 45, margin: null }]} onPress={() => { requestMilestone(currentMilestoneDetails._id, "ACC") }}>
                            <Text style={styles.buttonOrangeText}>Accept</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ReactNativeModal>
        )
    }

    function onAction(status) {
        let data = {
            deal_id: dealId,
            status: status
        }
        Webservice.call("deals", "PUT", JSON.stringify(data), true).then(result => {
            console.log(JSON.stringify(result))
            if (result) {
                setTimeout(() => {
                    SimpleToast.show(status == 'ACC' ? "Deal accepted" : "Deal denied")
                }, 500);
                navigation.goBack()
            }
        }).catch(err => {
            console.log(err)
        })
    }

    const shadowOpt = {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        border: 30,
        color: "#000",
        radius: 50,
        opacity: 0.3,
        style: { marginTop: 240, flex: 1 }
    }

    return (
        <View style={{ flex: 1, alignItems: 'center' }}>
            <StatusBar backgroundColor={"transparent"} translucent={true} />
            <View style={[styles.container]} contentContainerStyle={{ flexGrow: 1 }}>
                <ImageBackground
                    style={{ width: '100%', height: 260, position: 'absolute' }}
                    source={{ uri: Const.imageUrl + image }}>
                    <TitleHeader
                        title={name}
                        style={{ position: 'absolute', marginTop: 35 }}
                        leftIcon={require('../assets/images/back_arrow.png')}
                        onLeftPress={() => navigation.goBack()}
                    />
                </ImageBackground>
                <BoxShadow setting={shadowOpt}>
                    <View style={[{
                        backgroundColor: 'white',
                        borderTopEndRadius: 30, borderTopStartRadius: 30,
                        flex: 1
                    }]}>
                        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingBottom: 40, paddingTop: 20 }}>
                            <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
                                <Text style={{ fontFamily: fonts.bold, fontSize: 20 }}>Details</Text>
                                <Divider color={"#D7D8D8"} style={{ width: '60%', marginVertical: 10 }} />

                                <View style={[styles.rowCenter, styles.dealDetailsRow]}>
                                    <Text style={{ fontFamily: fonts.regular }}>Date:</Text>
                                    <View style={[styles.whiteRoundedBox, globalStyles.shadow]}>
                                        <Text>{details?.request_id?.from}</Text>
                                    </View>
                                </View>

                                <View style={[styles.rowCenter, styles.dealDetailsRow]}>
                                    <Text style={{ fontFamily: fonts.regular }}>{details?.request_id?.appointment_category == 1 ? "To:" : "Duration of Interaction:"}</Text>
                                    <View style={[styles.whiteRoundedBox, globalStyles.shadow]}>
                                        <Text>{details?.request_id?.appointment_category == 1 ? details?.request_id?.to : `${details?.request_id?.duration} hours`}</Text>
                                    </View>
                                </View>

                                <View style={[styles.rowCenter, styles.dealDetailsRow]}>
                                    <Text style={{ fontFamily: fonts.regular }}>Final Cost:</Text>
                                    <View style={[styles.whiteRoundedBox, styles.shadow]}>
                                        <Text>{finalPrice}</Text>
                                    </View>
                                </View>

                                <Text style={{ fontFamily: fonts.regular, alignSelf: 'flex-start', margin: 20 }}>Payment Milestones</Text>
                                <View style={{ flex: 1 }}>
                                    <FlatList
                                        data={details?.milestones}
                                        keyExtractor={(item) => Math.random()}
                                        renderItem={({ item, index }) => {
                                            console.log(item)
                                            return (
                                                <TouchableOpacity activeOpacity={1} style={[item.refund_request == true ? {
                                                    borderWidth: 1, justifyContent: 'center', borderRadius: 30,
                                                    borderColor: colors.orange, marginVertical: 10, backgroundColor: 'white'
                                                } : null, styles.shadow]} onPress={() => {
                                                    if (item.refund_request == true) {
                                                        setCurrentMilestoneDetails(item);
                                                        setRefundModalVisibility(true)
                                                    }
                                                }}>
                                                    <View style={[styles.rowCenter, styles.dealDetailsRow, { width: '100%' }]}>
                                                        <Text style={{ fontFamily: fonts.regular }}>Milestone {index + 1}:</Text>
                                                        <View style={[styles.whiteRoundedBox, globalStyles.shadow]}>
                                                            <Text>{item.price}</Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        }}
                                    />
                                </View>
                                {details.status == 'PEN' ?
                                    <View style={{ flexDirection: 'row', marginTop: 20, marginHorizontal: 10 }}>
                                        <TouchableOpacity onPress={() => onAction('ACC')} style={[styles.button, { backgroundColor: '#41D171' }, styles.shadow]}>
                                            <Text style={styles.buttonText}>Accept</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => onAction('REJ')} style={[styles.button, { backgroundColor: '#E35353' }, styles.shadow]}>
                                            <Text style={styles.buttonText}>Deny</Text>
                                        </TouchableOpacity>
                                    </View> : null
                                }

                                {details.status == 'ACC' ?
                                    <View style={[styles.button, { backgroundColor: '#41D171', width: '90%', flex: null, marginTop: 20 }, styles.shadow]}>
                                        <Text style={styles.buttonText}>Accepted</Text>
                                    </View>
                                    : null}

                                {details.status == 'REJ' ?
                                    <View style={[styles.button, { backgroundColor: '#E35353', width: '90%', flex: null, marginTop: 20 }, styles.shadow]}>
                                        <Text style={styles.buttonText}>Declined</Text>
                                    </View>
                                    : null}
                            </View>
                        </ScrollView>
                    </View>
                </BoxShadow>
                {refundModal()}

            </View>
        </View>
    )
}