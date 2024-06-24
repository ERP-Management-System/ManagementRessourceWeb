import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table-component',
  template: `
    <table *ngIf="showTable">
      <thead>
        <tr>
          <th>Column 1</th>
          <th>Column 2</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Value 1.1</td>
          <td>Value 1.2</td>
        </tr>
        <tr>
          <td>Value 2.1</td>
          <td>Value 2.2</td>
        </tr>
      </tbody>
    </table>
  `
})
export class TableComponent {
  @Input() showTable: boolean = false;
}