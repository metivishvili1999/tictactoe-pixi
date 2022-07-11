import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as signalR from '@microsoft/signalr';
import { TokenStorageService } from '../_services/token-storage.service';
import * as gameData from '../gameData';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  content?: string;
  isLoggedIn = false;

  isSubmitted!: boolean;
  sesId: any;

  toggle() {
    this.isSubmitted = !this.isSubmitted;
  }


  login() {
     const connection = new signalR.HubConnectionBuilder()  
    .configureLogging(signalR.LogLevel.Information)  
    .withUrl('http://172.25.36.202:8085/signalr', { accessTokenFactory: () => gameData.data.data.user.sessionId })  
    .build();  

    connection.start().then(function () {  
    console.log('SignalR Connected!');
    // connection.on("receivemessage", (sandro) => {  
    //   console.log(sandro);
    // }); 
    // connection.invoke("creatematch");
    }).catch(function (err) {  
    return console.error(err.toString());  
    });  
  }

  errorMessage = '';
  FormBuilder: any;

  // isScoreChosen = false;
  // isScoreEmpty = false;

  gameForm: FormGroup = new FormGroup ({
    checker: new FormControl('', Validators.required),
  })


  constructor(private userService: UserService, 
    private fb:FormBuilder, private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if(this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.sesId = user.sessionId;
    }

    if(this.sesId != null) {
      const connection = new signalR.HubConnectionBuilder()  
      .configureLogging(signalR.LogLevel.Information)  
      .withUrl('http://172.25.36.202:8085/signalr', gameData.data.data.user.sessionId)
      .build();  
  
  
        connection.start().then(function () {  
        console.log('SignalR Connected!');
        connection.on("receivemessage", (sandro) => {  
          console.log(sandro);
        }); 
        connection.invoke("creatematch");
        }).catch(function (err) {  
        return console.error(err.toString());  
        }); 
    }


    // let connection = new signalR.HubConnectionBuilder()
    // .withUrl("/chathub", {
    //     accessTokenFactory: () => {
          
    //     }
    // })
    // .build();


    // this.userService.getPublicContent().subscribe({
    //   next: data => {
    //     this.content = data;
    //   },
    //   error: err => {
    //     this.content = JSON.parse(err.error).message;
    //   }
    // });


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
