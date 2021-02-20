import { Component, OnInit, ViewChild } from '@angular/core';
import { Alumno } from 'src/app/models/alumno';
import { AlumnoService } from '../../services/alumno.service';
import Swal from 'sweetalert2'
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CommonListarComponent } from '../common-listar.component';
import { BASE_ENDPOINT } from 'src/app/config/app';


@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.component.html',
  styles: [
  ]
})
export class AlumnosComponent extends CommonListarComponent<Alumno,AlumnoService> implements OnInit {
  baseEndPoint= BASE_ENDPOINT + '/alumnos';
  constructor(service: AlumnoService){
    super(service);
    this.titulo='Listado de Alumnos';
    this.nombreModel=Alumno.name;
  }
}
