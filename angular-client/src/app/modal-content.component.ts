import { Component } from '@angular/core';

@Component({
  selector: 'modal-content',
  styleUrls: ["./modal.component.css"],
  template: `
    <div id="modal-element" class="container">
      <div class="modal-header" style="background: #425CBB">
        <h1 class="page-title">{{title}}</h1>
      </div>
    <div class="modal-body">
      <h4 [innerHtml]="body" style=" font-weight: lighter"></h4>
      <div style="margin-top: 0">
        <span class="option-button" (click)="onReject()">NIE</span>
        <span class="option-button" (click)="onConfirm()">TAK</span>
      </div>
    </div>
    </div>
  `
})
export class ModalContentComponent {
  public title: string;
  public body: string;

  public demandConfirmation = false;
  public showCloseButton = false;
  public extraButtons: ModalExtraButton[];
  public rejectLabel: string;
  public confirmLabel: string;
  public closeButtonLabel: string;

  public onConfirm() {};
  public onReject() {};
  public onCloseButtonClick() {};
}

export interface ModalExtraButton {
  label: string;
  action: any;
  cssClass?: string;
}
