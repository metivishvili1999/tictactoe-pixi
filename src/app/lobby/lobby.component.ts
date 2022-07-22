import { ChangeDetectorRef, Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../_services/user.service';
import * as gameData from '../gameData';
import { __values } from 'tslib';
import * as signalR from '@microsoft/signalr';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})


export class LobbyComponent implements OnInit {
  content?: string;
  isSubmitted!: boolean;


  boardSize = [
    {id:1, name: "3x3", cellNumber: 9},
    {id:2, name: "4x4", cellNumber: 16},
    {id:3, name: "5x5", cellNumber: 25}
  ];

  scoreToPlay = [
    {id:1, name: "1", score: 1},
    {id:2, name: "3", score: 3},
    {id:3, name: "5", score: 5}
  ];


  FormBuilder: any;
  gameForm: FormGroup = new FormGroup ({
  })

  public connection: signalR.HubConnection
  public isConnected: any;


  constructor(private fb:FormBuilder, private ref: ChangeDetectorRef) {}
  ngOnInit(): void {

    this.gameForm = this.fb.group ({
      size:[null],
      score:[null]
    });
    
    this.connection = new signalR.HubConnectionBuilder()  
   .configureLogging(signalR.LogLevel.Information)  
   .withUrl('http://172.25.36.202:8085/signalr', {
       accessTokenFactory: () => 
   gameData.data.data.user.sessionId })  
   .build();  

   if(gameData.data.data.user.sessionId != null) {
    this.isConnected = this.connection.start().then(
      function () {
      console.log('SignalR Connected!');
      }
      ).catch(function (err) {  
      return console.error(err.toString());  
      });


        this.connection.on('getallgame', (response) => {
          gameData.data.data.gameTables = response;
          console.warn(response);
          this.ref.detectChanges();
        });
  
        this.isConnected.then( () => {
        
            this.connection.invoke(
              'CreateGame',  {
                boardSize: this.boardSize,
                scoreTarget: this. scoreToPlay
              }
              ).catch(err => console.error(err));
          
        });

        this.connection.on('ongamecreate', (response) => {
          console.warn(response);
          this.ref.detectChanges();
        });
   }


  }

  public get tables() {
    return gameData.data.data.gameTables;
  }

  selectSize(e:any): void {
    gameData.data.setboardSize(0);
  }

  selectScore(e:any): void {
    gameData.data.setScore(0);
  }

  onSubmit() {
    this.isSubmitted = true;
    this.gameForm.markAllAsTouched();
    if(this.gameForm.valid) {
      gameData.data.setboardSize(this.gameForm.value.size);
      gameData.data.setScore(this.gameForm.value.score);
    } else {
      console.log('Form is not')
    }
  }
}
