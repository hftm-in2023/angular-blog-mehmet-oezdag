import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface User {
  name: string;
  email: string;
  age: number;
}

@Component({
  selector: 'app-demo',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSliderModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatProgressBarModule,
    MatDividerModule,
  ],
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.scss',
})
export class DemoComponent {
  // Properties for different demos
  title = 'Angular Konzepte Demo';

  // For NgModel 2-way binding
  userName = '';
  userEmail = '';
  userAge = 25;
  selectedTheme = 'blue';
  isNewsletterSubscribed = false;
  selectedGender = 'male';

  // For @if and @switch demonstrations
  showAdvancedOptions = false;
  currentView: 'list' | 'grid' | 'cards' = 'list';

  // For @for demonstration
  tasks: Task[] = [
    { id: 1, title: 'Angular Material hinzufügen', completed: true, priority: 'high' },
    { id: 2, title: 'Demo Component erstellen', completed: true, priority: 'medium' },
    { id: 3, title: 'Event Binding implementieren', completed: false, priority: 'high' },
    { id: 4, title: 'NgClass und NgStyle testen', completed: false, priority: 'low' },
  ];

  colors = ['red', 'green', 'blue', 'purple', 'orange'];

  // For NgClass and NgStyle
  isDarkMode = false;
  backgroundOpacity = 50;
  borderRadius = 8;

  // For click events
  clickCount = 0;
  lastClickedTask: string | null = null;

  // Available themes for select
  themes = [
    { value: 'blue', label: 'Blau' },
    { value: 'red', label: 'Rot' },
    { value: 'green', label: 'Grün' },
    { value: 'purple', label: 'Violett' },
  ];

  // Event binding methods
  onButtonClick(): void {
    this.clickCount++;
  }

  onTaskClick(taskTitle: string): void {
    this.lastClickedTask = taskTitle;
  }

  onThemeChange(): void {
    // Theme changed successfully
  }

  toggleAdvancedOptions(): void {
    this.showAdvancedOptions = !this.showAdvancedOptions;
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
  }

  addNewTask(): void {
    const newTask: Task = {
      id: this.tasks.length + 1,
      title: `Neue Aufgabe ${this.tasks.length + 1}`,
      completed: false,
      priority: 'medium',
    };
    this.tasks.push(newTask);
  }

  toggleTaskCompletion(task: Task): void {
    task.completed = !task.completed;
  }

  removeTask(taskId: number): void {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
  }

  // Methods for NgClass demonstration
  getTaskClasses(task: Task): object {
    return {
      'task-completed': task.completed,
      'task-high-priority': task.priority === 'high',
      'task-medium-priority': task.priority === 'medium',
      'task-low-priority': task.priority === 'low',
    };
  }

  getGridItemClasses(task: Task, isEven: boolean): object {
    return {
      'even-item': isEven,
      'odd-item': !isEven,
      'task-completed': task.completed,
      'task-high-priority': task.priority === 'high',
      'task-medium-priority': task.priority === 'medium',
      'task-low-priority': task.priority === 'low',
    };
  }

  getCardItemClasses(task: Task, isFirst: boolean, isLast: boolean): object {
    return {
      'first-card': isFirst,
      'last-card': isLast,
      'task-completed': task.completed,
      'task-high-priority': task.priority === 'high',
      'task-medium-priority': task.priority === 'medium',
      'task-low-priority': task.priority === 'low',
    };
  }

  getCardClasses(): object {
    return {
      'dark-theme': this.isDarkMode,
      'light-theme': !this.isDarkMode,
      'advanced-visible': this.showAdvancedOptions,
    };
  }

  // Methods for NgStyle demonstration
  getBackgroundStyle(): object {
    return {
      'background-color': this.getThemeColor(),
      opacity: this.backgroundOpacity / 100,
      'border-radius.px': this.borderRadius,
    };
  }

  getThemeColor(): string {
    const themeColors: Record<string, string> = {
      blue: '#2196F3',
      red: '#F44336',
      green: '#4CAF50',
      purple: '#9C27B0',
    };
    return themeColors[this.selectedTheme] || '#2196F3';
  }

  getUserInfo(): User {
    return {
      name: this.userName,
      email: this.userEmail,
      age: this.userAge,
    };
  }

  getCompletionPercentage(): number {
    if (this.tasks.length === 0) return 0;
    return (this.tasks.filter((task) => task.completed).length / this.tasks.length) * 100;
  }

  getCompletedTasksCount(): number {
    return this.tasks.filter((task) => task.completed).length;
  }
}
