import { Component, OnInit, ViewChild } from '@angular/core';
import { Customer, Representative } from '../../../demo/domain/customer';
import { CustomerService } from '../../../demo/service/customerservice';
import { Table } from 'primeng/table';
import { PrimeNGConfig } from 'primeng/api';
import { VenueOrderService } from 'src/app/services/venueOrder.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { Router } from '@angular/router';
@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
    customers: Customer[];
    public profileDetails;

    selectedCustomers: Customer[];
    selectedvenueOrders;
    representatives: Representative[];

    statuses: any[];

    loading: boolean = true;
    public venueOrderList: any[] = [];
    public totalRecords;
    public venueName;
    public errorMessage;
    public userId;
    public loggedInUser;
    public isLoggedIn: boolean = false;
    @ViewChild('dt') table: Table;

    constructor(private customerService: CustomerService,
        private primengConfig: PrimeNGConfig,
        private venueOrderService: VenueOrderService,
        private tokenStorageService: TokenStorageService,
        private router: Router,
    ) { }

    ngOnInit() {
        this.customerService.getCustomersLarge().then(customers => {
            this.customers = customers;
            this.loading = false;
        });

        this.representatives = [
            { name: "Amy Elsner", image: 'amyelsner.png' },
            { name: "Anna Fali", image: 'annafali.png' },
            { name: "Asiya Javayant", image: 'asiyajavayant.png' },
            { name: "Bernardo Dominic", image: 'bernardodominic.png' },
            { name: "Elwin Sharvill", image: 'elwinsharvill.png' },
            { name: "Ioni Bowcher", image: 'ionibowcher.png' },
            { name: "Ivan Magalhaes", image: 'ivanmagalhaes.png' },
            { name: "Onyama Limba", image: 'onyamalimba.png' },
            { name: "Stephen Shaw", image: 'stephenshaw.png' },
            { name: "XuXue Feng", image: 'xuxuefeng.png' }
        ];

        this.statuses = [
            { label: 'Unqualified', value: 'unqualified' },
            { label: 'Qualified', value: 'qualified' },
            { label: 'New', value: 'new' },
            { label: 'Negotiation', value: 'negotiation' },
            { label: 'Renewal', value: 'renewal' },
            { label: 'Proposal', value: 'proposal' }
        ]
        this.primengConfig.ripple = true;
        this.loggedInUser = this.tokenStorageService.getUser();
        if (this.loggedInUser.userdata != undefined) {
            this.isLoggedIn = true;
            this.userId = this.loggedInUser.userdata.id;
        }
        if (this.isLoggedIn == false) {
            this.router.navigate(['/']);
        }
        this.loadVenueOrderList();
    }

    onActivityChange(event) {
        const value = event.target.value;
        if (value && value.trim().length) {
            const activity = parseInt(value);

            if (!isNaN(activity)) {
                this.table.filter(activity, 'activity', 'gte');
            }
        }
    }

    onDateSelect(value) {
        this.table.filter(this.formatDate(value), 'date', 'equals')
    }

    formatDate(date) {
        let month = date.getMonth() + 1;
        let day = date.getDate();

        if (month < 10) {
            month = '0' + month;
        }

        if (day < 10) {
            day = '0' + day;
        }

        return date.getFullYear() + '-' + month + '-' + day;
    }

    onRepresentativeChange(event) {
        this.table.filter(event.value, 'representative', 'in')
    }


    loadVenueOrderList() {
        var query = "?filterByDisable=false&filterByStatus=true&filterByCustomerId=" + this.userId;
        this.venueOrderService.getVenueOrderList(query).subscribe(
            data => {
                this.loading = false;
                this.venueOrderList = data.data.items;
                // console.log("🚀 ~ file: orders.component.ts:102 ~ OrdersComponent ~ loadVenueOrderList ~ venueOrderList", this.venueOrderList)
                this.totalRecords = data.data.totalCount;
                if (this.totalRecords > 0) {
                    this.venueName = this.venueOrderList[0]['venueName'];
                }
            },
            err => {
                this.errorMessage = err.error.message;
            });
    }
    onVenueView(venueOrder) {
        this.router.navigateByUrl('/venue-order/view/' + venueOrder.id);
    }
}
