export default class Utils {

    static convertWeiToEther(val: number) {
        return val / 1000000000000000000;
    }

    static convertEtherToWei(val: number) {
        return val * 1000000000000000000;
    }

    static convertPriToKus(val: number) {
        return val / 100000000;
    }

    static convertKusToPri(val: number) {
        return val * 100000000;
    }

    static roundValueTillTwoDecimal(val: number) {
        return (Math.round(val * 100) / 100)
    }

}
