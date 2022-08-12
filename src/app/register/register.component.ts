import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  form: any = {
    firstName: null,
    lastName: null,
    userNames: null,
    password: null,
  };

  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  onSubmit(): void {
    const { firstName, lastName, userName, password } = this.form;
    console.log(firstName, lastName, userName, password);
    this.authService
      .register(firstName, lastName, userName, password)
      .subscribe((data) => {
        console.log(data);
        if (data.length > 6) {
          this.isSignUpFailed = true;
          this.isSuccessful = false;
          this.errorMessage = 'Username already exist!';
        } else {
          this.isSignUpFailed = false;
          this.isSuccessful = true;
        }
      });
  }
}
