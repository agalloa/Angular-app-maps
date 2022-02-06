import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarkerColor {
  color: string;
  marker?: mapboxgl.Marker;
  centro?: [ number, number ];
}

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
  marcadores: MarkerColor[] = [];
  
  constructor() { }

  ngAfterViewInit(): void {

    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });
    this.readLocalStorage();
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
      this.marcadores.push({
        color,
        marker: nuevoMarcador
      });
      this.saveLocalStorage();

      //actualiza la latitud y longitud del marker en el localstorage
      nuevoMarcador.on('dragend', () =>{
        this.saveLocalStorage();
      });
  }

  goMarker( marker: mapboxgl.Marker ){
    console.log(marker);
    this.mapa.flyTo({
      center: marker.getLngLat()
    }); 
  }

  //función para guardar los marcadores en el localStorage
  saveLocalStorage(){
    const lngLatArr:MarkerColor[] = [];

    this.marcadores.forEach( m => {
      const color = m.color;
      const { lng, lat } = m.marker!.getLngLat();
      
      lngLatArr.push({
        color: m.color,
        centro: [ lng, lat ]
      });
    });
    localStorage.setItem('marcadores', JSON.stringify(lngLatArr));
  }

  //función para leer los markers que estan guardados en el localStorage
  readLocalStorage(){
    if( !localStorage.getItem('marcadores')){
      return;
    } else {
      const lngLatArr: MarkerColor[] = JSON.parse( localStorage.getItem('marcadores')! );

    lngLatArr.forEach( m => {
      const newMarker = new mapboxgl.Marker({
        color: m.color,
        draggable:true
      })
      .setLngLat( m.centro! )
      .addTo( this.mapa );

      this.marcadores.push({
        marker: newMarker,
        color: m.color
      });
      //actualiza la latitud y longitud del marker en el localstorage
      newMarker.on('dragend', () =>{
        this.saveLocalStorage();
      });
    });
    }
  }

  //función para borrar el marker
  deleteMarker( i:number ){
    ///borrado del mapa
    this.marcadores[i].marker?.remove();

    //borrado del arreglo de marcadores
    this.marcadores.splice(i,1);

    //borrado del localstorage
    this.saveLocalStorage();
  }
}
