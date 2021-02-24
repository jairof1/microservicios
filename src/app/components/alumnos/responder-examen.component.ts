import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Curso } from 'src/app/models/curso';
import { Alumno } from '../../models/alumno';
import { Examen } from '../../models/examen';
import { AlumnoService } from '../../services/alumno.service';
import { CursoService } from '../../services/curso.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ResponderExamenModalComponent } from './responder-examen-modal.component';
import { RespuestaService } from '../../services/respuesta.service';
import { Respuesta } from '../../models/respuesta';
import Swal from 'sweetalert2';
import { VerExamenModalComponent } from './ver-examen-modal.component';

@Component({
  selector: 'app-responder-examen',
  templateUrl: './responder-examen.component.html',
  styleUrls: ['./responder-examen.component.css']
})
export class ResponderExamenComponent implements OnInit {

  alumno:Alumno;
  curso:Curso;
  examenes:Examen[]=[];
  mostrarColumnas:string[]=['nombre','asignatura','preguntas','responder','ver'];
  datasource:MatTableDataSource<Examen>;
  @ViewChild(MatPaginator,{static:true}) paginator : MatPaginator;
  pageSizeOptions:number[]=[3,5,10,20,50]


  constructor(private route: ActivatedRoute,private serviceAlumno:AlumnoService,
    private serviceCurso:CursoService,public dialog:MatDialog,private serviceRespuesta:RespuestaService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(p=>{
    const id:number= +p.get('id')
    this.serviceAlumno.ver(id).subscribe(alumno=>{
      this.alumno=alumno;
      this.serviceCurso.obtenerCursoPorAlumnoId(this.alumno).subscribe(c=>{
        this.curso=c
        this.examenes =(this.curso && this.curso.examenes)? this.curso.examenes:[];
        this.datasource= new MatTableDataSource(this.examenes);
        this.datasource.paginator=this.paginator;
        this.paginator._intl.itemsPerPageLabel='Registros por pagina';
      });
    });
    
    });
  }


  responderExamen(examen:Examen):void{
   const modalref=this.dialog.open(ResponderExamenModalComponent,{
      width:'750px',
      data:{curso:this.curso,alumno:this.alumno,examen:examen}
    });

    modalref.afterClosed().subscribe(respuestas=>{
      console.log(respuestas)
    if(respuestas){
      const respu:Respuesta[] = Array.from(respuestas.values());
      this.serviceRespuesta.crear(respu).subscribe(rs=>{
        examen.respondido=true;
        Swal.fire('Enviadas:',
        'Preguntas enviadas con exito',
        'success');
        console.log(rs);
      });
    }
  });
}

verExamen(examen:Examen){
  this.serviceRespuesta.obtenerRespuestaPorAlumnoPorExamen(this.alumno,examen).subscribe(rs=>{
    const modalRef = this.dialog.open(VerExamenModalComponent,{
      width:'750px',
      data:{curso:this.curso,examen:examen,respuestas : rs}
    });

    modalRef.afterClosed().subscribe(()=>{
      console.log("modal  ver examen cerrado");
    });
  });


}
}
