import { Component, computed, input } from '@angular/core';
import { EmployeeDTO as EmployeeDTO } from '@interfaces/Employees/EmployeesDTO';
import { CommonModule } from '@angular/common';
import { UserAvatarSquareComponent } from "@base-ui/user-avatar/user-avatar.component";

@Component({
  selector: 'employee-card',
  imports: [CommonModule, UserAvatarSquareComponent],
  templateUrl: './employee-card.component.html',
  styleUrl: './employee-card.component.css'
})
export class EmployeeCardComponent{

  employee = input.required<EmployeeDTO>();
  employeeLabel = computed(()=> this.employee().name.substring(0,1) + this.employee().lastName.substring(0,1));

}
