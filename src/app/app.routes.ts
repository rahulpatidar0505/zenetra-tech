import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { PlaywrightAutomationComponent } from './pages/courses/playwright-automation.component';
import { JavaDevelopmentComponent } from './pages/courses/java-development.component';
import { SecurityTestingComponent } from './pages/courses/security-testing.component';
import { AdmissionsComponent } from './pages/admissions/admissions.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { ServicesComponent } from './pages/services/services.component';
import { BlogComponent } from './pages/blog/blog.component';
import { PlaywrightVsCypressSeleniumComponent } from './pages/blog/playwright-vs-cypress-selenium/playwright-vs-cypress-selenium.component';
import { McpServerComponent } from './pages/blog/mcp-server/mcp-server.component';
import { ProjectDevelopmentComponent } from './pages/services/project-development.component';
import { ProjectSupportComponent } from './pages/services/project-support.component';
import { OnlineTrainingComponent } from './pages/services/online-training.component';
import { WorkshopsComponent } from './pages/services/workshops.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', redirectTo: '/#about', pathMatch: 'full' }, // Redirect to home with about section hash
  { path: 'courses', component: CoursesComponent },
  { 
    path: 'courses', 
    children: [
      { path: 'playwright-automation', component: PlaywrightAutomationComponent },
      { path: 'java-development', component: JavaDevelopmentComponent },
      { path: 'security-testing', component: SecurityTestingComponent }
    ]
  },
  { path: 'admissions', component: AdmissionsComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'services/project-development', component: ProjectDevelopmentComponent },
  { path: 'services/project-support', component: ProjectSupportComponent },
  { path: 'services/online-training', component: OnlineTrainingComponent },
  { path: 'services/workshops', component: WorkshopsComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'blog/playwright-vs-cypress-selenium', component: PlaywrightVsCypressSeleniumComponent },
  { path: 'blog/mcp-server', component: McpServerComponent },
  { path: 'contact-us', component: ContactUsComponent },
];
