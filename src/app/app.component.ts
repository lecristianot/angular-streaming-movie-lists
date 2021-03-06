import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public isOpen: boolean = false;
  public isSearchOpen: boolean = false;
  public isRemOpen: boolean = false;
  public title = 'Streaming Lists | Netflix, Prime, Disney+, HBO, HULU';
  public dialogTitle: string = '';
  public reminders: any;
  public currentItem: string;

  constructor(
    private metaTagService: Meta,
    private titleService: Title
  ) { }

  public navigate(link) {
    window.location.href = link;
  }

  public openSearch() {
    this.isSearchOpen = true;
  }

  public open() {
    this.currentItem = (localStorage.getItem('currentItem')!= undefined) ? JSON.parse(localStorage.getItem('currentItem')) : [  ];
    this.reminders = this.currentItem;
    this.dialogTitle = "Reminders";
    this.isRemOpen = true;
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
    this.metaTagService.addTags([
      { name: 'description', content: 'Popular movies streaming on netflix, prime video and disney +.' },
      { name: 'keywords', content: 'streaming, movies, netflix' },
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: 'Ian Poston' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { charset: 'UTF-8' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@StreamingLists' },
      { name: 'twitter:title', content: this.title },
      { name: 'twitter:description', content: 'Popular movies streaming on netflix, prime video and disney +.' },
      { name: 'twitter:image', content: 'https://streaminglists.com/assets/images/home-page.png' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Streaming Lists' },
      { property: 'og:title', content: this.title },
      { property: 'og:description', content: 'Popular movies streaming on netflix, prime video and disney +.' },
      { property: 'og:url', content: 'https://streaminglists.com' },
      { property: 'og:image', content: 'https://streaminglists.com/assets/images/home-page.png' }
    ]);
  }
}
