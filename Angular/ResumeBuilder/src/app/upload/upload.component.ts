import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpEventType, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SubmitService } from '../submit.service';
import { response } from 'express';

 interface UploadData {
   file?: File;
   // Add other data fields you need to send along with the file
   description?: string;
 }
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})


export class UploadComponent {
   selectedFile: File;
   uploadData: UploadData = {};
   uploadError: string;
   loading: boolean;
   resumeOutput: string;

   constructor(private http: HttpClient) {}

   onFileSelected(event: any) {
     this.selectedFile = event.target.files[0];
    this.uploadError = null; // Clear any previous errors
   }

   onSubmit() {
    this.uploadData.file = this.selectedFile;
    this.loading = true;

    // Add other data to uploadData as needed

     const formData = new FormData();
     formData.append('file', this.selectedFile);
     //formData.append('data', JSON.stringify(this.uploadData)); // Send additional data as JSON

     this.http.post<any>('https://tensorgirl-gemini-resume-parser.hf.space/resume_parser/', formData)
       .subscribe(response => {
         console.log('Upload successful!', response);
        this.selectedFile = null; // Clear selection after successful upload
        this.resumeOutput = response;
       }, (error: HttpErrorResponse) => {
         this.uploadError = 'Upload failed: ' + error.message;
        console.error('Upload error:', error);
        this.loading = false;
       });
   }

  // file: any;
  // http: any;
  // getFile(event: any) {

  //   this.file = event.target.files[0];
  //   console.log('File : ', this.file);

  // }

  // UploadFile() {

  //   let formData = new FormData();
  //   formData.set('file', this.file);

  //   //API calling
  //   this.http.post('http://localhost:36195/upload/uloadFiles').subscribe((response) => { })

  // }


}
