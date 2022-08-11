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
        console.log(data )
        if(data.errorCode === -1) {
          this.isLoggedIn = false;
          this.isLoginFailed = true;
          this.errorMessage = 'Username or password is incorrect'
        } else if(data.errorCode === 1) {
          this.isLoggedIn = true;
          this.isLoginFailed = false;
          gameData.data.data.user.sessionId = data.sessionId;
          gameData.data.data.user.userName = userName;
          gameData.data.data.isDone = true;
          this.route.navigateByUrl('/home');
        }
      }
    });
  }

}
