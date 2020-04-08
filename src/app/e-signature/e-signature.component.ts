import { Component, Input, ViewChild, OnInit, HostListener, ElementRef, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'e-signature',
  template: `<div style="float:right">
  <canvas #userSignaturePad (mousedown)="onMouseDown($event)" (touchstart)="onMouseDown($event)"
  (mousemove)="onMouseMove($event)" (touchmove)="onMouseMove($event)" width="600px" height="150px"></canvas>
  <br/>
  <button mat-button (click)="clear()" style="color: blue;">Reset</button>
  <span>Do your *e-signature in the above box </span>
  </div>`,
  styles: [`
  canvas {
    border: 1px solid #8e8e8e;
    background-color: rgba(0,0,0,.04);  
  }
  span {
    font-size:0.7rem;
    margin-left: 100px;
  }
  `]
})

export class ESignatureComponent implements OnInit {

  @Input() name?: string;
  // @ViewChild('sigPad', {read: ElementRef, static:false}) sigPad;
  @ViewChild('userSignaturePad', {read: ElementRef, static:true}) private userSignaturePad: ElementRef;
  sigPadElement;
  context;
  isDrawing = false;
  img;
  @Output() image = new EventEmitter();

  ngOnInit() {
    this.sigPadElement = this.userSignaturePad.nativeElement;
    this.context = this.sigPadElement.getContext('2d');
    this.context.strokeStyle = '#3742fa';
  }


  @HostListener('document:mouseup', ['$event'])
  onMouseUp(e) {
    this.isDrawing = false;
  }

  onMouseDown(e) {
    this.isDrawing = true;
    const coords = this.relativeCoords(e);
    this.context.moveTo(coords.x, coords.y);
  }

  onMouseMove(e) {
    if (this.isDrawing) {
      e.preventDefault();
      const coords = this.relativeCoords(e);
      this.context.lineTo(coords.x, coords.y);
      this.context.stroke();
      this.img = this.sigPadElement.toDataURL("image/png");
      // console.log(this.img);
      this.image.emit(this.img);
    }
  }

  private relativeCoords(event) {
    let bounds = event.target.getBoundingClientRect();
    let x = event.clientX - bounds.left;
    let y = event.clientY - bounds.top;
    if(event.clientX==undefined){
      x = event.targetTouches[0].clientX - bounds.left;
      y = event.targetTouches[0].clientY - bounds.top;
    }
    
    return { x: x, y: y };
  }

  clear() {
    this.context.clearRect(0, 0, this.sigPadElement.width, this.sigPadElement.height);
    this.context.beginPath();
    this.img=null;
    // console.log(this.img);
    this.image.emit(this.img);
  }

  save() {
    this.img = this.sigPadElement.toDataURL("image/png");
    // console.log(this.img);
    this.image.emit(this.img);
  }


}


