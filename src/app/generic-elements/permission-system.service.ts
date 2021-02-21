import { Injectable } from '@angular/core';
import { permission_system_t, linear_permission_system } from '../app-interfaes';


@Injectable({
  providedIn: 'root'
})
export class PermissionSystemService {
  type: string
  permissions: linear_permission_system
  initiated: boolean
  init(permission_system: permission_system_t){
    this.initiated = true;
    this.type = permission_system.type;
    this.permissions = permission_system.permissions;
    
  }

  have_permission(asset_restrections:string){
    var per = localStorage.getItem('permission')
    if (per == 'null' || per == null || per == undefined ){
      return false
    }
    if (this.type == 'linear'){
      var idx_asset_restrection = this.permissions.list.indexOf(asset_restrections)
      var idx_user_permission = this.permissions.list.indexOf(per)
      return idx_user_permission <= idx_asset_restrection

    }
    return false
  }
  constructor() { }
}
