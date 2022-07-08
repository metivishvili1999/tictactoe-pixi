import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../_services/user.service';
import * as gameData from '../gameData';
import { __values } from 'tslib';
import signalR from '@microsoft/signalr';



@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  content?: string;

  // contactForm!: FormGroup;

  boardSize = [
    {id:1, name: "3x3", cellNumber: 9},
    {id:2, name: "4x4", cellNumber: 16},
    {id:3, name: "5x5", cellNumber: 25}
  ];



  isSubmitted!: boolean;

  // toggle() {
  //   this.isSubmitted = !this.isSubmitted;
  // }
  
  scoreToPlay = [
    {id:1, name: "1"},
    {id:2, name: "3"},
    {id:3, name: "5"}
  ];


  FormBuilder: any;

  gameForm: FormGroup = new FormGroup ({
  })


  constructor(private userService: UserService, private fb:FormBuilder) { }

  ngOnInit(): void {
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
      console.log(this.gameForm.value)
      gameData.data.setboardSize(this.gameForm.value.size);
      gameData.data.setScore(this.gameForm.value.score);
    } else {
      console.log('Form is not')
    }
  }
}
