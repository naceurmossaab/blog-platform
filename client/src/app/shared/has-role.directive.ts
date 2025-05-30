import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private vcr: ViewContainerRef,
    private auth: AuthService
  ) { }

  @Input() set appHasRole(roles: string[]) {
    this.auth.authUser$.subscribe(user => console.log('Current login user:', user));
    if (this.auth.hasRole(roles)) {
      this.vcr.createEmbeddedView(this.templateRef);
    } else {
      this.vcr.clear();
    }
  }
}
