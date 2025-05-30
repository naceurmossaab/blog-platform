import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment.development';

export interface NotificationData {
  type?: string;
  title: string;
  message: string;
  articleId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private socketUrl = environment.apiUrl.replace('/api/v1/', '');
  private socket: Socket;
  private notificationsSubject = new BehaviorSubject<NotificationData[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  constructor() {
    this.socket = io(this.socketUrl);

    this.socket.on('connect', () => { });

    this.socket.on('notification', (data: NotificationData) => {
      const current = this.notificationsSubject.value;
      this.notificationsSubject.next([data, ...current]);
    });

    this.socket.on('disconnect', () => { });
  }

  registerUser(userId: string) {
    console.log(`📝 Enregistrement de l'utilisateur ${userId} sur le socket`);
    this.socket.emit('register', userId);
  }

  clear() {
    this.notificationsSubject.next([]);
  }
}
