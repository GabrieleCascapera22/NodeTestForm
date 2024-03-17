import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Paragraph } from 'src/app/models/paragraph';
import { RequestForm } from 'src/app/models/requestForm';
import { maxParoleValidator } from 'src/app/validators/max-parole';
import { CreazioneArticoloService } from './creazione-articolo.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-creazione-articolo',
  templateUrl: './creazione-articolo.component.html',
  styleUrls: ['./creazione-articolo.component.css'],
  providers: [MessageService]
})
export class CreazioneArticoloComponent implements OnInit {

  infoPersonaliForm: FormGroup;
  mappaFormFoto:Map<string,File>=new Map<string,File>();

  constructor(private formBuilder: FormBuilder,private service:CreazioneArticoloService,private messageService: MessageService) {
    this.infoPersonaliForm = this.formBuilder.group({
      lingua: ['It', [Validators.required]],
      titolo: ['', [Validators.required,maxParoleValidator(15)]],
      sottoTitolo: ['',[maxParoleValidator(17)]],
      descrizione: ['', [Validators.required]],
      citta: ['', [Validators.required]],
      immagine: [undefined,[Validators.required]],
      paragrafi: this.formBuilder.array([this.creaParagrafo()])
    });
   }

  ngOnInit(): void {
  }

  /**
 *metodo utile per la creazione di un nuovo paragrafo
 * @returns {FormGroup} il formgroup di un paragrafo
 */
  creaParagrafo(): FormGroup {

    return this.formBuilder.group({
      paragraphTitle: ['', Validators.required],
      mediaImage: [undefined, Validators.required],
      paragraphText : ['', Validators.required],
      destinationID : ['', Validators.required],
    });

  }
/**
 * gettter specificato per risolvere un errore di tipizzazione nel template html
 */
  get paragrafiFormArray(): FormArray {
    return this.infoPersonaliForm.get('paragrafi') as FormArray;
  }
  /**
 * metodo utile per l aggiunta di un paragrafo al form
 */
  aggiungiParagrafo(){
    this.paragrafiFormArray.push(this.creaParagrafo());
  }

  rimuoviParagrafo(index: number) {
    this.paragrafiFormArray.removeAt(index);
  }

  /**
 *metodo che gestisce il carimento di tutte le foto dei form
 * @param {File} file - foto caricato dal form
 * @param {string} provenienza - dato inviato direttamente dal template che decide se proviene da un paragrafo o dalle info
 */
  caricamentoFile(e:Event,provenianza:string){
    let span:Element|null=null;
    let index:string='';

    if(provenianza.includes('-')){
      index=provenianza.split('-')[1];
      span= document.querySelector('#spanParagrafoFotoError-'+index);
    }
    if (span) {
      span.textContent = "";
    }

    let inputElement = e.target as HTMLInputElement;
    let file: File = (inputElement.files as FileList)[0];

    this.rispettaDimensioniImmagine(file)
    .then((rispettaDimensioni) => {
      if (rispettaDimensioni) {
        if(this.mappaFormFoto.has(provenianza)){
          this.mappaFormFoto.delete(provenianza);
        }
        this.mappaFormFoto.set(provenianza,file);
      } else {
        if (span) {
          let paragrafi = this.infoPersonaliForm.get('paragrafi');
          if(paragrafi){
            (paragrafi as FormArray).at(Number(index)).patchValue({
              mediaImage:null
            })
          }
          span.textContent = "L'immagine non rispetta le dimensioni prestabilite";
        }
      }
    })
    .catch((error) => {
      if (span) {
        span.textContent = "Errore nel caricamento del file";
      }
    });
  }

  /**
 * controlla la dimensione delle immagini
 * @param {File} file -la foto caricata dal form
 * @returns {Promise<boolean>} ritorna una promise booleana true se rispetta le dimensioni false altrimenti
 */
  rispettaDimensioniImmagine(file: File): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (event: any) => {
        img.src = event.target.result;
        img.onload = () => {
          const larghezza = img.width;
          const altezza = img.height;
          if (larghezza > 1600 || altezza > 1000) {
            resolve(false);
          } else {
            resolve(true);
          }
        };
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }

  /**
 *metodo che gestisce la chiamata al BE
 */
  salva(){
    let request:RequestForm=this.doRequest();
    this.service.creaArticolo(request).subscribe(
      res=>{
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Articolo caricato con successo'});
      },
      error=>{
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Errore nel caricamento'});
        console.error(error);
      }
    )
  }

  /**
 * metodo utile per la creazione della request per la chiamata al BE
 * @returns {RequestForm} ritrona la request compilata
 */
  doRequest():RequestForm{
    let request:RequestForm={
      lingua:this.infoPersonaliForm.get('lingua')?.value,
      title:this.infoPersonaliForm.get('titolo')?.value,
      subtitle:this.infoPersonaliForm.get('sottoTitolo')?.value,
      description:this.infoPersonaliForm.get('descrizione')?.value,
      destinationId:[this.infoPersonaliForm.get('citta')?.value],
      mediaImage:this.mappaFormFoto.has('infoPersonali')?this.mappaFormFoto.get('infoPersonali'):null,
      paragraph:[]
    }
    this.infoPersonaliForm.get('paragrafi')?.value.map((value:Paragraph,i:number)=>{
      let provenienza:string='paragrafo-'+i;
      value.mediaImage=this.mappaFormFoto.has(provenienza)?this.mappaFormFoto.get(provenienza):null;
      return value;
    });
    request.paragraph.push(...this.infoPersonaliForm.get('paragrafi')?.value);
    return request;
  }

  /**
 * Controlla se il form e valido o meno
 * @returns {boolean} se il form non e valido torna true e blocca il pulsante di salvataggio
 */
  bloccaTastoSalva():boolean{
    return this.infoPersonaliForm.status==='INVALID';
  }
}
