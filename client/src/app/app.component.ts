import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationService } from './services/notification.service';
import { AuthService } from './services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angularApp';
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);
  private notif = inject(NotificationService);

  ngOnInit() {
    this.authService.isUserLoggedIn();

    this.notif.notifications$.subscribe((notifs) => {
      if (notifs.length > 0) this.showNotification(`${notifs[0].title}: ${notifs[0].message}`);
    });
  }

  showNotification(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  ngOnDestroy() {
    this.notif.clear();
  }

}
