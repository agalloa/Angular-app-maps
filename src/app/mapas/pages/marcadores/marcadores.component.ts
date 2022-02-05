import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles:[
    `
      .mapa-container{
        width: 100%;
        height: 100%;
      }
      .list-group{
        position:fixed;
        top:20px;
        right:20px;
        z-index: 99;
      }
      li{
        cursor:pointer;
      }
    `
  ]
})
export class MarcadoresComponent implements AfterViewInit {
  
  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 15;
  center: [number, number] = [ -118.35900591281063, 34.06725115085475 ];

  //arreglo de marcadores
  
  constructor() { }

  ngAfterViewInit(): void {

    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });

    /* const markerHtml: HTMLElement = document.createElement('div');
    markerHtml.innerHTML = ' Hola mundo';

    const maker = new mapboxgl.Marker( { element: markerHtml })
      .setLngLat( this.center ) 
      .addTo( this.mapa );
    */
  }
  addMarker(){
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const nuevoMarcador = new mapboxgl.Marker({ draggable: true , color })
      .setLngLat( this.center )
      .addTo( this.mapa );
  }
  goMarker(){

  }
}
