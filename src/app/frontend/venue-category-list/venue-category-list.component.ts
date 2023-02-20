import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import data from '../../../assets/demo/data/navigation.json';
import { ProductService } from '../../demo/service/productservice';
import { Product } from '../../demo/domain/product';
import listingblock from '../../../assets/demo/data/listing.json';
import { BannerService } from 'src/app/services/banner.service';
import { VenueService } from 'src/app/manage/venue/service/venue.service';
import { environment } from 'src/environments/environment';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
@Component({
  selector: 'app-venue-category-list',
  templateUrl: './venue-category-list.component.html',
  styleUrls: ['./venue-category-list.component.css', '../navigation/navigation.component.css']
})
export class VenueCategoryListComponent {
  val1: number;
  val2: number = 50;
  val3: number;
  val4: number;
  venuePriceRangeValues: number[] = [Number(environment.minVenuePrice), Number(environment.maxVenuePrice)];
  carouselResponsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 12,
      numScroll: 12,
      margin: 20,
    },
    {
      breakpoint: '768px',
      numVisible: 12,
      numScroll: 12
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
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
  public pagination = environment.pagination;
  downloadFlg: boolean = false;
  pageSize = 10;
  currentpage = 2;
  private lazyLoadEvent: LazyLoadEvent;
  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
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
  public parentCategoryDetails: any[] = [];
  public parentCategoryId;
  public categoryMenuList;
  public selectedCategories: any[] = [];
  public filterCapacityArray: any[] = [];
  public capacityId;
  public mode = 'category';
  public propertyTypeId;
  public selectedPropertyTypes: any[] = [];
  public propertyTypesList: any[] = [];
  public selectedCategoriesNames: any[] = [];
  public selectedPropertyTypeNames: any[] = [];
  public selectedFoodTypeNames: any[] = [];
  public selectedFoodTypes: any[] = [];
  public minVenuePrice;
  public maxVenuePrice;
  value: number = 100;
  public capacity;
  public capacityCondition;
  public foodTypeId;
  public foodTypesList: any[] = [];

  // @ViewChild('capacity') capacity: ElementRef;
  @ViewChild('minVenuePriceInput') minVenuePriceInput: ElementRef;
  @ViewChild('maxVenuePriceInput') maxVenuePriceInput: ElementRef;
  constructor(
    private productService: ProductService,
    private BannerService: BannerService,
    private venueService: VenueService,
    private router: Router,
    private categoryService: CategoryService,
    private el: ElementRef,
  ) { }
  ngOnInit() {
    this.filterCapacityArray = [
      {
        'id': 1, 'label': "0-50", condition: 'lte', value: 50, status: false
      },
      {
        'id': 2, 'label': "0-100", condition: 'lte', value: 100, status: false
      },
      {
        'id': 3, 'label': "0-200", condition: 'lte', value: 200, status: false
      },
      {
        'id': 4, 'label': "0-500", condition: 'lte', value: 500, status: false
      },
      {
        'id': 5, 'label': ">500", condition: 'gte', value: 500, status: false
      },
    ]
    this.getCategoryBySlug();
  }
  getCategoryBySlug() {
    let query = "?filterByDisable=false&filterByStatus=true";
    this.categoryService.getCategoryWithoutAuthList(query).subscribe(
      data => {
        if (data.data.items.length > 0) {
          this.parentCategoryDetails = data.data.items;
          this.parentCategoryDetails.forEach(element => {
            if (element.slug == "parent_category") {
              this.parentCategoryId = element['id'];
              this.getCategoryList();
            }
            if (element.slug == "property_type") {
              this.propertyTypeId = element['id'];
              this.getPropertyTypes();
            }
            if (element.slug == "food") {
              this.foodTypeId = element['id'];
              this.getFoodTypes();
            }
          })
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
        let count = 0;
        this.categoryMenuList.forEach(element => {
          element['selected'] = false;
          if (count == 0) {
            element['selected'] = true;
            this.selectedCategories.push(this.categoryMenuList[0].id);
            this.selectedCategoriesNames.push({ 'id': element.id, 'name': element.name, selected: true });
          }
          count++;
        });
        let mode = "category";
        this.getVenueList(this.lazyLoadEvent, mode);
        //}
      },
      err => {
        this.errorMessage = err.error.message;
      }
    );
  }
  getFoodTypes() {
    let query = "?filterByDisable=false&filterByStatus=true&filterByParent=" + this.foodTypeId + "&sortBy=created_at&orderBy=1";
    this.categoryService.getCategoryWithoutAuthList(query).subscribe(
      data => {
        //if (data.data.items.length > 0) {
        this.foodTypesList = data.data.items;
        let count = 0;
        this.foodTypesList.forEach(element => {
          element['selected'] = false;
          count++;
        });
      },
      err => {
        this.errorMessage = err.error.message;
      }
    );
  }
  getPropertyTypes() {
    let query = "?filterByDisable=false&filterByStatus=true&filterByParent=" + this.propertyTypeId + "&sortBy=created_at&orderBy=1";
    this.categoryService.getCategoryWithoutAuthList(query).subscribe(
      data => {
        //if (data.data.items.length > 0) {
        this.propertyTypesList = data.data.items;
        let count = 0;
        this.propertyTypesList.forEach(element => {
          element['selected'] = false;
          count++;
        });
      },
      err => {
        this.errorMessage = err.error.message;
      }
    );
  }
  onClickCategory(category) {
    if (category.selected == true) {
      let index = this.findIndexById(category.id, this.categoryMenuList);
      if (index != -1) {
        this.categoryMenuList[index].selected = false;
        let selectedIndex = this.findSelectedIndexById(category.id, this.selectedCategories);
        if (selectedIndex != -1) {
          this.selectedCategories.splice(selectedIndex, 1);
        }
        let selectedNameIndex = this.findIndexById(category.id, this.selectedCategoriesNames);
        if (selectedNameIndex != -1) {
          this.selectedCategoriesNames.splice(selectedNameIndex, 1);
        }
      }
    } else {
      let index = this.findIndexById(category.id, this.categoryMenuList);
      if (index != -1) {
        this.categoryMenuList[index].selected = true;
        //let selectedIndex = this.findSelectedIndexById(category.id, this.selectedCategories);
        this.selectedCategories.push(category.id);
        this.selectedCategoriesNames.push({ 'id': category.id, 'name': category.name, selected: true });
      }
    }
    this.mode = "category";
    this.getVenueList(this.lazyLoadEvent, this.mode);
  }
  onClickFoodType(foodType) {
    if (foodType.selected == true) {
      let index = this.findIndexById(foodType.id, this.foodTypesList);
      if (index != -1) {
        this.foodTypesList[index].selected = false;
        let selectedIndex = this.findSelectedIndexById(foodType.id, this.selectedPropertyTypes);
        let selectedNameIndex = this.findIndexById(foodType.id, this.selectedPropertyTypeNames);
        this.selectedFoodTypes.splice(selectedIndex, 1);
        this.selectedFoodTypeNames.splice(selectedNameIndex, 1);
      }
    } else {
      let index = this.findIndexById(foodType.id, this.foodTypesList);
      if (index != -1) {
        this.foodTypesList[index].selected = true;
        this.selectedFoodTypes.push(foodType.id);
        this.selectedFoodTypeNames.push({ 'id': foodType.id, 'name': foodType.name, selected: true });
      }
    }
    this.mode = "food";
    this.getVenueList(this.lazyLoadEvent, this.mode);
  }
  onClickPropertyType(propertyType) {
    if (propertyType.selected == true) {
      let index = this.findIndexById(propertyType.id, this.propertyTypesList);
      if (index != -1) {
        this.propertyTypesList[index].selected = false;
        let selectedIndex = this.findSelectedIndexById(propertyType.id, this.selectedPropertyTypes);
        let selectedNameIndex = this.findIndexById(propertyType.id, this.selectedPropertyTypeNames);
        this.selectedPropertyTypes.splice(selectedIndex, 1);
        this.selectedPropertyTypeNames.splice(selectedNameIndex, 1);
      }
    } else {
      let index = this.findIndexById(propertyType.id, this.propertyTypesList);
      if (index != -1) {
        this.propertyTypesList[index].selected = true;
        //let selectedIndex = this.findSelectedIndexById(propertyType.id, this.selectedPropertyTypes);
        this.selectedPropertyTypes.push(propertyType.id);
        this.selectedPropertyTypeNames.push({ 'id': propertyType.id, 'name': propertyType.name, selected: true });
      }
    }
    this.mode = "propertyType";
    this.getVenueList(this.lazyLoadEvent, this.mode);
  }
  findSelectedIndexById(id, arrayName) {
    let index = -1;
    for (let i = 0; i < arrayName.length; i++) {
      if (arrayName[i] === id) {
        index = i;
        break;
      }
    }
    return index;
  }
  onClickGuestCount(capacity, event) {
    if (event.checked) {
      this.capacityId = capacity.id;
      this.capacity = capacity.value;
      this.capacityCondition = capacity.condition;

      this.filterCapacityArray.forEach(element => {
        let reportObj = { id: element.id, label: element.label, condition: element.condition, value: element.value, status: element.status };
        element.status = false;
        if (this.capacityId == element.id) {
          const index = this.findIndexById(element.id, this.filterCapacityArray);
          reportObj = { id: element.id, label: element.label, condition: element.condition, value: element.value, status: true };
          this.filterCapacityArray[index] = reportObj;
        }
      })
    } else {
      this.capacity = '';
      this.capacityCondition = '';
    }
    this.mode = "guest";
    this.getVenueList(this.lazyLoadEvent, this.mode);
  }
  findIndexById(id, arrayName) {
    let index = -1;
    for (let i = 0; i < arrayName.length; i++) {
      if (arrayName[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  }
  onVenuePriceChange() {
    this.minVenuePrice = this.minVenuePriceInput.nativeElement.value;
    this.maxVenuePrice = this.maxVenuePriceInput.nativeElement.value;
    this.mode = "venuePrice";
    this.getVenueList(this.lazyLoadEvent, this.mode);
  }
  getVenueList(event: LazyLoadEvent, mode) {
    let pagenumber = 1;
    let params = "";
    let rows = 10;
    let query = "filterByDisable=false&filterByStatus=true";
    if (mode == 'category') {
      query += "&filterByCategory=" + this.selectedCategories;
      if (this.selectedPropertyTypes.length > 0) {
        query += "&filterByPropertyType=" + this.selectedPropertyTypes;
      }
      if (this.minVenuePrice > 0 && this.maxVenuePrice > 0) {
        query += "&filterByMinVenuePrice=" + this.minVenuePrice + "&filterByMaxVenuePrice=" + this.maxVenuePrice;
      }
      if (this.capacityCondition != undefined && this.capacity != undefined && this.capacityCondition != '' && this.capacity != '') {
        query += "&filterByGuestCondition=" + this.capacityCondition + "&filterByGuestCapacity=" + this.capacity;
      }
      if (this.selectedFoodTypes.length > 0) {
        query += "&filterByFoodType=" + this.selectedFoodTypes;
      }
    }
    if (mode == 'propertyType') {
      query += "&filterByPropertyType=" + this.selectedPropertyTypes;
      if (this.selectedCategories.length > 0) {
        query += "&filterByCategory=" + this.selectedCategories;
      }
      if (this.minVenuePrice > 0 && this.maxVenuePrice > 0) {
        query += "&filterByMinVenuePrice=" + this.minVenuePrice + "&filterByMaxVenuePrice=" + this.maxVenuePrice;
      }
      if (this.capacityCondition != undefined && this.capacity != undefined && this.capacityCondition != '' && this.capacity != '') {
        query += "&filterByGuestCondition=" + this.capacityCondition + "&filterByGuestCapacity=" + this.capacity;
      }
      if (this.selectedFoodTypes.length > 0) {
        query += "&filterByFoodType=" + this.selectedFoodTypes;
      }
    }
    if (mode == 'food') {
      query += "&filterByFoodType=" + this.selectedFoodTypes;
      if (this.selectedCategories.length > 0) {
        query += "&filterByCategory=" + this.selectedCategories;
      }
      if (this.minVenuePrice > 0 && this.maxVenuePrice > 0) {
        query += "&filterByMinVenuePrice=" + this.minVenuePrice + "&filterByMaxVenuePrice=" + this.maxVenuePrice;
      }
      if (this.capacityCondition != undefined && this.capacity != undefined && this.capacityCondition != '' && this.capacity != '') {
        query += "&filterByGuestCondition=" + this.capacityCondition + "&filterByGuestCapacity=" + this.capacity;
      }
      if (this.selectedPropertyTypes.length > 0) {
        query += "&filterByPropertyType=" + this.selectedPropertyTypes;
      }
    }
    if (mode == 'venuePrice') {
      query += "&filterByMinVenuePrice=" + this.minVenuePrice + "&filterByMaxVenuePrice=" + this.maxVenuePrice;
      if (this.selectedCategories.length > 0) {
        query += "&filterByCategory=" + this.selectedCategories;
      }
      if (this.selectedPropertyTypes.length > 0) {
        query += "&filterByPropertyType=" + this.selectedPropertyTypes;
      }
      if (this.capacityCondition != undefined && this.capacity != undefined && this.capacityCondition != '' && this.capacity != '') {
        query += "&filterByGuestCondition=" + this.capacityCondition + "&filterByGuestCapacity=" + this.capacity;
      }
      if (this.selectedFoodTypes.length > 0) {
        query += "&filterByFoodType=" + this.selectedFoodTypes;
      }
    }
    if (mode == 'guest') {
      query += "&filterByGuestCondition=" + this.capacityCondition + "&filterByGuestCapacity=" + this.capacity;
      if (this.selectedCategories.length > 0) {
        query += "&filterByCategory=" + this.selectedCategories;
      }
      if (this.selectedPropertyTypes.length > 0) {
        query += "&filterByPropertyType=" + this.selectedPropertyTypes;
      }
      if (this.minVenuePrice > 0 && this.maxVenuePrice > 0) {
        query += "&filterByMinVenuePrice=" + this.minVenuePrice + "&filterByMaxVenuePrice=" + this.maxVenuePrice;
      }
      if (this.selectedFoodTypes.length > 0) {
        query += "&filterByFoodType=" + this.selectedFoodTypes;
      }
    }
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
        this.venueList.forEach(element => {
          // this.facilitiesArray = [];
          element['facilities'] = [];
          let hallObj = {
            'title': "Hall",
            'details': element.capacityDescription,
            'icon': "assets/img/svg/Hall.svg",
          }
          let parkingObj = {
            'title': 'Parking',
            'details': element.parkingdetails,
            'icon': "assets/img/svg/parking.svg",
          }
          let acObj = {
            'title': 'A/C',
            'details': element.acdetails,
            'icon': "assets/img/svg/AC.svg",
          }
          //if (element.acdetails != '' && element.acdetails != undefined) {
          element['facilities'].push(acObj);
          // }
          //if (element.parkingdetails != '' && element.parkingdetails != undefined) {
          element['facilities'].push(parkingObj);
          //}
          //if (element.capacityDescription != '' && element.capacityDescription != undefined) {
          element['facilities'].push(hallObj);
          //}
        });
        this.totalRecords = data.data.totalCount;
        //}
      },
      err => {
        this.errorMessage = err.error.message;
      }
    );
  }
  getVenueDetails(id) {
    this.router.navigateByUrl('/venue/' + id);
  }
}
