import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import * as gameData from '../gameData';
import { Route, Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: any = {
    userName: null,
    password: null,
    sessionId: null
  };

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';

  constructor(private route: Router, private authService: AuthService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const { userName, password, sessionId } = this.form;
    this.authService.login(userName, password, sessionId).subscribe ({
      next: data => {
        console.log(data)
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        gameData.data.data.user.sessionId = data.sessionId;
        gameData.data.data.user.userName = userName;
        this.route.navigateByUrl('/home');
      },
      error: err => {
        console.log(err)
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });
  }

}
