import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DB } from 'src/app/models/db';
import { Paragraph } from 'src/app/models/paragraph';
import { paragraphDb } from 'src/app/models/paragraphDb';
import { RequestForm } from 'src/app/models/requestForm';

@Injectable({
  providedIn: 'root'
})
export class CreazioneArticoloService {

  constructor(private http: HttpClient) { }

  /**
 * metodo che gestisce la chiamata http per la creazione di un articolo
 * @param {RequestForm} request -oggetto della request per la creazione di un articolo
 * @returns {Observable<boolean>} ritorna un booleano con l esito della chiamata settato sempre a true
 */
  creaArticolo(request:RequestForm) : Observable<boolean>{
    console.log(request)
    let fd = new FormData();
    fd.append('lingua',request.lingua);
    fd.append('title',request.title);
    fd.append('subtitle',request.subtitle);
    fd.append('description',request.description);
    fd.append('destinationID',request.destinationId.toString());
    fd.append('mediaImage',request.mediaImage??'');
    request.paragraph.forEach((value,i)=>{
      fd.append('paragraphTitle-'+i,value.paragraphTitle.toString()),
      fd.append('mediaImage-'+i,value.mediaImage??'');
      fd.append('paragraphText-'+i,value.paragraphText);
      fd.append('destinationID-'+i,value.destinationID);
    });

    this.salvataggioInLocalStorage(fd);
    return of(true)
  }

  /**
 * metodo che simula il BE e salva la request nella session storage
 * @param {FormData} fd - formdata della request
 */
  salvataggioInLocalStorage(fd:FormData){
    let db:DB={
      lingua:fd.get('lingua') as string,
      title:fd.get('title') as string,
      subtitle:fd.get('subtitle') as string,
      description:fd.get('description') as string,
      destinationId:[fd.get('destinationID') as string],
      paragraph:[]
    };
    let immagine:File=fd.get('mediaImage') as File;
    this.convertToBase64(immagine).then(base64String => {
      db={
        ...db,
        mediaImage:base64String
      }
    })
    .catch(error => {
      console.error('Errore durante la conversione dell\'immagine:', error);
    });
    let i=0;
    while(fd.has('paragraphTitle-'+i)){
      let paragrafo:paragraphDb={
        paragraphTitle:[(fd.get('paragraphTitle-'+i) as string)],
        paragraphText:(fd.get('paragraphText-'+i) as string),
        destinationID:(fd.get('destinationID-'+i) as string),
      };
      this.convertToBase64(immagine).then(base64String => {
      paragrafo={
        ...paragrafo,
        mediaImage:base64String
      }
      db.paragraph.push(paragrafo);
      localStorage.removeItem('db');
      localStorage.setItem('db',JSON.stringify(db));
      })
      .catch(error => {
        console.error('Errore durante la conversione dell\'immagine:', error);
      });
      i++;
    };
  }

  /**
 * metodo utile che si occupa della conversione di un file in un base64
 * @param {File} file - foto da convertire
 * @returns {Promise<string>} ritorna una promise string con all interno il base64 della foto
 */
  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();

      reader.onload = () => {
        let base64= reader.result as string;
        resolve(base64);
      };

      reader.onerror = () => {
        reject('Errore nella lettura del file');
      };

      reader.readAsDataURL(file);
    });
  }
}
