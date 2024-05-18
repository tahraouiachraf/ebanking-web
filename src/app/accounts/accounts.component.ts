import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AccountsService } from '../services/accounts.service';
import { Observable, catchError, throwError } from 'rxjs';
import { AccountDetails } from '../model/account.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css'
})
export class AccountsComponent implements OnInit {
  accountFromGroup!: FormGroup;
  currentPage: number = 0;
  pageSize: number = 5;
  accountObservable!: Observable<AccountDetails>;
  operationsFromGroup!: FormGroup;
  errorMessage!: string;

  constructor(private fb: FormBuilder, private accountService: AccountsService, public authService: AuthService) {

  }

  ngOnInit(): void {
    this.accountFromGroup = this.fb.group({
      accountId: this.fb.control('')
    });

    this.operationsFromGroup = this.fb.group({
      operationType: this.fb.control(null),
      amount: this.fb.control(0),
      description: this.fb.control(null),
      accountDestination: this.fb.control(null)
    })
  }

  handleSearchAccount() {
    let accountId: string = this.accountFromGroup.value.accountId;
    this.accountObservable = this.accountService.getAccount(accountId, this.currentPage, this.pageSize).pipe(
      catchError(err => {
        this.errorMessage = err.message;
        return throwError(err)
      })
    );
  }

  gotoPage(page: number) {
    this.currentPage = page;
    this.handleSearchAccount();
  }

  handleAccountOperation() {
    let accountId: string = this.accountFromGroup.value.accountId;
    let operationType = this.operationsFromGroup.value.operationType;
    let amount: number = this.operationsFromGroup.value.amount;
    let description: string = this.operationsFromGroup.value.description;
    let accountDestination: string = this.operationsFromGroup.value.accountDestination;
    if (operationType == 'DEBIT') {
      this.accountService.debit(accountId, amount, description).subscribe({
        next: (data) => {
          alert("Success Debit");
          this.operationsFromGroup.reset();
          this.handleSearchAccount();
        }, error: (err) => {
          console.log(err);
        }
      })
    } else if (operationType == 'CREDIT') {
      this.accountService.credit(accountId, amount, description).subscribe({
        next: (data) => {
          alert("Success Credit");
          this.operationsFromGroup.reset();
          this.handleSearchAccount();
        }, error: (err) => {
          console.log(err);
        }
      })
    } else if (operationType == 'TRANSFER') {
      this.accountService.transfer(accountId, accountDestination, amount, description).subscribe({
        next: (data) => {
          alert("Success Transfer");
          this.operationsFromGroup.reset();
          this.handleSearchAccount();
        }, error: (err) => {
          console.log(err);
        }
      })
    }
  }

}
