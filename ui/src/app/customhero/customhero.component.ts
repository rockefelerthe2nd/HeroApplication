import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import {Heroes, HttpClientService} from "../services/http-client.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-customhero',
  templateUrl: './customhero.component.html',
  styleUrls: ['./customhero.component.css']
})
export class CustomheroComponent implements OnInit, AfterViewInit {

  constructor(private elem: ElementRef, private httpClient: HttpClientService, private route: Router) { }
  hero: Heroes = new Heroes(0, "", "", "", "");
  heroAmend: Heroes = new Heroes(0, "", "", "", "");
  count: number;
  editMode: boolean;
  addMode: boolean;
  objectId: number;

  ngOnInit() {
     this.setInputValue();

    this.addMode = true;
    this.count = 0;
    this.objectId = Number(localStorage.getItem('count'));
    if(this.objectId===null){
      this.hero.id = this.count;
    }else{
      this.httpClient.getAllHeroes().subscribe(data=>{
        this.count = data.length;
        localStorage.setItem('count', ('' +  this.count+1));
      }, e => {e});

    }
    let editOption = localStorage.getItem('editMode');
    if(editOption ==='true'){
      this.editMode = true;
      this.addMode = false;
    }
    console.log(editOption);
  }
  ngAfterViewInit() {
    this.setInputValue();

    let heroName =  this.elem.nativeElement.querySelector('#name');
    heroName.placeholder = heroName.value;

    let heroPower =  this.elem.nativeElement.querySelector('#power');
    heroPower.placeholder = heroPower.value;

    let heroWeakness =  this.elem.nativeElement.querySelector('#weakness');
    heroWeakness.placeholder = heroWeakness.value;

    let heroInfo =  this.elem.nativeElement.querySelector('#info');
    heroInfo.placeholder = heroInfo.value;

  }

  editHero(){

    this.httpClient.editHero(this.hero, this.hero.id).subscribe(data=>{}, e=>{e});
  }

  createHero():void{
    let heroMainDiv = this.elem.nativeElement.getElementsByClassName('custom-hero-main');
    heroMainDiv[0].style.display = 'none';

    let loadingSpinner = this.elem.nativeElement.getElementsByClassName('loading-spinner');

    this.hero.id = Number(localStorage.getItem('count'));
    this.httpClient.createHeroes(this.hero).subscribe(data=>{}, e=>{});

    this.count = this.hero.id;

    console.log('id on createHero', this.hero.id);
    this.count++;

    loadingSpinner[0].style.display = 'block';
    setTimeout(()=>{
      this.route.navigateByUrl('hero').then(r => {});
    }, 1000);
  }

  setInputValue(){
    this.heroAmend.id = Number(localStorage.getItem('id'));
    this.heroAmend.name = localStorage.getItem('name');
    this.heroAmend.power = localStorage.getItem('power');
    this.heroAmend.weakness = localStorage.getItem('weakness');
    this.heroAmend.info = localStorage.getItem('info');

  }

}
