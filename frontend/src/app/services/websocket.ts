
import { Injectable } from '@angular/core';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Websocket {
  private stompClient: Client;
  private notificationsSubject = new BehaviorSubject<string | null>(null);
  private onlineUsersSubject = new BehaviorSubject<number>(0);
  private statusSubject = new BehaviorSubject<any>(null);
  private notificationSubscription?: StompSubscription;
  private onlineUsersSubscription?: StompSubscription;
  private statusSubscription?: StompSubscription;

  constructor() {
    this.stompClient = new Client({
      brokerURL: undefined,
      webSocketFactory: () => new SockJS('/ws'),
      reconnectDelay: 5000,
    });
    this.stompClient.onConnect = () => {
      this.subscribeToNotifications();
      this.subscribeToOnlineUsers();
      this.subscribeToStatus();
    };
    this.stompClient.activate();
  }

  private subscribeToNotifications() {
    this.notificationSubscription = this.stompClient.subscribe('/topic/notifications', (message: IMessage) => {
      this.notificationsSubject.next(message.body);
    });
  }

  private subscribeToOnlineUsers() {
    this.onlineUsersSubscription = this.stompClient.subscribe('/topic/online-users', (message: IMessage) => {
      this.onlineUsersSubject.next(Number(message.body));
    });
  }

  private subscribeToStatus() {
    this.statusSubscription = this.stompClient.subscribe('/topic/status', (message: IMessage) => {
      this.statusSubject.next(JSON.parse(message.body));
    });
  }

  get notifications$(): Observable<string | null> {
    return this.notificationsSubject.asObservable();
  }

  get onlineUsers$(): Observable<number> {
    return this.onlineUsersSubject.asObservable();
  }

  get status$(): Observable<any> {
    return this.statusSubject.asObservable();
  }

  disconnect() {
    this.stompClient.deactivate();
  }
}
