import {Component, Input, Output, EventEmitter, OnChanges, SimpleChanges} from "@angular/core";
@Component({
  selector:'checkbox-group',
  template:`
  <div style="border-bottom: 1px solid rgb(233, 233, 233);padding-bottom: 7px;">
    <label nz-checkbox  [(ngModel)]="allChecked" (ngModelChange)="updateAllChecked()" [nzIndeterminate]="indeterminate">
      <span>全选</span>
    </label>
  </div>
  <br>
  <!--<nz-checkbox-group [(ngModel)]="groupList" (ngModelChange)="updateSingleChecked()"></nz-checkbox-group>-->
    <label nz-checkbox [(ngModel)]="data.checked" (ngModelChange)="updateSingleChecked()" *ngFor="let data of groupList">
      <span>{{data.name}}</span>
    </label>
  `
})

export class CheckBoxGroup implements OnChanges{
  @Input() groupList:any=[];
  @Output() checkAllHanler =  new EventEmitter();
  @Output() singleCheck = new EventEmitter();
  indeterminate:boolean = false;
  allChecked:boolean=false;//全选标志
  constructor(){}
  ngOnChanges(changes: SimpleChanges):void{
    this.updateSingleChecked();
  }
  /**
   *
   * 全选
   */
  updateAllChecked() {
    this.indeterminate = false;
    if (this.allChecked) {
      this.groupList.forEach(item => item.checked = true);
    } else {
      this.groupList.forEach(item => item.checked = false);
    }
    this.checkAllHanler.emit(this.groupList);
  }

  /**
   * 单选
   */
  updateSingleChecked() {
    if (this.groupList.every(item => item.checked === false)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.groupList.every(item => item.checked === true)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
    this.singleCheck.emit(this.groupList);
  }
}
