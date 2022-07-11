
import { Component } from '@angular/core';
import { TokenStorageService } from './_services/token-storage.service';
import * as gameData from './gameData'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  userName?: string;
  constructor(private tokenStorageService: TokenStorageService) {}

  ngOnInit(): void {


// const subject = webSocket('ws://192.168.146.93:44356');

// subject.subscribe({
//   next: msg => console.log('message received: ' + msg), // Called whenever there is a message from the server.
//   error: err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
//   complete: () => console.log('complete') // Called when connection is closed (for whatever reason).
//  });

// const connection = new signalR.HubConnectionBuilder()  
// .configureLogging(signalR.LogLevel.Information)  
// .withUrl('http://172.25.36.202:8085/signalr')  
// .build();  

//  const connection = new signalR.HubConnectionBuilder()  
//  .configureLogging(signalR.LogLevel.Information)  
//  .withUrl('http://172.25.36.202:8085/signalr')  
//  .build();  

// connection.start().then(function () {  
//  console.log('SignalR Connected!');
//  connection.on("receivemessage", (sandro) => {  
//    console.log(sandro);
//  }); 
//  connection.invoke("creatematch");
// }).catch(function (err) {  
//  return console.error(err.toString());  
// });  



  }



// let connection = new signalR.HubConnectionBuilder()
//     .withUrl("/chathub", {
//         accessTokenFactory: () => {
//             // Get and return the access token.
//             // This function can return a JavaScript Promise if asynchronous
//             // logic is required to retrieve the access token.
//         }
//     })
//     .build();

//   }


  public get isLoggedIn() {
    return gameData.data.data.user.sessionId != null;
  }

  

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }


  title = 'tictactoe';
}
