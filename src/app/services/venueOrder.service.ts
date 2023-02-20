import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const USER_API = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class VenueOrderService {
    constructor(private http: HttpClient) { }

    getVenueOrderList(query): Observable<any> {
        return this.http.get(USER_API + "venueorder" + query);
    }
    getVenueOrderListWithoutAuth(query): Observable<any> {
        return this.http.get(USER_API + "venueorder/v1?" + query);
    }

    getVenueOrderDetails(id): Observable<any> {
        return this.http.get(USER_API + "venueorder/" + id);
    }

    updateVenueOrder(id, venueorderData): Observable<any> {
        return this.http.put(USER_API + 'venueorder/' + id, venueorderData);
    }

    addVenueOrder(venueorderData): Observable<any> {
        return this.http.post(USER_API + 'venueorder', venueorderData);
    }

    getVenueOrder(id): Observable<any> {
        return this.http.get(USER_API + "venueorder/" + id);
    }

}