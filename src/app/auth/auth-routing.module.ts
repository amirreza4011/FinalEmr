import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent} from './login/login.component'
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'logigPage',
        component: LoginComponent,
        data: {
          title: 'Login Page'
        }
      },


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class authRoutingModule { }
