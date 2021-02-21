import { Component, OnInit } from '@angular/core';
import { Examen } from 'src/app/models/examen';
import { CommonFormComponent } from '../common-form.component';
import { ExamenService } from '../../services/examen.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Asignatura } from '../../models/asignatura';
import { Pregunta } from 'src/app/models/pregunta';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-examen-form',
  templateUrl: './examen-form.component.html',
  styleUrls: ['./examen-form.component.css']
})
export class ExamenFormComponent   extends CommonFormComponent<Examen,ExamenService> implements OnInit {

  asignaturaPadre:Asignatura[]=[];
  asignaturaHija:Asignatura[]=[];


  constructor(service:ExamenService,router:Router,active:ActivatedRoute) {
    super(service,router,active);
    this.titulo = 'Crear Examen';
    this.model = new Examen();
    this.nombreModel = Examen.name;
    this.redirect = '/examenes';
   }

   cargarHijos(){
     this.asignaturaHija = this.model.asignaturaPadre?this.model.asignaturaPadre.hijos:[];
   }

   compararAsignatura(a1:Asignatura,a2:Asignatura):boolean{
      if(a1===undefined && a2===undefined){
        return true;
      }

      return (a1===null || a2===null || a1===undefined || a2===undefined)
      ?false:a1.id===a2.id;
   }

   agregarPregunta(){
     this.model.preguntas.push(new Pregunta());
   }

   asignarTexto(pregunta:Pregunta,event:any){
    pregunta.texto = event.target.value as string;
    console.log(this.model);
   }

   eliminarPregunta(pregunta:Pregunta){
      this.model.preguntas=this.model.preguntas.filter(p=> pregunta.texto !== p.texto);
   }

   eliminarPreguntaVacias(){
     console.log("eentro");
    this.model.preguntas=this.model.preguntas.filter(p=> p.texto != null && p.texto.length>0);
 }

 public crear():void{
   if(this.model.preguntas.length===0){
    Swal.fire('Error Preguntas','Examenes debe tener preguntas','error');
    return;
   }
   this.eliminarPreguntaVacias();
   super.crear();
 }

 public editar():void{
  if(this.model.preguntas.length===0){
    Swal.fire('Error Preguntas','Examenes debe tener preguntas','error');
    return;
   }
   this.eliminarPreguntaVacias();
   super.editar();
 }

   ngOnInit(): void {
    this.active.paramMap.subscribe(param=>{
      const id:number= +param.get('id');
      if(id){
        this.alumnoServices.ver(id).subscribe(m=> {
          this.model = m;
         this.titulo= 'Editar'+this.nombreModel;
         
         this.cargarHijos();
       
        });


      }
    });
   
    this.alumnoServices.findAllAsignaturas().subscribe(asignaturas=>{
      

      this.asignaturaPadre=asignaturas.filter(m=>!m.padre);
      //console.log("trae "+this.asignaturaPadre.forEach(l=>console.log(l.nombre)));
      
    });

   }
  

}
