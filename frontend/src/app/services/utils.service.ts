import { Roles } from "../shared/constants";
// import Swal from 'sweetalert2';

export function encryptPassword(password: string): string {
  return btoa(password);
}


export function truncateString(txt: string, len: number): string {
  return txt.length > len ? txt.substring(0, len)+'...' : txt;
}

export function getRole(role: number) {
  return Roles.find(f => f.value == role )?.name;
}

export function isAllowedPermission(permissions: string, type: string) {
  let loggedInUserPermissions: any = localStorage.getItem('permissions');
  loggedInUserPermissions = JSON.parse(atob(atob(loggedInUserPermissions)));
  
  if (loggedInUserPermissions[permissions]) {
    return loggedInUserPermissions[permissions].includes(type);
  } else {
    return false;
  }

}

// export async function swalConfirm(text: string) {

//   const result = await Swal.fire({
//     title: 'Are you sure?',
//     text,
//     icon: 'warning',
//     showCancelButton: true,
//     confirmButtonColor: '#3085d6',
//     // cancelButtonColor: '#d33',
//     confirmButtonText: `Yes !`
//   });

//   return result.isConfirmed;

// }
