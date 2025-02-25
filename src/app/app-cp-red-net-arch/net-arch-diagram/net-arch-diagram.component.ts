import { faSkullCrossbones, faCogs, faFile, faLock } from '@fortawesome/free-solid-svg-icons';
import { CPRedNetArchNode } from './../models/net-arch-node';
import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'cs-net-arch-diagram',
  templateUrl: './net-arch-diagram.component.html',
  styleUrls: ['./net-arch-diagram.component.css']
})
export class NetArchDiagramComponent implements OnInit, OnChanges {
  faSkullCrossbones = faSkullCrossbones;
  faCogs = faCogs;
  faFile = faFile;
  faLock = faLock;

  @Input()
  arch: CPRedNetArchNode = new CPRedNetArchNode();

  diagram: string = '';
  svg: SafeHtml = '';

  level = 3;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.createDiagram();
  }

  ngOnChanges(): void {
    this.createDiagram();
  }

  createDiagram() {
    if(this.arch && this.arch.branch.length > 0) {
    this.diagram = this.createCircles(this.arch, 50, 25);
    this.svg = this.sanitizer.bypassSecurityTrustHtml(`
    <svg style="width:100%" height="${this.level * 100}">
      <g>
      ${this.diagram}
      </g>
    </svg>`);
    }
  }

  createCircles(node:CPRedNetArchNode, x: number, offset: number): string {
    this.level = (node.level < this.level) ? this.level : node.level;
    let circle = `<circle cx='${x}%' cy='${node.level * 70}' r='15' fill='#000000'></circle>`;
    circle += `<circle cx='${x}%' cy='${node.level * 70}' r='14' fill='#CCCCCC'></circle>`;

    circle += `<g transform='translate(-6,-8)'><svg x='${x}%' y='${(node.level * 70)}'><g>
      <path transform='scale(0.03)'
       fill="currentColor"
       d="${this.getIcon(node.type)}"
       class="csd-net-icon"
       >
      </path>
      </g></svg></g>`;
    if (node.branch && node.branch.length === 1) {
      circle += `<line x1="${x}%" y1="${(node.level * 70) + 15}" x2="${x}%" y2="${(node.level * 70) + 55}" style="stroke: rgb(0, 0, 0);stroke-width: 2;"></line>`;
      circle += this.createCircles(node.branch[0], x, offset);
    }
    if (node.branch && node.branch.length === 2) {
      circle += `<line x1="${x}%" y1="${(node.level * 70) + 15}" x2="${x}%" y2="${(node.level * 70) + 30}" style="stroke: rgb(0, 0, 0);stroke-width: 2;"></line>`;
      circle += `<line x1="${(x - offset)}%" y1="${(node.level * 70) + 30}" x2="${(x + offset)}%" y2="${(node.level * 70) + 30}" style="stroke: rgb(0, 0, 0);stroke-width: 2;"></line>`;
      circle += `<line x1="${(x - offset)}%" y1="${(node.level * 70) + 30}" x2="${(x - offset)}%" y2="${(node.level * 70) + 55}" style="stroke: rgb(0, 0, 0);stroke-width: 2;"></line>`;
      circle += `<line x1="${(x + offset)}%" y1="${(node.level * 70) + 30}" x2="${(x + offset)}%" y2="${(node.level * 70) + 55}" style="stroke: rgb(0, 0, 0);stroke-width: 2;"></line>`;
      circle += this.createCircles(node.branch[0], (x - offset), (offset/2));
      circle += this.createCircles(node.branch[1], (x + offset), (offset/2));
    }
    circle += `<circle cx='${x}%' cy='${(node.level * 70) - 25}' r='10' fill='#FFFFFF' style='z-index:100'></circle>`;
    circle += `<g transform='translate(-5,0)'>
      <text x='${x}%' y='${(node.level * 70) - 20}' font-size="smaller" style='z-index:101'>${node.id}</text>
    </g>`;
    return circle;
  }

  private getIcon(type: string) {
    switch(type){
      case 'file':
        return this.faFile.icon[4];
      case 'controller':
        return this.faCogs.icon[4];
      case 'program':
        return this.faSkullCrossbones.icon[4];
    }
    return this.faLock.icon[4];
  }

}
