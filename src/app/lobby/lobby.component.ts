import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  content?: string;

  // contactForm!: FormGroup;

  boardSize = [
    {id:1, name: "3x3"},
    {id:2, name: "4x4"},
    {id:3, name: "5x5"}
  ];

  isSubmitted!: boolean;

  toggle() {
    this.isSubmitted = !this.isSubmitted;
  }

  // boardSizes() {
  //   this.boardSize;
  // }

  scoreToPlay = [
    {id:1, name: "1"},
    {id:2, name: "3"},
    {id:3, name: "5"}
  ];

  isBoardChosen = false;
  isBoardEmpty = false;
  errorMessage = '';
  FormBuilder: any;

  isScoreChosen = false;
  isScoreEmpty = false;

  gameForm: FormGroup = new FormGroup ({
    checker: new FormControl('', Validators.required),
  })


  constructor(private userService: UserService, private fb:FormBuilder) { }

  ngOnInit(): void {
    this.userService.getPublicContent().subscribe({
      next: data => {
        this.content = data;
      },
      error: err => {
        this.content = JSON.parse(err.error).message;
      }
    });


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
