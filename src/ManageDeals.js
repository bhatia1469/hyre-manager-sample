import { useNavigation, useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import { FlatList, Image, ScrollView, Text, TouchableOpacity, View, StatusBar, SafeAreaView } from 'react-native';
import styles, { fonts } from '../common/styles';
import TitleHeader from '../common/TitleHeader';
import { colors } from '../common/colors';
import Webservice from '../common/Webservice';

export default function ManageDeals({ route }) {
    const [name, setName] = useState("")
    const navigation = useNavigation();

    const [newDeals, setNewDeals] = useState([])
    const [accDeals, setAccDeals] = useState([])
    const [pendDeals, setPendDeals] = useState([])
    const [decDeals, setDecDeals] = useState([])

    const onItem = (id) => {
        navigation.navigate('DealDetails', { dealId: id })
    }

    useFocusEffect(
        React.useCallback(() => {
            setTimeout(() => {
                getDeals()
            }, 100);
        }, [route.params])
    )

    function getDeals() {
        Webservice.call("deals", "GET", null, true, false).then(result => {
            console.log(JSON.stringify(result))
            if (result) {
                setNewDeals(result.data.new_deals)
                setAccDeals(result.data.accepted_deals)
                setPendDeals(result.data.viewed_deals)
                setDecDeals(result.data.declined_deals)
            }
        }).catch(err => {
            console.log(err)
        })
    }

    function checkIfRefundRequested(arr) {
        let status = false
        arr.forEach(item => {
            if (item.refund_request == true) {
                status = true
            }
        });
        return status
    }

    const requestItem = (item, index) => {
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => onItem(item._id)} style={[styles.requestContainer, { flexDirection: 'row' }, styles.shadow]}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.requestTitle}>{item.request_id.appointment_sub_category.name}</Text>
                    <Text style={styles.requestBody}>{item.request_id.description}</Text>
                </View>
                {item.status == "ACC" && checkIfRefundRequested(item.milestones) && < View style={[{
                    borderWidth: 1, justifyContent: 'center',
                    borderRadius: 20, height: 40, paddingHorizontal: 10,
                    borderColor: colors.orange, backgroundColor: 'white'
                }, styles.shadow]}>
                    <Text style={{ color: colors.orange, fontFamily: fonts.regular }}>Refund Requested</Text>
                </View>}
            </TouchableOpacity >
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <StatusBar backgroundColor={colors.orange} />
            <SafeAreaView style={{ backgroundColor: colors.orange }} />
            <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFCFC' }}>
                <ScrollView style={[styles.containerOrange]} contentContainerStyle={{ flexGrow: 1 }}>
                    <TitleHeader
                        title={"Manage Deals"}
                        leftIcon={require('../assets/images/back_arrow.png')}
                        onLeftPress={() => navigation.goBack()}
                    />
                    <View style={[styles.containerContent, { backgroundColor: '#FAFCFC', paddingHorizontal: 20, alignItems: null }]}>
                        {newDeals?.length > 0 ?
                            <View>
                                <View style={styles.requestHeaderContainer}>
                                    <Image style={styles.iconMini} source={require('../assets/images/star.png')} />
                                    <Text style={styles.requestHeader}>New Deals</Text>
                                </View>
                                <FlatList
                                    data={newDeals}
                                    keyExtractor={(item, index) => item.key}
                                    contentContainerStyle={{ paddingVertical: 8 }}
                                    renderItem={({ item, index }) => {
                                        return requestItem(item, index)
                                    }}
                                />
                            </View> : null}

                        {accDeals?.length > 0 ?
                            <View>
                                <View style={styles.requestHeaderContainer}>
                                    <Image style={styles.iconMini} source={require('../assets/images/check_green.png')} />
                                    <Text style={styles.requestHeader}>Accepted Deals</Text>
                                </View>
                                <FlatList
                                    data={accDeals}
                                    contentContainerStyle={{ paddingVertical: 8 }}
                                    keyExtractor={(item, index) => item.key}
                                    renderItem={({ item, index }) => {
                                        return requestItem(item, index)
                                    }}
                                />
                            </View> : null}


                        {pendDeals?.length > 0 ?
                            <View>
                                <View style={styles.requestHeaderContainer}>
                                    <Image style={styles.iconMini} source={require('../assets/images/eye_yellow.png')} />
                                    <Text style={styles.requestHeader}>Viewed Deals - Pending</Text>
                                </View>
                                <FlatList
                                    data={pendDeals}
                                    keyExtractor={(item, index) => item.key}
                                    contentContainerStyle={{ paddingVertical: 8 }}
                                    renderItem={({ item, index }) => {
                                        return requestItem(item, index)
                                    }}
                                />
                            </View> : null}


                        {decDeals?.length > 0 ?
                            <View>
                                <View style={styles.requestHeaderContainer}>
                                    <Image style={styles.iconMini} source={require('../assets/images/cross_red.png')} />
                                    <Text style={styles.requestHeader}>Declined Deals</Text>
                                </View>
                                <FlatList
                                    data={decDeals}
                                    keyExtractor={(item, index) => item.key}
                                    contentContainerStyle={{ paddingVertical: 8 }}
                                    renderItem={({ item, index }) => {
                                        return requestItem(item, index)
                                    }}
                                />
                            </View> : null}

                        {newDeals?.length == 0 && pendDeals?.length == 0 && accDeals?.length == 0 && decDeals?.length == 0 ?
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Text style={{ alignSelf: 'center', fontFamily: fonts.regular }}>No Deals</Text>
                            </View>
                            : null}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}