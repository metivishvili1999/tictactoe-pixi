
import { Component } from '@angular/core';
import { TokenStorageService } from './_services/token-storage.service';
import { webSocket } from 'rxjs/webSocket';
import * as signalR from '@microsoft/signalr';  

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private roles: string[] = [];
  isLoggedIn = false;
  userName?: string;

  constructor(private tokenStorageService: TokenStorageService) {}

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if(this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.userName = user.userName;
    }


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

 const connection = new signalR.HubConnectionBuilder()  
 .configureLogging(signalR.LogLevel.Information)  
 .withUrl('http://172.25.36.202:8085/signalr')  
 .build();  

connection.start().then(function () {  
 console.log('SignalR Connected!');
 connection.on("receivematches", (sandro,rere) => {  
   console.log(sandro);
 }); 
 connection.invoke("creatematch", 3,2);
}).catch(function (err) {  
 return console.error(err.toString());  
});  



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

  

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }


  title = 'tictactoe';
}
