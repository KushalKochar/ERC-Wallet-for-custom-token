import { AbstractControl } from '@angular/forms';

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

    static MatchPassword(AC: AbstractControl) {
        let password = AC.get('password').value; // to get value in input tag
        let confirmPassword = AC.get('confirmPassword').value; // to get value in input tag
        if (password != confirmPassword) {
            AC.get('confirmPassword').setErrors({ MatchPassword: true })
        } else {
            return null
        }
    }

}
