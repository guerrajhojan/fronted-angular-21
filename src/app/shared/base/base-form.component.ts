import { Component, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
    template: '',
    standalone: true
})
export abstract class BaseFormComponent implements OnDestroy {

    abstract form: FormGroup;
    abstract onSubmit(): void;

    isLoading = false;
    errorMessage = '';
    successMessage = '';
    protected destroy$ = new Subject<void>();

    isFieldInvalid(fieldName: string): boolean {
        const field = this.form.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    getFieldError(fieldName: string): string {
        const field = this.form.get(fieldName);
        if (!field || !field.errors) return '';
        if (field.errors['required']) return 'Este campo es obligatorio.';
        if (field.errors['email']) return 'Ingresa un email válido.';
        if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres.`;
        if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres.`;
        return 'Campo inválido.';
    }

    setLoading(state: boolean): void { this.isLoading = state; }
    setError(msg: string): void { this.errorMessage = msg; this.successMessage = ''; this.isLoading = false; }
    setSuccess(msg: string): void { this.successMessage = msg; this.errorMessage = ''; this.isLoading = false; }
    clearMessages(): void { this.errorMessage = ''; this.successMessage = ''; }

    ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}