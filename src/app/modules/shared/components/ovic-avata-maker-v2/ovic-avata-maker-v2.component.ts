import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {OutputFormat} from "ngx-image-cropper/lib/interfaces/cropper-options.interface";
import {ImageCroppedEvent} from "ngx-image-cropper";
import {AvatarMaker} from "@shared/models/avatar-maker";
import {Subscription} from "rxjs";
import {NotificationService} from "@core/services/notification.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "@core/services/auth.service";
import {FileService} from "@core/services/file.service";
import {filter, map} from "rxjs/operators";
import {BUTTON_NO, BUTTON_YES} from "@core/models/buttons";
import {state, style, trigger} from "@angular/animations";
import {UnsubscribeOnDestroy} from "@core/utils/decorator";

@Component({
  selector: 'app-ovic-avata-maker-v2',
  templateUrl: './ovic-avata-maker-v2.component.html',
  styleUrls: ['./ovic-avata-maker-v2.component.css'],
  animations  : [
    trigger( 'effect' , [
      state( 'open' , style( {
        'opacity'    : '1' ,
        'z-index'    : '10' ,
        'visibility' : 'visible'
      } ) ) ,
      state( 'close' , style( {
        'opacity'    : '0' ,
        'z-index'    : '-1' ,
        'visibility' : 'hidden'
      } ) )
    ] )
  ]
})
@UnsubscribeOnDestroy()

export class OvicAvataMakerV2Component implements OnInit {

  @ViewChild( 'video' ) video : ElementRef;

  @ViewChild( 'canvas' ) canvas : ElementRef;

  @Input() panelWidth = 640;

  @Input() panelHeight = 480;

  @Input() maintainAspectRatio = true;

  @Input() aspectRatio = 4 / 6;

  @Input() resizeToWidth = 151;

  @Input() imageQuality = 100;

  @Input() format : OutputFormat = 'png';

  @Input() resizeToHeight : number;

  @Input() cropperMinWidth : number;

  @Input() cropperMinHeight : number;

  @Input() cropperMaxHeight : number;

  @Input() cropperMaxWidth : number;

  @Input() cropperStaticWidth : number;

  @Input() cropperStaticHeight : number;

  @Input() dirRectImage : { enable : boolean; dataUrl : string } = { enable : false , dataUrl : null };
  @Input() rotateShow = false;
  degreeRotation : number = 0;

  imgRaw : string;

  croppedImage : ImageCroppedEvent;

  errorMessage : string;

  cameraAvailable : boolean;

  cameraMode = 'close';

  croppedPanelMode = 'close';

  translations = {
    cancelActionHead    : 'Xác nhận hủy' ,
    cancelActionMessage : 'Bạn có chắc chắn muốn hủy không' ,
    original            : 'Ảnh gốc' , //the original image
    destination         : 'Ảnh kết quả' ,  //destination image
    btnCancel           : 'Hủy' ,
    btnTakePicture      : 'Chụp lại' ,
    btnChoosePicture    : 'Chọn lại' ,
    btnSave             : 'Lưu lại'
  };

  btnTakePicture = this.translations.btnTakePicture;

  dismissAct : AvatarMaker = {
    error     : true ,
    errorCode : -2 ,
    data      : null ,
    message   : 'User does block camera'
  };

  rejectByUser : AvatarMaker = {
    error     : true ,
    errorCode : -1 ,
    data      : null ,
    message   : 'The progress was canceled by user'
  };

  cameraNotAvailable : AvatarMaker = {
    error     : true ,
    errorCode : -3 ,
    data      : null ,
    message   : 'Requested device not found'
  };

  result : AvatarMaker = {
    error     : false ,
    errorCode : 1 ,
    data      : null ,
    message   : 'Successful'
  };

  stream : MediaStream;

  subscriptions = new Subscription();

  constructor(
    private notificationService : NotificationService ,
    private activeModal : NgbActiveModal ,
    private auth : AuthService ,
    private fileService : FileService
  ) {
    const observerTranslate$ = this.auth.appLanguageSettings().pipe( filter( v => v !== null && v !== undefined ) , map( res => res && res.translations ? res.translations.avatarMakerComponent : null ) ).subscribe( {
      next : ( translations : any ) => {
        this.translations.cancelActionHead    = translations.cancelActionHead;
        this.translations.cancelActionMessage = translations.cancelActionMessage;
        this.translations.original            = translations.original;
        this.translations.destination         = translations.destination;
        this.translations.btnCancel           = translations.btnCancel;
        this.translations.btnTakePicture      = translations.btnTakePicture;
        this.translations.btnChoosePicture    = translations.btnChoosePicture;
        this.translations.btnSave             = translations.btnSave;
        this.dismissAct.message               = translations.dismissAct;
        this.rejectByUser.message             = translations.rejectByUser;
        this.cameraNotAvailable.message       = translations.cameraNotAvailable;
        this.result.message                   = translations.result;
      }
    } );
    this.subscriptions.add( observerTranslate$ );
  }

  ngOnInit() : void {
    if ( this.dirRectImage.enable ) {
      this.enableDirRectImageMode( this.dirRectImage.dataUrl );
      this.btnTakePicture = this.translations.btnChoosePicture;
    }
  }

  ngAfterViewInit() {
    if ( !this.dirRectImage.enable ) {
      if ( navigator.mediaDevices && navigator.mediaDevices.getUserMedia ) {
        navigator.mediaDevices.getUserMedia( { video : true } ).then(
          stream => {
            this.stream                        = stream;
            this.video.nativeElement.srcObject = stream;
            this.video.nativeElement.play();
            this.cameraAvailable  = true;
            this.cameraMode       = 'open';
            this.croppedPanelMode = 'close';
          } ,
          error => {
            if ( error.code === 0 ) {
              this.errorMessage     = 'Vùi lòng cho phép camera hoạt động trên thiết bị này';
              this.croppedPanelMode = 'close';
            } else {
              this.cameraAvailable  = false;
              this.cameraMode       = 'close';
              this.croppedPanelMode = 'close';
              this.closeProcess( this.cameraNotAvailable );
            }
          }
        );
      } else {
      }
    }
  }

  enableDirRectImageMode( dataUrl : string ) {
    this.imgRaw           = dataUrl;
    this.cameraMode       = 'close';
    this.croppedPanelMode = 'open';
  }

  capture() {
    this.canvas.nativeElement.getContext( '2d' ).drawImage( this.video.nativeElement , 0 , 0 , this.panelWidth , this.panelHeight );
    this.imgRaw           = this.canvas.nativeElement.toDataURL( 'image/png' );
    this.cameraMode       = 'close';
    this.croppedPanelMode = 'open';
  }

  // imageCropped( event : ImageCroppedEvent ) {
  // 	this.croppedImage = event;
  // 	this.result.data  = event;
  // }
  imageCropped( event : ImageCroppedEvent ) {
    this.croppedImage = event;
    const clone = this.croppedImage;
    if(this.croppedImage.width>=1000){
      this.croppedImage.width = clone.width *2/5;
      this.croppedImage.height = clone.height *2/5;
    }
    this.result.data  = event;
  }

  imageLoaded() {
    // show cropper
    // this.hideError();
  }

  cropperReady() {
    // cropper ready
  }

  loadImageFailed() {
    // show message
    // this.showError( 'controls.fileType' );
  }

  turnOffCamera() {
    this.video.nativeElement.srcObject = null;
    this.video.nativeElement.pause();
    this.stream?.getTracks()[ 0 ].stop();
  }

  closeProcess( data : AvatarMaker ) {
    this.turnOffCamera();
    this.activeModal.close( data );
  }

  async cancelAct() {
    try {
      const body   = '<p>' + this.translations.cancelActionMessage + '</p>';
      const head   = this.translations.cancelActionHead;
      const button = await this.notificationService.confirmRounded( body , head , [ BUTTON_YES , BUTTON_NO ] );
      if ( button.name === BUTTON_YES.name ) {
        this.turnOffCamera();
        this.closeProcess( this.rejectByUser );
      }
    } catch ( e ) {

    }
  }

  takeNewPicture() {
    this.cameraMode       = 'open';
    this.croppedPanelMode = 'close';
  }

  rotateImage(){
    // this.croppedImage
    this.degreeRotation = this.degreeRotation === 0 ? 1: (this.degreeRotation === 1 ? 2: (this.degreeRotation ===2 ? -1 : 0)) ;
  }
}
