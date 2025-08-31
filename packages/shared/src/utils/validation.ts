import { ZodSchema, ZodError } from 'zod'

export interface ValidationResult<T> {
  success: boolean
  data?: T
  error?: string
  errors?: string[]
}

/**
 * Validates data against a Zod schema and returns a standardized result
 */
export function validateData<T>(
  schema: ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  try {
    const validatedData = schema.parse(data)
    return {
      success: true,
      data: validatedData,
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: 'Validation failed',
        errors: error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        ),
      }
    }
    
    return {
      success: false,
      error: 'Validation failed',
    }
  }
}

/**
 * Validates data and throws an error if validation fails
 */
export function validateDataOrThrow<T>(
  schema: ZodSchema<T>,
  data: unknown
): T {
  const result = validateData(schema, data)
  if (!result.success) {
    throw new Error(result.error || 'Validation failed')
  }
  return result.data as T
}

/**
 * Creates a middleware-friendly validation function
 */
export function createValidator<T>(schema: ZodSchema<T>) {
  return (data: unknown): ValidationResult<T> => {
    return validateData(schema, data)
  }
}
