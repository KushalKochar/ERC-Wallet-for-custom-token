import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import Utils from '../shared/utils/utils';
import { Web3Service } from '../shared/servcies/web3.service';
import { AuthenticationService } from '../shared/servcies/authentication.service';
import { Router } from '@angular/router';
import { WalletService } from '../shared/servcies/wallet.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  password: string;
  confirmPassword: string;

  constructor(fb: FormBuilder,
    private wdb3Service: Web3Service,
    private authService: AuthenticationService,
    private router: Router,
    private walletService: WalletService) {
    this.form = fb.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {
        validator: Utils.MatchPassword // validation method
      })
  }

  onSubmit() {
    if (this.walletService.registerUser(this.form.controls["password"].value)) {
      this.router.navigateByUrl('/app-dashboard');
    } else {
    }

  }

  ngOnInit() {
    if (this.authService.registered) {
      this.router.navigateByUrl('/app-login');
    }
  }

}
