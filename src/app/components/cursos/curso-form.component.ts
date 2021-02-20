import { Component, OnInit } from '@angular/core';
import { Curso } from 'src/app/models/curso';
import { CommonFormComponent } from '../common-form.component';
import { CursoService } from '../../services/curso.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-curso-form',
  templateUrl: './curso-form.component.html',
  styleUrls: ['./curso-form.component.css']
})
export class CursoFormComponent extends CommonFormComponent<Curso,CursoService> implements OnInit {
  
  constructor(serviceCurso:CursoService,router:Router,active:ActivatedRoute) {
    super(serviceCurso,router,active);
    this.titulo = 'Crear Curso';
    this.model = new Curso();
    this.redirect = '/cursos';
    this.nombreModel = Curso.name;
  }

  

}
