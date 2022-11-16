import React from "react";
import { Text, View, Image } from "react-native-ui-lib";
import style from '../style/style'


const Transaction = ({ amount, sender, recipient, isPending }: { amount: number, sender: string, recipient: string, isPending: boolean }) => {

    const user_email = "adam@gmail.com"

    const numberWithCommas = (x: number) => {
        const options = {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        };
        return Number(x).toLocaleString('en', options);
    }


    const deposit = (amount: number, sender: string, recipient: string) => (
        <View style={{ flexDirection: "row" }}>
            <Image
                source={require('../style/deposit.png')}
                style={style.balanceLogo}
            />
            <View style={{}}>
                <Text text70 grey10 left>
                    {numberWithCommas(amount)} RCoin
                </Text>
                <Text text80 grey10 left style={{ fontWeight: "bold" }}>Deposited</Text>
            </View>
        </View>
    )

    const transfer = (amount: number, sender: string, recipient: string) => (
        user_email == sender ? //The user sent the RCoin
            <View style={{ flexDirection: "row" }}>
                <Image
                    source={require('../style/transferTo.png')}
                    style={style.balanceLogo}
                />
                <View>
                    <Text text70 grey10 left>
                        {numberWithCommas(-amount)} RCoin
                    </Text>
                    <Text text80 grey10 left>
                        <Text style={{ fontWeight: "bold" }}>Transfer</Text> to {recipient}
                    </Text>
                </View>
            </View>
            : //The user recieved the RCoin
            <View style={{ flexDirection: "row" }}>
                <Image
                    source={require('../style/transferFrom.png')}
                    style={style.balanceLogo}
                />
                <View>
                    <Text text70 grey10 left>
                        {numberWithCommas(amount)} RCoin
                    </Text>
                    <Text text80 grey10 left>
                        <Text style={{ fontWeight: "bold" }}>Transfer</Text> from {sender}
                    </Text>
                </View>
            </View>
    )

    const withdraw = (amount: number, sender: string, recipient: string) => (
        <View style={{ flexDirection: "row" }}>
            <Image
                source={require('../style/withdraw.png')}
                style={style.balanceLogo}
            />
            <View>
                <Text text70 grey10 left>
                    {numberWithCommas(-amount)} RCoin
                </Text>
                <Text text80 grey10 left style={{ fontWeight: "bold" }}>Withdrawn</Text>
            </View>
        </View>
    )

    const bg = isPending ? "lightgrey" : "transparent"
    return (
        <View>
            <View marginH-30 marginV-20 style={{ flexDirection: "row", backgroundColor: bg }}>
                {/* <View> */}
                {recipient == 'reserve' ? deposit(amount, sender, recipient) : null}
                {sender == 'reserve' ? withdraw(amount, sender, recipient) : null}
                {sender != 'reserve' && recipient != 'reserve' ? transfer(amount, sender, recipient) : null}
            </View>
        </View>
    );
}

export default Transaction