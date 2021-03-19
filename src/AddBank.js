import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, StatusBar, ScrollView, TouchableOpacity, Image, Text, TextInput } from 'react-native';
import styles, { fonts } from '../common/styles';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../common/colors';
import WebView from 'react-native-webview';
import LoaderEmitter from '../common/LoaderEmitter';
import Webservice from '../common/Webservice';
import TitleHeader from '../common/TitleHeader';
import ReactNativeSegmentedControlTab from 'react-native-segmented-control-tab';
import SimpleToast from 'react-native-simple-toast';
import { acc } from 'react-native-reanimated';

export default function AddBank({ route }) {
    const navigation = useNavigation();
    const [account, setAccount] = useState(null)
    const [accNo, setAccNo] = useState("")
    const [routNo, setRoutNo] = useState("")
    const [confirmAccNo, setConfirmAccNo] = useState("")

    function getBank() {
        Webservice.call('cards/getBanks', 'GET', null, true).then(res => {
            console.log(res)
            if (res.cards != null) {
                setAccount(res.cards)
                setAccNo(`**** **** ${res.cards.account_no}`)
                setRoutNo(`**** **** ****`)
                setConfirmAccNo(`**** **** ${res.cards.account_no}`)
            }
        })
    }

    function deleteBank() {
        Webservice.call('cards/deleteBank/' + account._id, 'DELETE', null, true).then(res => {
            console.log(res)
            SimpleToast.show(res.message)
            setAccount(null)
            setAccNo("")
            setRoutNo("")
            setConfirmAccNo("")
        })
    }

    useEffect(() => {
        getBank()
    }, [])

    function addBank() {
        if (routNo.length == 0) {
            SimpleToast.show("Please enter routing number")
        } else if (accNo.length == 0) {
            SimpleToast.show("Please enter account number")
        } else if (confirmAccNo.length == 0) {
            SimpleToast.show("Please enter confirm account number")
        } else if (!confirmAccNo.match(accNo)) {
            SimpleToast.show("Account number and confirm account number doesn't match")
        } else {
            let body = {
                "account_nunber": accNo,
                "routing_number": routNo
            }
            Webservice.call('cards/addbank', 'POST', JSON.stringify(body), true).then(res => {
                console.log(res)
                if (res) {
                    setTimeout(() => {
                        SimpleToast.show(res.message)
                    }, 500);
                    navigation.goBack()
                }
            })
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <StatusBar backgroundColor={colors.orange} />
            <SafeAreaView style={{ backgroundColor: colors.orange }} />
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>

                <ScrollView style={styles.containerOrange} contentContainerStyle={{ flexGrow: 1 }}>
                    <TitleHeader
                        leftIcon={require('../assets/images/back_arrow.png')}
                        title={"Add Bank Account"}
                        onLeftPress={() => navigation.goBack()}
                    />
                    <View style={[styles.containerContent, {
                        paddingHorizontal: 0, backgroundColor: '#f9fafa',
                        paddingVertical: 0
                    }]}>
                        <ReactNativeSegmentedControlTab
                            values={["Link Bank Account"]}
                            firstTabStyle={{ borderRightWidth: 0, borderTopStartRadius: 30 }}
                            lastTabStyle={{ borderRightWidth: 0, borderTopEndRadius: 30 }}
                            tabsContainerStyle={[{ height: 80, borderTopEndRadius: 30, borderTopStartRadius: 30 }, globalStyles.shadow]}
                            tabStyle={{ backgroundColor: colors.white, borderColor: colors.gray, marginHorizontal: 100, borderWidth: 0 }}
                            tabTextStyle={{ color: colors.gray, fontSize: 16, fontFamily: fonts.regular }}
                            activeTabStyle={[{ backgroundColor: colors.white, borderBottomWidth: 1 }]}
                            activeTabTextStyle={{ color: 'black', fontFamily: fonts.regular, }}
                            selectedIndex={0}
                        // onTabPress={setIndex}
                        />
                        <View style={{ flex: 1, paddingHorizontal: 20, width: '100%', alignItems: 'center', paddingVertical: 20 }}>
                            <View style={{ width: '100%', marginTop: 10 }}>
                                <Text style={styles.paymentCardTitle}>ROUTING NUMBER</Text>
                                <View style={[{ flexDirection: 'row', alignItems: 'center' }, styles.paymentCardInput, globalStyles.shadow]}>
                                    <TextInput
                                        keyboardType={"number-pad"}
                                        onChangeText={setRoutNo}
                                        value={routNo}
                                        editable={account == null}
                                        style={[styles.paymentCardInput, { paddingHorizontal: 0 }]}
                                        maxLength={30}
                                    />
                                </View>
                            </View>
                            <View style={{ width: '100%', marginTop: 10 }}>
                                <Text style={styles.paymentCardTitle}>ACCOUNT NUMBER</Text>
                                <TextInput
                                    maxLength={30}
                                    keyboardType={"number-pad"}
                                    onChangeText={setAccNo}
                                    editable={account == null}
                                    value={accNo}
                                    style={[styles.paymentCardInput, globalStyles.shadow]} />
                            </View>

                            <View style={{ width: '100%', marginTop: 10 }}>
                                <Text style={styles.paymentCardTitle}>CONFIRM ACCOUNT NUMBER</Text>
                                <TextInput
                                    maxLength={30}
                                    keyboardType={"number-pad"}
                                    editable={account == null}
                                    onChangeText={setConfirmAccNo}
                                    value={confirmAccNo}
                                    style={[styles.paymentCardInput, globalStyles.shadow]} />
                            </View>
                            {account == null ?
                                <TouchableOpacity style={[styles.buttonOrange, { marginTop: 40 }]} onPress={addBank}>
                                    <Text style={styles.buttonOrangeText}>Save and Continue</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity style={[styles.buttonOrange, { marginTop: 40 }]} onPress={deleteBank}>
                                    <Text style={styles.buttonOrangeText}>Delete</Text>
                                </TouchableOpacity>
                            }
                        </View>

                    </View>
                </ScrollView>


            </SafeAreaView>
        </View>
    )
}