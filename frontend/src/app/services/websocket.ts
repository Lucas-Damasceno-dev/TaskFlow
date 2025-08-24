
import { Injectable } from '@angular/core';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { Project } from '../models/project.model';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class Websocket {
  private stompClient: Client;
  private notificationsSubject = new BehaviorSubject<string | null>(null);
  private projectsSubject = new BehaviorSubject<Project | null>(null);
  private tasksSubject = new BehaviorSubject<Task | null>(null);

  constructor() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      reconnectDelay: 5000,
    });

    this.stompClient.onConnect = () => {
      this.subscribeToTopics();
    };

    this.stompClient.activate();
  }

  private subscribeToTopics() {
    this.stompClient.subscribe('/topic/notifications', (message: IMessage) => {
      this.notificationsSubject.next(message.body);
    });

    this.stompClient.subscribe('/topic/projects', (message: IMessage) => {
      this.projectsSubject.next(JSON.parse(message.body));
    });

    this.stompClient.subscribe('/topic/tasks', (message: IMessage) => {
      this.tasksSubject.next(JSON.parse(message.body));
    });
  }

  get notifications$(): Observable<string | null> {
    return this.notificationsSubject.asObservable();
  }

  get projects$(): Observable<Project | null> {
    return this.projectsSubject.asObservable();
  }

  get tasks$(): Observable<Task | null> {
    return this.tasksSubject.asObservable();
  }

  disconnect() {
    this.stompClient.deactivate();
  }
}
