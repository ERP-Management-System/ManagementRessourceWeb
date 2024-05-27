import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
 
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './home/navbar/navbar.component';
import { TestPageComponent } from './test-page/test-page.component';
import { ParametrageCentralComponent } from './parametrageCenral/parametrage-central/parametrage-central.component';
import { ModeReglementComponent } from './parametrageCenral/mode-reglement/mode-reglement.component'; 



import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DeviseComponent } from './parametrageCenral/devise/devise.component';
import { BanqueComponent } from './parametrageCenral/banque/banque.component';
import { SaisonComponent } from './parametrageCenral/saison/saison.component';
import { TypeCaisseComponent } from './parametrageCenral/type-caisse/type-caisse.component';
import { RegionComponent } from './parametrageCenral/region/region.component';
import {ToastModule} from 'primeng/toast';
import {ConfirmDialogModule} from 'primeng/confirmdialog'; 
import { MatIconModule } from '@angular/material/icon'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DialogModule } from 'primeng/dialog';
import { EditorModule } from 'primeng/editor';

///////////////////////////////
import { PickListModule } from 'primeng/picklist';
import {ButtonModule} from 'primeng/button';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { TreeSelectModule } from 'primeng/treeselect';
import { ToolbarModule } from 'primeng/toolbar';
// Import PrimeNG modules
import { AccordionModule } from 'primeng/accordion';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { CarouselModule } from 'primeng/carousel';
import { ChipModule } from 'primeng/chip';
import { ChipsModule } from 'primeng/chips';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DataViewModule } from 'primeng/dataview';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { DividerModule } from 'primeng/divider';
import { DockModule } from 'primeng/dock';
import { DragDropModule } from 'primeng/dragdrop';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { FieldsetModule } from 'primeng/fieldset'; 
import { GalleriaModule } from 'primeng/galleria';
import { InplaceModule } from 'primeng/inplace';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ImageModule } from 'primeng/image';
import { KnobModule } from 'primeng/knob';
import { ListboxModule } from 'primeng/listbox';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenubarModule } from 'primeng/menubar';
import { MultiSelectModule } from 'primeng/multiselect';
import { OrderListModule } from 'primeng/orderlist';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PasswordModule } from 'primeng/password';
import { ProgressBarModule } from 'primeng/progressbar';
import { RatingModule } from 'primeng/rating';
import { ScrollerModule } from 'primeng/scroller';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ScrollTopModule } from 'primeng/scrolltop';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SidebarModule } from 'primeng/sidebar';
import { SkeletonModule } from 'primeng/skeleton';
import { SlideMenuModule } from 'primeng/slidemenu';
import { SliderModule } from 'primeng/slider';
import { SpinnerModule } from 'primeng/spinner';
import { SplitterModule } from 'primeng/splitter';
import { StepsModule } from 'primeng/steps';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { TerminalModule } from 'primeng/terminal';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { TimelineModule } from 'primeng/timeline';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TooltipModule } from 'primeng/tooltip';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
// import { AnimateModule } from 'primeng/animate';
import { CardModule } from 'primeng/card';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';
 
import {  MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table' 
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'; 
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from "@angular/material/form-field";
import { TableModule } from 'primeng/table';
import { MessagesModule } from 'primeng/messages';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageModule } from "primeng/message"; 
import { ConfirmationService, MessageService } from 'primeng/api';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SpeedDialModule } from 'primeng/speeddial';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuModule } from 'primeng/menu';     
import { FileUploadModule } from 'primeng/fileupload';



@NgModule({
  declarations: [
    AppComponent,HomeComponent, NavbarComponent, TestPageComponent, ParametrageCentralComponent, ModeReglementComponent, DeviseComponent, BanqueComponent, SaisonComponent, TypeCaisseComponent, RegionComponent
  ],
  imports: [
    BrowserModule,BrowserAnimationsModule,
    AppRoutingModule,FormsModule, ReactiveFormsModule,BreadcrumbModule,ToastModule
    ,ConfirmDialogModule,MatIconModule,DialogModule,EditorModule,


    ////////
    AvatarModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AccordionModule,
    AutoCompleteModule,
    BadgeModule,
    BreadcrumbModule,
    BlockUIModule,
    ButtonModule,
    CalendarModule,
    CarouselModule,
    CascadeSelectModule,
    CheckboxModule,
    ChipsModule,
    ChipModule,
    ColorPickerModule,
    ConfirmDialogModule,
    ContextMenuModule,
    VirtualScrollerModule,
    DataViewModule,
    DialogModule,
    DividerModule,
    DockModule,
    DragDropModule,
    DropdownModule,
    DynamicDialogModule,
    EditorModule,
    FieldsetModule,
    FileUploadModule,
    GalleriaModule,
    InplaceModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    ImageModule,
    KnobModule, 

    ListboxModule,
    MegaMenuModule,
    MenuModule,
    MenubarModule,
    MessageModule,
    MessagesModule,
    MultiSelectModule,
    OrderListModule,
    OverlayPanelModule,
    PaginatorModule,
    PanelModule,
    PanelMenuModule,
    PasswordModule,
    PickListModule,
    ProgressSpinnerModule,
    ProgressBarModule,
    RadioButtonModule,
    RatingModule,
    SelectButtonModule,
    SidebarModule,
    ScrollerModule,
    ScrollPanelModule,
    ScrollTopModule,
    SkeletonModule,
    SlideMenuModule,
    SliderModule,
    SpeedDialModule,
    SpinnerModule,
    SplitterModule,
    SplitButtonModule,
    StepsModule,
    TableModule,
    TabMenuModule,
    TabViewModule,
    TagModule,
    TerminalModule,
    TieredMenuModule,
    TimelineModule,
    ToastModule,
    ToggleButtonModule,
    ToolbarModule,
    TooltipModule,
    TriStateCheckboxModule,
    TreeModule,
    TreeSelectModule,
    TreeTableModule,
    CardModule,RippleModule,ButtonModule,TagModule,
    BrowserModule, BrowserAnimationsModule,
    AppRoutingModule, FormsModule,
    TableModule, DropdownModule, ButtonModule,ConfirmDialogModule,
    MatFormFieldModule,
    MatInputModule,MatRadioModule
    
  ],
  providers: [
    // provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
