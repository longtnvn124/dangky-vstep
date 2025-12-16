import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ContentNoneComponent} from './features/content-none/content-none.component';
import {UnauthorizedComponent} from './features/unauthorized/unauthorized.component';
import {ClearComponent} from './features/clear/clear.component';
import {LoginVideoComponent} from '@modules/public/features/login-video/login-video.component';
import {ResetPasswordComponent} from "@modules/public/features/reset-password/reset-password.component";
import {
  VerificationComponent
} from "@modules/public/features/home-thi-thpt/layouts/verification/verification.component";
import {
  RegisterAccountComponent
} from "@modules/public/features/home-thi-thpt/layouts/register-account/register-account.component";
import {TraCuuKetQuaComponent} from "@modules/public/features/tra-cuu-ket-qua/tra-cuu-ket-qua.component";


const routes: Routes = [
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
  {
    path: 'clear',
    component: ClearComponent
  },

  {
    path         : 'dev' ,
    loadChildren : () => import('@modules/public/features/dev/dev.module').then( m => m.DevModule )
  },
  // {
  //   path:"home",
  //   component:HomeDhtnComponent
  // } ,
  {
    path:"home",
    loadChildren:()=> import('@modules/public/features/home-thi-thpt/home-thi-thpt.module').then(m=>m.HomeThiThptModule),
  } ,
  {
    path:"register-account",
    component:RegisterAccountComponent,
  },
  {
    path:"verification",
    component:VerificationComponent,
  },
  // {
  //   path: 'home',
  //   canActivate: [DesktopGuard],
  //   loadChildren: () => import('@modules/public/features/home/home.module').then(m => m.HomeModule)
  // },

  {
    path: 'login',
    component: LoginVideoComponent
  },
  {
    path:'tra-cuu-ket-qua',
    component:TraCuuKetQuaComponent
  },

  // {
  // 	path      : 'login-video' ,
  // 	component : LoginVideoComponent
  // } ,
  // {
  // 	path      : 'login-2' ,
  //  component : LoginV2Component
  // } ,
  {
    path: 'content-none',
    component: ContentNoneComponent
  },

  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },

  // {
  //   path: '',
  //   redirectTo: 'test',
  //   pathMatch: 'prefix'
  // },
  {
    path: '**',
    redirectTo: '/login',
    pathMatch: 'prefix'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PublicRoutingModule {
}
