import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../demo/service/productservice';
import { Product } from '../../demo/domain/product';
import { MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
import { SelectItem } from 'primeng/api';
import { SelectItemGroup } from 'primeng/api';
import { CategoryService } from 'src/app/services/category.service';
import { CountryService } from "../../demo/service/countryservice";

interface City {
    name: string,
    code: string
}
@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.css'],
    providers: [MessageService, CountryService]
})
export class NavigationComponent implements OnInit {
    selectedCountries: any[];
    filteredCountries: any[];

    public cities: City[];
    public selectedCity1: City;
    public selectedCity2: City;
    public selectedCity3: string;
    public selectedCountry: string;
    public countries: any[];
    public groupedCities: SelectItemGroup[];
    public items: SelectItem[];
    public item: string;
    public date12: Date;
    public date13: Date;
    public rangeDates: Date[];
    public es: any;
    public invalidDates: Array<Date>
    public products: Product[];
    public menuFilter: Product[];
    public selectedProduct: Product;
    public categoryMenuList: any[] = [];
    public parentCategoryId;
    public errorMessage;
    public parentCategoryDetails;
    public filterCapacityArray: any[] = [];
    public venueCapacity;
    public selectedVenueCapacity;
    public selectedGuestName;
    carouselResponsiveOptions: any[] = [
        {
            breakpoint: '1024px',
            numVisible: 8,
            numScroll: 8
        },
        {
            breakpoint: '768px',
            numVisible: 6,
            numScroll: 6
        },
        {
            breakpoint: '600px',
            numVisible: 4,
            numScroll: 4
        }
    ];
    // public navigation = data;
    constructor(private productService: ProductService, private categoryService: CategoryService, private countryService: CountryService) { }
    ngOnInit() {
        this.countryService.getCountries().then(countries => {
            this.countries = countries;
        });
        this.items = [];
        for (let i = 0; i < 10000; i++) {
            this.items.push({ label: 'Item ' + i, value: 'Item ' + i });
        }
        this.cities = [
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
        this.groupedCities = [
            {
                label: 'India', value: 'ing',
                items: [
                    { label: 'Mumbai', value: 'Mumbai' },
                    { label: 'Delhi', value: 'Delhi' },
                    { label: 'Bangalore', value: 'Bangalore' },
                    { label: 'Hyderabad', value: 'Hyderabad' }
                ]
            }
        ];
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
        this.productService.navigationMenu().then(menu => {
            this.menuFilter = menu;
        });
        this.productService.getProductsSmall().then(products => this.products = products);

        //this.getCategoryBySlug();
    }
    filterCountry(event) {
        //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
        let filtered: any[] = [];
        let query = event.query;
        for (let i = 0; i < this.cities.length; i++) {
            let country = this.cities[i];
            if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(country);
            }
        }
        this.filteredCountries = filtered;
    }
    onCapacitySelect(event) {

        if (event != undefined) {
            if (event.value.value > this.venueCapacity) {

            }
            this.selectedVenueCapacity = event.value.value;
            this.selectedGuestName = event.value.label;
        }


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
                console.log('this.categoryMenuList', this.categoryMenuList);
                //}
            },
            err => {
                this.errorMessage = err.error.message;
            }
        );
    }
    toggleCanvas() {
    }
    toggleSearch() {
    }
}
