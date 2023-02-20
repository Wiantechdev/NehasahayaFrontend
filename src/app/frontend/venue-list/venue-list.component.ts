import { Component, OnInit, ViewChild } from '@angular/core';

import data from '../../../assets/demo/data/navigation.json';
import { ProductService } from '../../demo/service/productservice';
import { Product } from '../../demo/domain/product';
import listingblock from '../../../assets/demo/data/listing.json';
import { BannerService } from 'src/app/services/banner.service';
import { VenueService } from 'src/app/manage/venue/service/venue.service';
import { environment } from 'src/environments/environment';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
@Component({
  selector: 'app-venue-list',
  templateUrl: './venue-list.component.html',
  styleUrls: ['./venue-list.component.scss'],
  providers: [BannerService]

})
export class VenueListComponent implements OnInit {
  val1: number;

  val2: number = 3;

  val3: number = 5;

  val4: number = 5;

  val5: number;

  msg: string;

  products: Product[];

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];
  listing: any[] = [
    {
      breakpoint: '1680px',
      numVisible: 4,
      numScroll: 4,
      margin: 20,
    },
    {
      breakpoint: '1460px',
      numVisible: 4,
      numScroll: 4,
    },
    {
      breakpoint: '1353px',
      numVisible: 3,
      numScroll: 3,
      margin: 20,
    },
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3,
      margin: 20,
    },
    {
      breakpoint: '992px',
      numVisible: 2,
      numScroll: 2,
      margin: 20,
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '560px',
      numVisible: 2,
      numScroll: 2
    }
  ];

  carouselResponsiveOptions: any[] = [
    {
      breakpoint: '1680px',
      numVisible: 10,
      numScroll: 10,
      margin: 20,
    },
    {
      breakpoint: '1460px',
      numVisible: 9,
      numScroll: 9,
      margin: 20,
    },
    {
      breakpoint: '1353px',
      numVisible: 7,
      numScroll: 7,
      margin: 20,
    },
    {
      breakpoint: '1024px',
      numVisible: 6,
      numScroll: 6,
      margin: 20,
    },
    {
      breakpoint: '768px',
      numVisible: 5,
      numScroll: 5
    },
    {
      breakpoint: '560px',
      numVisible: 5.5,
      numScroll: 5.5
    }
  ];
  public listingblock;
  public navigation = data;
  public loading: boolean = true;
  public bannerList: any[] = [];
  public bannerImageList: any[] = [];
  public venueList: any[] = [];
  public totalRecords: 0;
  errorMessage = '';
  public pagination = [8, 10, 20, 50, 100, 1000, { showAll: 'All' }];
  public categoryMenuList: any[] = [];
  public parentCategoryId;
  public parentCategoryDetails;
  downloadFlg: boolean = false;
  pageSize = 10;
  currentpage = 2;
  first;
  private lazyLoadEvent: LazyLoadEvent;
  public selectedCategoryId;
  public assuredVenueList: any[] = [];
  @ViewChild('paginator', { static: true }) paginator: Paginator
  constructor(
    private productService: ProductService,
    private BannerService: BannerService,
    private venueService: VenueService,
    private router: Router,
    private categoryService: CategoryService,
  ) { }
  ngOnInit() {
    this.first = (this.currentpage - 1) * this.pageSize;
    this.listingblock = listingblock;
    this.productService.getVenue().then(products => {
      this.products = products;
    });
    this.getCategoryBySlug();

  }
  private updateCurrentPage(currentPage: number): void {
    setTimeout(() => this.paginator.changePage(currentPage));
  }
  toggleCanvas() {

  }
  toggleSearch() {

  }

  getVenueList(event: LazyLoadEvent) {
    var pagenumber = 1;
    var params = "";
    var rows = 8;
    let query = "filterByDisable=false&filterByStatus=true&filterByCategory=" + this.selectedCategoryId;
    if (event !== undefined) {
      if (event.first != undefined && event.first == 0) {
        pagenumber = event.first + 1;
      } else if (event.first != undefined && event.first > 0) {
        pagenumber = (event.first / event.rows) + 1;
      } else {
        pagenumber = 1;
      }
      if (event.rows != undefined) {
        rows = event.rows;
      } else {
        rows = 10;
      }
    }

    query += "&pageSize=" + rows + "&pageNumber=" + pagenumber + params;
    this.venueService.getVenueListWithoutAuth(query).subscribe(
      data => {
        //if (data.data.items.length > 0) {
        this.venueList = data.data.items;

        this.totalRecords = data.data.totalCount;
        //}
      },
      err => {
        this.errorMessage = err.error.message;
      }
    );
  }

  getCategoryBySlug() {

    let query = "?filterByDisable=false&filterByStatus=true&filterBySlug=parent_category";
    this.categoryService.getCategoryWithoutAuthList(query).subscribe(
      data => {

        if (data.data.items.length > 0) {
          this.parentCategoryDetails = data.data.items[0];
          this.parentCategoryId = this.parentCategoryDetails['id'];
          this.getCategoryList();
        }
      },
      err => {
        this.errorMessage = err.error.message;
      }
    );
  }

  getCategoryList() {
    let query = "?filterByDisable=false&filterByStatus=true&filterByParent=" + this.parentCategoryId + "&sortBy=created_at&orderBy=1";
    this.categoryService.getCategoryWithoutAuthList(query).subscribe(
      data => {
        //if (data.data.items.length > 0) {
        this.categoryMenuList = data.data.items;
        this.selectedCategoryId = this.categoryMenuList[0].id;
        var index = this.categoryMenuList.findIndex(x => x.id === this.selectedCategoryId);
        this.categoryMenuList[index]['show'] = 'active';
        this.getVenueList(this.lazyLoadEvent);
        this.getAssuredVenueList();
        //}
      },
      err => {
        this.errorMessage = err.error.message;
      }
    );
  }
  getAssuredVenueList() {
    let query = "filterByDisable=false&filterByStatus=true&filterByAssured=true&filterByCategory=" + this.selectedCategoryId;
    this.venueService.getVenueListWithoutAuth(query).subscribe(
      data => {
        //if (data.data.items.length > 0) {
        this.assuredVenueList = data.data.items;
        //}
      },
      err => {
        this.errorMessage = err.error.message;
      }
    );
  }
  onClickCategory(category) {
    this.selectedCategoryId = category.id;
    this.categoryMenuList.map(x => x.show = 'false');
    var index = this.categoryMenuList.findIndex(x => x.id === this.selectedCategoryId);
    this.categoryMenuList[index]['show'] = 'active';
    this.getVenueList(this.lazyLoadEvent);
    this.getAssuredVenueList();
  }

  getVenueDetails(id) {
    this.router.navigateByUrl('/venue/' + id);
  }
}