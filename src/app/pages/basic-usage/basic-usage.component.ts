import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-basic-usage',
  templateUrl: './basic-usage.component.html',
  styleUrls: ['./basic-usage.component.scss'],
})
export class BasicUsageComponent implements OnInit {
  readonly code1 = `const obs$ = this.httpClient.get('/api');`;

  readonly code2 = `const sub = obs$.subscribe(
  value => console.log(value),
  error => console.error(error),
  () => console.log('obs$ is completed')
);`;

  constructor() {}

  ngOnInit(): void {}
}
