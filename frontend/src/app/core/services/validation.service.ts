import { Injectable } from '@angular/core';
import { z, ZodSchema } from 'zod';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  validate<T>(schema: ZodSchema<T>, data: any): { success: boolean; data?: T; error?: any } {
    try {
      const parsedData = schema.parse(data);
      return { success: true, data: parsedData };
    } catch (error) {
      return { success: false, error };
    }
  }
}
