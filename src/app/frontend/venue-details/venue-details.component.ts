import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import data from '../../../assets/demo/data/navigation.json';
import { ProductService } from '../../demo/service/productservice';
import { Product } from '../../demo/domain/product';
import listingblock from '../../../assets/demo/data/listing.json';
import { BannerService } from 'src/app/services/banner.service';
import { VenueService } from 'src/app/manage/venue/service/venue.service';
import { environment } from 'src/environments/environment';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { CategoryService } from 'src/app/services/category.service';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
import { PostAvailabilityService } from 'src/app/services/postAvailability.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { VenueOrderService } from 'src/app/services/venueOrder.service';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MustMatch } from 'src/app/_helpers/must-match.validator';
import { RoleService } from 'src/app/services/role.service';
import { AuthService } from 'src/app/services/auth.service';
import { maxYearFunction } from 'src/app/_helpers/utility';
@Component({
  selector: 'app-venue-details',
  templateUrl: './venue-details.component.html',
  styleUrls: ['./venue-details.component.scss'],
  providers: [BannerService, ConfirmationService, MessageService],
  styles: [`
     .bg-light  app-root app-frontend #front page-header .sigma_header .sigma_header-bottom .sigma_header-bottom-inner app-navigation .navigation-search-bar{
          display:none !important;
        }
    `],
})
export class VenueDetailsComponent implements OnInit {
  classToggled = false;
  availableClasses: string[] = ["light", "normal-header"];
  currentClassIdx: number = 0;
  bodyClass: string;
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
      numVisible: 1
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
  public venueImageNumVisible: number = 8;
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
  public id;
  public venueDetails;
  private lazyLoadEvent: LazyLoadEvent;
  public facilitiesArray: any[] = [];
  public cityName;
  public googleMapSource;
  public categoryList;
  public occasionArray: any[] = [];
  public yearRange = environment.yearRange;
  public minDateValue;
  public maxDateValue;
  public maxYear;
  public currentYear;
  public yearDiff;
  public selectedOccasion: any[] = [];
  public selectedOccasionNames: any[] = [];
  public postArr: any[] = [];
  public selectedDate;
  public availabilityList;
  public selectedSlots: any = [];
  public filterCapacityArray: any[] = [];
  public venueCapacity;
  public foodTypesList: any[] = [];
  public vendorList: any[] = [];
  public selectedVendor: any[] = [];
  public selectedVendorNames: any[] = [];
  public decorArray: any[] = [];
  public featureArray: any[] = [];
  public foodMenuTypesList: any[] = [];
  public selectedFoodTypeId;
  public selectedDecor;
  public totalVenuePrice;
  public selectedFeature;
  public showSendEnquiries: boolean = true;
  public selectedVenueCapacity;
  public userId;
  public loggedInUser;
  public isLoggedIn: boolean = false;
  public loginRegisterModal: boolean = false;
  public signUpForm: FormGroup;
  public loginForm: FormGroup;
  public submitted: boolean = false;
  public loginFormSubmitted: boolean = false;
  public venuePrice;
  public selectedSlotsName;
  public selectedGuestName;
  public selectedFoodTypeName;
  public selectedFoodTypeSlug;
  public foodMenuTypeArray: any[] = [];
  public foodMenuTypes: any[] = [];
  public showFoodMenuTypesList: boolean = false;
  public selectedFoodMenuTypes: any[] = [];
  public birthYearRange;
  public birthYearDefaultDate;
  public birthMinValue: Date = new Date(environment.defaultDate);
  public birthMaxValue: Date = new Date(maxYearFunction());
  public showDecorImages: boolean = false;
  public decorImages: any[] = [];
  public url;
  public orderType = 'scheduledmeeting';
  genders;
  message;
  showMessage: boolean = false;
  selectedGender: any = null;
  userType;
  userData;
  isLoginFailed: boolean;
  roles;
  trainerRoleId;
  permissions: any[] = [];
  permissionArray: any[] = [];
  userTypeListArray: any[] = [];
  rolelist: any[] = [];
  ipAddress;
  minYear = environment.minYear;
  showGenderError;
  displayModal: boolean;
  public defaultDate;
  public activeIndex: number = 0;
  staticPath;
  totalPeopleBooked = Math.floor(Math.random() * 1000);
  currentViews = Math.floor(Math.random() * 100);
  public multipleDaySelected: boolean = false;
  @ViewChild('paginator', { static: true }) paginator: Paginator
  constructor(
    private productService: ProductService,
    private BannerService: BannerService,
    private venueService: VenueService,
    private activeroute: ActivatedRoute,
    private categoryService: CategoryService,
    private sanitizer: DomSanitizer,
    private postAvailabilityService: PostAvailabilityService,
    private tokenStorageService: TokenStorageService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private venueOrderService: VenueOrderService,
    private router: Router,
    private formBuilder: FormBuilder,
    private roleService: RoleService,
    private authService: AuthService,
    private el: ElementRef,
  ) {
    this.bodyClass = this.availableClasses[this.currentClassIdx];
    this.changeBodyClass();
  }
  ngOnInit() {
    this.id = this.activeroute.snapshot.params.id;
    this.staticPath = environment.productUploadUrl;
    this.loggedInUser = this.tokenStorageService.getUser();
    if (this.loggedInUser.userdata != undefined) {
      this.isLoggedIn = true;
      this.userId = this.loggedInUser.userdata.id;
    }
    if (this.isLoggedIn == true) {
      this.loginRegisterModal = false;
    }
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, CustomValidators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.signUpForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern("([a-zA-Z',.-]+( [a-zA-Z',.-]+)*){2,30}")]],
      //lastName: ['', [Validators.required, Validators.pattern('[A-Za-z][A-Za-z]*$')]],
      email: ['', [Validators.required, Validators.email, CustomValidators.email]],
      password: ['', [Validators.required, Validators.pattern("^(?=[^A-Z\n]*[A-Z])(?=[^a-z\n]*[a-z])(?=[^0-9\n]*[0-9])(?=[^#?!@$%^&*\n-]*[#?!@$%^&*-]).{6,}$")]],
      confirmPassword: ['', Validators.required],
      //gender: ['', Validators.required],
      dob: ['',],
      mobileNumber: ['', [Validators.required, Validators.pattern("[0-9 ]{10}")]],
      role: ['user'],
      userType: ['user']
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
    this.defaultDate = new Date();
    let today = new Date();
    this.defaultDate.setDate(today.getDate() + environment.defaultDays);
    this.selectedDate = this.defaultDate;
    this.onClickEventDate(this.selectedDate);
    this.productService.getVenue().then(products => {
      this.products = products;
    });
    this.featureArray = [
      {
        'id': 1, 'label': "Check Availability", selected: true, status: true
      },
      {
        'id': 2, 'label': "Book Visit (Before Booking The Venue)", selected: false, status: false
      },
      {
        'id': 3, 'label': "Book Now", selected: false, status: false
      },
    ];
    this.selectedFeature = this.featureArray[0];
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
    ];
    this.genders = [
      { id: '1', name: 'Male', code: 'Male' },
      { id: '2', name: 'Female', code: 'Female' },
      { id: '3', name: 'Other', code: 'Other' },
    ];
    this.currentYear = new Date();
    this.currentYear = this.currentYear.getFullYear();
    this.yearDiff = environment.yearDiff;
    this.maxYear = moment({ year: this.currentYear + this.yearDiff }).format('YYYY');
    this.yearRange = this.currentYear + ":" + this.maxYear;
    this.birthYearRange = this.minYear + ":" + maxYearFunction();
    this.birthMaxValue = new Date(moment(this.birthMaxValue.setFullYear(this.birthMaxValue.getFullYear() + 1)).format('YYYY-MM-DD'));
    this.birthYearDefaultDate = new Date(moment(this.birthMaxValue).subtract(1, "d").format('YYYY-MM-DD'));
    this.maxDateValue = new Date();
    this.minDateValue = new Date();
    this.maxDateValue.setFullYear(this.maxYear);
    this.getVenueDetails();
  }
  public toggleField() {
    this.classToggled = !this.classToggled;
  }
  changeBodyClass() {
    // get html body element
    const bodyElement = document.body;
    if (bodyElement) {
      this.currentClassIdx = this.getNextClassIdx();
      const nextClass = this.availableClasses[this.currentClassIdx];
      const activeClass = this.availableClasses[this.getPrevClassIdx()];
      // remove existing class (needed if theme is being changed)
      bodyElement.classList.remove(activeClass);
      // add next theme class
      bodyElement.classList.add(nextClass);
      this.bodyClass = nextClass;
    }
  }
  getPrevClassIdx(): number {
    return this.currentClassIdx === 0
      ? this.availableClasses.length - 1
      : this.currentClassIdx - 1;
  }
  getNextClassIdx(): number {
    return this.currentClassIdx === this.availableClasses.length - 1
      ? 0
      : this.currentClassIdx + 1;
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.signUpForm.controls;
  }
  get loginf() {
    return this.loginForm.controls;
  }
  schedulevisit() {
    this.displayModal = true;
  }

  getVenueDetails() {
    this.venueService.getVenueDetails(this.id).subscribe(
      data => {
        this.venueDetails = data;
        this.cityName = this.venueDetails.cityname.toLowerCase();
        var googleMapSource = "https://maps.google.com/maps?width=600&amp;height=400&amp;hl=en&amp;q=" + this.cityName + "&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed";
        // window.location.replace(this.googleMapSource);
        //this.googleMapSource.toString();
        this.googleMapSource = this.sanitizer.bypassSecurityTrustResourceUrl(googleMapSource);
        this.googleMapSource = this.googleMapSource.changingThisBreaksApplicationSecurity;
        console.log(this.googleMapSource);
        console.log(typeof this.googleMapSource);
        // this.url = this.googleMapSource.changingThisBreaksApplicationSecurity;
        let hallObj = {
          'title': "Hall",
          'details': this.venueDetails.capacityDescription,
          'icon': "assets/img/svg/Hall.svg",
        }
        let parkingObj = {
          'title': 'Parking',
          'details': this.venueDetails.parkingdetails,
          'icon': "assets/img/svg/parking.svg",
        }
        let acObj = {
          'title': 'A/C',
          'details': this.venueDetails.acdetails,
          'icon': "assets/img/svg/AC.svg",
        }
        this.venueImageNumVisible = Number(this.venueDetails.venueImage.length);
        if (this.venueImageNumVisible < 8) {
          let hideThumbnailClass = this.el.nativeElement.querySelector('.section-venuelisting-details');
          //showp2Table.classList.remove('hide-columns');
        }
        if (this.venueImageNumVisible > 8) {
          this.venueImageNumVisible = Number(2);
        }
        if (this.venueDetails.acdetails != '' && this.venueDetails.acdetails != undefined) {
          this.facilitiesArray.push(acObj);
        }
        if (this.venueDetails.parkingdetails != '' && this.venueDetails.parkingdetails != undefined) {
          this.facilitiesArray.push(parkingObj);
        }
        if (this.venueDetails.capacityDescription != '' && this.venueDetails.capacityDescription != undefined) {
          this.facilitiesArray.push(hallObj);
        }
        if (this.venueDetails.decor1Price != undefined || this.venueDetails.decor1Price != '') {
          let decor1img = "";
          if (this.venueDetails.decor1Image.length > 0) {
            if (this.venueDetails.decor2Image[0].venue_image_src) {
              decor1img = this.venueDetails.decor1Image[0].venue_image_src;
              this.decorArray.push({ name: "Decor 1", price: this.venueDetails.decor1Price, image: decor1img, selected: false, decorImages: this.venueDetails.decor1Image });
            }

          }

        }
        if (this.venueDetails.decor2Price != undefined || this.venueDetails.decor2Price != '') {
          let decor2img = "";
          if (this.venueDetails.decor2Image.length > 0) {
            if (this.venueDetails.decor2Image[0].venue_image_src) {
              decor2img = this.venueDetails.decor2Image[0].venue_image_src;
              this.decorArray.push({ name: "Decor 2", price: this.venueDetails.decor2Price, image: decor2img, selected: false, decorImages: this.venueDetails.decor2Image });
            }

          }

        }
        if (this.venueDetails.decor3Price != undefined || this.venueDetails.decor3Price != '') {
          let decor3img = "";
          if (this.venueDetails.decor3Image.length > 0) {
            if (this.venueDetails.decor2Image[0].venue_image_src) {
              decor3img = this.venueDetails.decor3Image[0].venue_image_src;
              this.decorArray.push({ name: "Decor 3", price: this.venueDetails.decor3Price, image: decor3img, selected: false, decorImages: this.venueDetails.decor3Image });
            }

          }

        }
        this.venueCapacity = this.venueDetails.capacity;
        this.venuePrice = this.venueDetails.venuePrice;
        this.totalVenuePrice = this.venuePrice;
        this.foodMenuTypeArray = this.venueDetails.foodMenuType;
        this.getCategoryDetails();
      },
      err => {
        this.errorMessage = err.error.message;
      }
    );
  }

  methodToGetURL() {
    var googleMapSource = "https://maps.google.com/maps?width=600&amp;height=400&amp;hl=en&amp;q=" + this.cityName + "&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed";
    return this.sanitizer.bypassSecurityTrustResourceUrl(googleMapSource);
  }
  getCategoryDetails() {
    let query = "?filterByDisable=false&filterByStatus=true&sortBy=created_at&orderBy=1";
    this.categoryService.getCategoryWithoutAuthList(query).subscribe(
      data => {
        //if (data.data.items.length > 0) {
        this.categoryList = data.data.items;
        let count = 0;
        let obj = this.categoryList.find(o => o.slug === "vendor");
        let categoryList = this.venueDetails.category;
        let foodTypesList = this.venueDetails.foodType;
        let foodMenuTypesList = this.venueDetails.foodType;
        this.categoryList.forEach(element => {
          element['selected'] = false;
          categoryList.forEach(category => {
            element['selected'] = false;
            if (element.id == category.id) {
              this.occasionArray.push(element);
            }
          });
          foodTypesList.forEach(foodType => {
            element['selected'] = false;
            if (element.id == foodType.id) {
              this.foodTypesList.push(element);
            }
          });
          if (obj.id == element.parentcategorycode) {
            this.vendorList.push(element);
          }
        });
      },
      err => {
        this.errorMessage = err.error.message;
      }
    );
  }
  // getFoodMenuTypes(selectedFoodTypeId) {
  //   let query = "?filterByDisable=false&filterByStatus=true&filterByParent=" + selectedFoodTypeId + "&sortBy=created_at&orderBy=1";
  //   this.categoryService.getCategoryWithoutAuthList(query).subscribe(
  //     data => {
  //       //if (data.data.items.length > 0) {
  //       this.foodMenuTypesList = data.data.items;
  //       let count = 0;
  //       this.foodMenuTypesList.forEach(element => {
  //         element['selected'] = false;
  //         count++;
  //       });
  //     },
  //     err => {
  //       this.errorMessage = err.error.message;
  //     }
  //   );
  // }
  onFoodTypeClick(foodType) {
    this.selectedFoodTypeId = foodType.id;
    this.selectedFoodTypeName = foodType.name;
    this.selectedFoodTypeSlug = foodType.slug;
    let foodMenuTypeArray = this.foodMenuTypeArray[foodType.slug];
    this.foodMenuTypes = [];
    this.selectedFoodMenuTypes = [];
    foodMenuTypeArray.forEach(element => {
      if (element.value != '0') {
        element['selected'] = false;
        this.foodMenuTypes.push(element);
      }
    });
    this.showFoodMenuTypesList = true;
    //this.getFoodMenuTypes(this.selectedFoodTypeId);
  }
  onFoodMenuTypeClick(foodMenuType) {
    if (foodMenuType.selected == true) {
      let index = this.findIndexBySlug(foodMenuType.slug, this.foodMenuTypes);
      if (index != -1) {
        this.foodMenuTypes[index].selected = false;
        let selectedIndex = this.findSelectedIndexBySlug(foodMenuType.slug, this.selectedFoodMenuTypes);
        //let selectedNameIndex = this.findIndexById(foodMenuType.id, this.selectedVendorNames);
        this.selectedFoodMenuTypes.splice(selectedIndex, 1);
        //this.selectedFoodMenuTypesNames.splice(selectedNameIndex, 1);
      }
    } else {
      let index = this.findIndexBySlug(foodMenuType.slug, this.foodMenuTypes);
      if (index != -1) {
        this.foodMenuTypes[index].selected = true;
        this.selectedFoodMenuTypes.push(foodMenuType.slug);
        //this.selectedVendorNames.push({ 'id': foodMenuType.id, 'name': foodMenuType.name });
      }
    }
  }
  findIndexBySlug(slug, arrayName) {
    let index = -1;
    for (let i = 0; i < arrayName.length; i++) {
      if (arrayName[i].slug === slug) {
        index = i;
        break;
      }
    }
    return index;
  }
  findSelectedIndexBySlug(slug, arrayName) {
    let index = -1;
    for (let i = 0; i < arrayName.length; i++) {
      if (arrayName[i] === slug) {
        index = i;
        break;
      }
    }
    return index;
  }
  onClickDecor(decor) {
    this.decorArray.forEach(element => {
      if (element.name == decor.name) {
        element['selected'] = true;
      } else {
        element['selected'] = false;
      }
    });
    this.showDecorImages = true;
    this.decorImages = decor.decorImages;
    this.selectedDecor = decor.price;
    if (decor.price != '' || decor.price != undefined) {
      this.totalVenuePrice = Number(this.venuePrice) + Number(decor.price);
    }
  }
  onFeatureClick(feature) {
    if (feature.id == '1') {
      this.showSendEnquiries = true;
    } else {
      this.showSendEnquiries = false;
    }
    // this.featureArray.forEach(element => {
    //   let index = this.findIndexById(feature.id, this.featureArray);
    //   console.log(index);
    //   if (index == -1) {
    //     if (element.id == feature.id) {
    //       this.featureArray[index].selected = true;
    //       this.featureArray[index].status = false;
    //     } else {
    //       this.featureArray[index].selected = false;
    //       this.featureArray[index].status = true;
    //     }
    //   }
    // });
  }
  onClickVendor(vendor) {
    if (vendor.selected == true) {
      let index = this.findIndexById(vendor.id, this.vendorList);
      if (index != -1) {
        this.vendorList[index].selected = false;
        let selectedIndex = this.findSelectedIndexById(vendor.id, this.selectedVendor);
        let selectedNameIndex = this.findIndexById(vendor.id, this.selectedVendorNames);
        this.selectedVendor.splice(selectedIndex, 1);
        this.selectedVendorNames.splice(selectedNameIndex, 1);
      }
    } else {
      let index = this.findIndexById(vendor.id, this.vendorList);
      if (index != -1) {
        this.vendorList[index].selected = true;
        this.selectedVendor.push(vendor.id);
        this.selectedVendorNames.push({ 'id': vendor.id, 'name': vendor.name });
      }
    }
  }
  onClickOccasion(occasion) {
    // if (occasion.selected == true) {
    //   let index = this.findIndexById(occasion.id, this.occasionArray);
    //   if (index != -1) {
    //     //this.occasionArray[index].selected = false;
    //     let selectedIndex = this.findSelectedIndexById(occasion.id, this.selectedOccasion);
    //     let selectedNameIndex = this.findIndexById(occasion.id, this.selectedOccasionNames);
    //     this.selectedOccasion.splice(selectedIndex, 1);
    //     this.selectedOccasionNames.splice(selectedNameIndex, 1);
    //   }
    // } else {
    let index = this.findIndexById(occasion.id, this.occasionArray);
    if (index != -1) {
      // this.occasionArray[index].selected = true;
      this.occasionArray.forEach(element => {
        if (element.id == occasion.id) {
          element.selected = true;
        } else {
          element.selected = false;
        }
      })
      //this.selectedOccasion.push(occasion.id);
      this.selectedOccasion = occasion.id;
      //this.selectedOccasionNames.push({ 'id': occasion.id, 'name': occasion.name });
      this.selectedOccasionNames = [{ 'id': occasion.id, 'name': occasion.name }];
    }
    // }
  }
  onSlotClick(slot) {
    this.availabilityList.forEach(element => {
      element[1].forEach(item => {
        if (item.id == slot.id) {
          if (item.selected == true) {
            item.selected = false;
            let index = this.findPostAvailabilityIndexById(slot.id, this.selectedSlots);
            this.selectedSlots.splice(index, 1);
          } else if (item.selected == false) {
            item['selected'] = true;
            if (this.multipleDaySelected == false) {
              //this.selectedSlots.push({ 'postavailabilityId': slot.id, 'occasionDate': moment(slot.slotdate).local().format('MM-DD-YYYY'), slotId: slot.slotId });
              this.selectedSlots = [{ 'postavailabilityId': slot.id, 'occasionDate': moment(slot.slotdate).local().format('MM-DD-YYYY'), 'slotId': slot.slotId }];
            }
            if (this.multipleDaySelected == true) {
              // if (this.rangeDates != undefined) {
              //   this.selectedSlots.push({
              //     'postavailabilityId': slot.id, 'occasionDate': moment(slot.slotdate).local().format('MM-DD-YYYY')
              //   });
              // }
            }
          }
        }
      });
    });
    console.log(this.selectedSlots);
  }
  findPostAvailabilityIndexById(id, arrayName) {
    let index = -1;
    for (let i = 0; i < arrayName.length; i++) {
      if (arrayName[i].postavailabilityId === id) {
        index = i;
        break;
      }
    }
    return index;
  }
  onCapacitySelect(event) {
    if (event != undefined) {
      if (event.value.value > this.venueCapacity) {
      }
      this.selectedVenueCapacity = event.value.value;
      this.selectedGuestName = event.value.label;
    }
  }
  onClickEventDate(event) {
    this.selectedDate = moment(event).local().format('DD-MM-YYYY');
    let searchDate = moment(event).subtract(1, "d").format('MM-DD-YYYY');
    let query = "filterByDisable=false&filterByStatus=true&filterByVenueId=" + this.id + "&filterByDate=" + searchDate;
    this.postAvailabilityService.getPostAvailabilityListWithoutAuth(query).subscribe(
      data => {
        this.availabilityList = [];
        let availabilityList = data.data.items;
        this.availabilityList =
          availabilityList.reduce((result, currentValue) => {
            (result[currentValue.slotdate] = result[currentValue.slotdate] || []).push(
              currentValue
            );
            return result;
          }, {});
        this.availabilityList = Object.entries(this.availabilityList);
        this.availabilityList.forEach(element => {
          if (element[0]) {
            element[0] = moment(element[0]).local().format('DD-MM-YYYY');
          }
          if (element[1].length > 0) {
            element[1].forEach(item => {
              item['selected'] = false;
            });
          }
        });
      },
      err => {
        this.errorMessage = err.error.message;
      }
    );
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
  onClickSendEnquiries() {
    if (this.isLoggedIn == false) {
      this.loginRegisterModal = true;
      return;
    }
    if (this.selectedOccasion.length == 0) {
      this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'error', detail: 'Please select occasion.', life: 6000 });
      return;
    }
    if (this.selectedDate == undefined) {
      this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'error', detail: 'Please select Event Date.', life: 6000 });
      return;
    }
    if (this.selectedSlots.length == 0) {
      this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'error', detail: 'Please select Slot.', life: 6000 });
      return;
    }
    if (this.selectedVenueCapacity == undefined) {
      this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'error', detail: 'Please select Guest Capacity.', life: 6000 });
      return;
    }
    if (this.selectedFoodTypeSlug == undefined) {
      this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'error', detail: 'Please select Food Type.', life: 6000 });
      return;
    }
    if (this.selectedFoodMenuTypes == undefined || this.selectedFoodMenuTypes.length == 0) {
      this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'error', detail: 'Please select Food Menu Type.', life: 6000 });
      return;
    }
    // if (this.selectedDecor == undefined) {
    //   this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'error', detail: 'Please select Decor.', life: 6000 });
    //   return;
    // }
    // if (this.selectedVendor.length == 0) {
    //   this.messageService.add({ key: 'toastMsg', severity: 'error', summary: 'error', detail: 'Please select Vendor.', life: 6000 });
    //   return;
    // }
    let venueOrderData = {
      categoryId: this.selectedOccasion,
      occasionDate: this.selectedDate,
      durationData: this.selectedSlots,
      guestcnt: this.selectedVenueCapacity,
      decor: this.selectedDecor,
      foodType: [this.selectedFoodTypeSlug],
      vendors: this.selectedVendor,
      customerId: this.userId,
      venueId: this.id,
      price: this.totalVenuePrice,
      foodMenuType: this.selectedFoodMenuTypes,
      orderType: this.orderType,
    };
    this.venueOrderService.addVenueOrder(venueOrderData).subscribe(
      data => {
        this.messageService.add({ key: 'toastMsg', severity: 'success', summary: 'Successful', detail: 'Enquires send to Eazy venue.', life: 6000 });
        setTimeout(() => {
          //let currentUrl = '/venue/' + this.id;
          let currentUrl = '/my-profile';
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate([currentUrl]);
        }, 2000);
      },
      ((err) => {
        this.messageService.add({ key: 'toastMsg', severity: 'error', summary: err.error.message, detail: 'Send Enquires to Eazy venue failed', life: 6000 });
      })
    );
  }
  onGenderSelect(gender, event) {
    this.selectedGender = '';
    if (event.isTrusted) {
      this.selectedGender = gender;
    }
  }
  getRoleDetails() {
    const querystring = "filterByroleId=" + this.userData.data.userdata.role;
    this.roleService.searchRoleDetails(querystring).subscribe(
      data => {
        this.trainerRoleId = data.data.items[0]['id'];
        this.permissions = data.data.items[0]['permissions'];
        this.tokenStorageService.saveUserPermissions(this.permissions);
        this.rolelist = data.data.items[0];
      },
      err => {
        this.errorMessage = err.error.message;
      }
    );
  }
  findIndexByIdArray(name, arrayName) {
    let index = -1;
    for (let i = 0; i < arrayName.length; i++) {
      if (arrayName[i].rolename === name) {
        index = i;
        break;
      }
    }
    return index;
  }
  getRoleList() {
    var querystring = "filterByDisable=false&filterByStatus=true";
    var rolearray = [];
    this.roleService.getRoleList(querystring).subscribe(
      data => {
        var rolelist = data.data.items;
        rolelist.forEach(element => {
          rolearray.push({ "roleid": element.id, "rolename": element.user_role_name });
        });
        if (rolearray.length > 0) {
          this.tokenStorageService.saveRolelist(rolearray);
        }
      },
      err => {
        this.errorMessage = err.error.message;
      }
    );
  }
  onSubmit(): void {
    this.loginFormSubmitted = true;
    //stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    const username = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    this.userType = 'user';
    //this.http.get("http://api.ipify.org/?format=json").subscribe((res: any) => {
    //this.ipAddress = res.ip;
    this.authService.login(username, password, this.userType).subscribe(
      data => {
        this.userData = data;
        this.tokenStorageService.saveToken(this.userData.data.access_token);
        this.tokenStorageService.saveUser(this.userData.data);
        this.tokenStorageService.getAuthStatus(this.userData.data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorageService.getUser().roles;
        this.getRoleDetails();
        this.getRoleList();
        let currentUrl = '/venue/' + this.id;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([currentUrl]);
        this.loginRegisterModal = false;
      },
      err => {
        this.errorMessage = 'Login failed: Please check your login credentials...! ';
        this.isLoginFailed = true;
      }
    );
    //});
  }
  onSignupSubmit(): void {
    this.submitted = true;
    //stop here if form is invalid
    if (this.signUpForm.invalid) {
      return;
    }
    let userData = this.signUpForm.value;
    // if (this.selectedGender == null) {
    //   this.showGenderError = true;
    //   return;
    // }
    userData['gender'] = '';
    userData['role'] = 'user';
    userData['name'] = userData['name'].split(" ", 2);
    let firstName = userData['name'][0];
    let lastName = userData['name'][1];
    userData['firstName'] = firstName;
    userData['lastName'] = lastName;
    this.authService.signUp(userData).subscribe(
      data => {
        this.messageService.add({ key: 'toastmsg', severity: 'success', summary: 'Successful', detail: 'User Added', life: 3000 });
        this.signUpForm.reset();
        this.submitted = false;
        this.loginRegisterModal = false;
        setTimeout(() => {
          this.loginRegisterModal = true;
          this.activeIndex = Number(0);
        }, 2000);
      },
      ((err) => {
        this.showMessage = true;
        this.message = err.error.error;
        this.messageService.add({ key: 'usertoastmsg', severity: 'error', summary: err.error.error, detail: 'Add User Failed', life: 6000 });
      })
    );
  }
  showLoginRegisterDialog() {
    if (this.isLoggedIn == true) {
      this.loginRegisterModal = false;
    } else {
      this.loginRegisterModal = true;
    }
  }
  signOut() {
    window.sessionStorage.clear();
    this.tokenStorageService.isLoggedOut();
    let currentUrl = '/';
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
    return false;
  }
}