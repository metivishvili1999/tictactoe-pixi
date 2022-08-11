import { Component, Injectable, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TokenStorageService } from '../_services/token-storage.service';
import { Router } from '@angular/router';
import * as gameData from '../gameData';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {
  content?: string;
  isLoggedIn = true;

  isSubmitted!: boolean;
  sesId: any;

  isD = gameData.data.data.isDone;

  toggle() {
    this.isSubmitted = !this.isSubmitted;
  }

  login() {
    this.route.navigateByUrl('/lobby');
 }


  errorMessage = '';
  FormBuilder: any;

  gameForm: FormGroup = new FormGroup ({
    checker: new FormControl('', Validators.required),
  })


  constructor(private userService: UserService,private route: Router,
    private fb:FormBuilder, private tokenStorageService: TokenStorageService) { }

    

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if(this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.sesId = user.sessionId;
    }

    this.gameForm = this.fb.group ({
      size:[null],
      score:[null]
    });
  }


  onSubmit() {
    this.isSubmitted = true;
    this.gameForm.markAllAsTouched();
    if(this.gameForm.valid) {
      console.log(this.gameForm.value)
    } else {
      console.log('Form is not')
    }
  }

}