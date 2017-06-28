import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Http } from '@angular/http';
import { TranslateModule, TranslateStaticLoader, TranslateLoader } from 'ng2-translate/ng2-translate';

// SqLite
import { SQLStorage } from '../providers/sql-storage';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

// Component
import { ProgressBarComponent } from '../components/progress-bar/progress-bar';

// Project Pages
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { MenuPage } from '../pages/menu/menu';
import { HomePage } from '../pages/home/home';
import { ProgressPage } from '../pages/progress/progress';
import { SettingsPage } from '../pages/settings/settings';
import { SearchPage } from '../pages/search/search';
import { DocumentsPage } from '../pages/documents/documents';
import { ActivitiesPage } from '../pages/activities/activities';
import { TabPage } from '../pages/tab/tab';
import { AboutPage } from '../pages/about/about';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignupPage,
    MenuPage,
    HomePage,
    ProgressPage,
    SettingsPage,
    SearchPage,
    DocumentsPage,
    ActivitiesPage,
    TabPage,
    AboutPage,
    ProgressBarComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignupPage,
    MenuPage,
    HomePage,
    ProgressPage,
    SettingsPage,
    SearchPage,
    DocumentsPage,
    ActivitiesPage,
    TabPage,
    AboutPage
  ],
  providers: [
    SQLStorage,
    SQLite,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})

export class AppModule {}

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}
