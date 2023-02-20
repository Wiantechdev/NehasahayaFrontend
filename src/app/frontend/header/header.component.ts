
import { ProductService } from '../../demo/service/productservice';
import { Product } from '../../demo/domain/product';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
// import { OwlOptions } from 'ngx-owl-carousel-o';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomValidators } from 'ng2-validation';
import { AuthService } from 'src/app/services/auth.service';
import { MustMatch } from 'src/app/_helpers/must-match.validator';
import { TokenStorageService } from '../../services/token-storage.service';
import { RoleService } from 'src/app/services/role.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { maxYearFunction } from 'src/app/_helpers/utility';
import * as moment from 'moment';
@Component({
  selector: 'page-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [ConfirmationService, MessageService, HeaderComponent],
})
export class HeaderComponent implements OnInit {
  products: Product[];

  loginRegisterModal: boolean;

  selectedProduct: Product;
  carouselResponsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 12,
      numScroll: 12
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
  signUpForm: FormGroup;
  loginForm: FormGroup;
  submitted: boolean = false;
  loginFormSubmitted: boolean = false;
  genders;
  message;
  showMessage: boolean = false;
  selectedGender: any = null;
  userType;
  userData;
  isLoginFailed: boolean;
  isLoggedIn: boolean;
  roles;
  trainerRoleId;
  permissions: any[] = [];
  permissionArray: any[] = [];
  userTypeListArray: any[] = [];
  rolelist: any[] = [];
  errorMessage;;
  ipAddress;
  yearRange;
  minDateValue: Date;
  minYear = environment.minYear;
  showGenderError;
  public loggedInUser;
  public userId;
  public menus: any[] = [];
  public showMenus;
  public areas;
  public selectedArea;
  public activeIndex: number = 0;
  public birthYearRange;
  public birthYearDefaultDate;
  public birthMinValue: Date = new Date(environment.defaultDate);
  public birthMaxValue: Date = new Date(maxYearFunction());
  constructor(
    private productService: ProductService,
    private router: Router,
    private formBuilder: FormBuilder,
    private roleService: RoleService,
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private tokenStorage: TokenStorageService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }
  ngOnInit() {
    this.productService.getVenue().then(products => {
      this.products = products;
    });
    this.loggedInUser = this.tokenStorage.getUser();
    if (this.loggedInUser.userdata != undefined) {
      this.isLoggedIn = true;
      this.userId = this.loggedInUser.userdata.id;
    }
    if (this.isLoggedIn == true) {
      this.loginRegisterModal = false;
    }
    this.minDateValue = new Date();
    this.yearRange = this.minYear + ":" + maxYearFunction();
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
    this.genders = [
      { id: '1', name: 'Male', code: 'Male' },
      { id: '2', name: 'Female', code: 'Female' },
      { id: '3', name: 'Other', code: 'Other' },
    ];
    this.selectedGender = this.genders[0];

    this.areas = [
      { name: 'Andheri', code: 'AN' },
      { name: 'Mahalaxmi', code: 'MH' },
      { name: 'Charni Rd', code: 'CR' },
      { name: 'Churchgate', code: 'CT' },
      { name: 'Dadar', code: 'CT' },
      { name: 'Bandra', code: 'BD' },
      { name: 'Borivali', code: 'BV' },
      { name: 'Dahisar', code: 'Di' },
      { name: 'Goregaon', code: 'GG' },
      { name: 'Grant Rd', code: 'GR' },
      { name: 'Jogeshwari', code: 'JS' },
      { name: 'Juhu', code: 'JH' },
      { name: 'Kandivali', code: 'KN' },
      { name: 'Mahim Jn', code: 'MJ' },
      { name: 'Mankhurd', code: 'MK' },
      { name: 'Matunga', code: 'MT' },
      { name: 'Matunga Road', code: 'MTR' },

    ];
    this.birthYearRange = this.minYear + ":" + maxYearFunction();
    this.birthMaxValue = new Date(moment(this.birthMaxValue.setFullYear(this.birthMaxValue.getFullYear() + 1)).format('YYYY-MM-DD'));
    this.birthYearDefaultDate = new Date(moment(this.birthMaxValue).subtract(1, "d").format('YYYY-MM-DD'));
    this.selectedArea = this.areas[0].name;
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.signUpForm.controls;
  }
  get loginf() {
    return this.loginForm.controls;
  }
  onGenderSelect(gender, event) {
    this.selectedGender = '';
    if (event.isTrusted) {
      this.selectedGender = gender;
    }
  }
  onAreaChange(event) {
    if (event.value != null) {
      this.selectedArea = event.value.name;
    }
  }
  getRoleDetails() {
    const querystring = "filterByroleId=" + this.userData.data.userdata.role;
    this.roleService.searchRoleDetails(querystring).subscribe(
      data => {
        this.trainerRoleId = data.data.items[0]['id'];
        this.permissions = data.data.items[0]['permissions'];
        this.tokenStorage.saveUserPermissions(this.permissions);
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
          this.tokenStorage.saveRolelist(rolearray);
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
    this.authService.login(username, password, this.userType).subscribe(
      data => {
        this.userData = data;
        this.tokenStorage.saveToken(this.userData.data.access_token);
        this.tokenStorage.saveUser(this.userData.data);
        this.tokenStorage.getAuthStatus(this.userData.data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.getRoleDetails();
        this.getRoleList();
        let currentUrl = '/';
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([currentUrl]);
        this.loginRegisterModal = false;
      },
      ((err) => {
        this.errorMessage = 'Please check your login credentials...! ';
        this.isLoginFailed = true;
        this.messageService.add({ key: 'usertoastmsg', severity: 'error', summary: this.errorMessage, detail: 'Login Failed', life: 6000 });
      })
    );
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
    this.tokenStorage.isLoggedOut();
    let currentUrl = '/';
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
    return false;
  }
  toggleCanvas() {

  }
  toggleSearch() {

  }
  showMenu() {
    this.showMenus = true;
  }
  myProfile() {
    this.router.navigateByUrl("/my-profile");
  }
}
