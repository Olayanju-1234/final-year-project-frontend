import { useState, useCallback } from 'react'

interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => string | null
}

interface ValidationRules {
  [key: string]: ValidationRule
}

interface ValidationErrors {
  [key: string]: string
}

interface UseFormValidationReturn<T> {
  values: T
  errors: ValidationErrors
  isValid: boolean
  setValue: (field: keyof T, value: any) => void
  setValues: (values: Partial<T>) => void
  validate: () => boolean
  validateField: (field: keyof T) => boolean
  clearErrors: () => void
  reset: (initialValues: T) => void
}

export const useFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules
): UseFormValidationReturn<T> => {
  const [values, setValuesState] = useState<T>(initialValues)
  const [errors, setErrors] = useState<ValidationErrors>({})

  const validateField = useCallback((field: keyof T): boolean => {
    const value = values[field]
    const rule = validationRules[String(field)]

    if (!rule) return true

    // Required validation
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      setErrors(prev => ({ ...prev, [String(field)]: `${String(field)} is required` }))
      return false
    }

    // Skip other validations if value is empty and not required
    if (!value && !rule.required) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[String(field)]
        return newErrors
      })
      return true
    }

    // Min length validation
    if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
      setErrors(prev => ({ 
        ...prev, 
        [String(field)]: `${String(field)} must be at least ${rule.minLength} characters` 
      }))
      return false
    }

    // Max length validation
    if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
      setErrors(prev => ({ 
        ...prev, 
        [String(field)]: `${String(field)} must be no more than ${rule.maxLength} characters` 
      }))
      return false
    }

    // Pattern validation
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      setErrors(prev => ({ 
        ...prev, 
        [String(field)]: `${String(field)} format is invalid` 
      }))
      return false
    }

    // Custom validation
    if (rule.custom) {
      const customError = rule.custom(value)
      if (customError) {
        setErrors(prev => ({ ...prev, [String(field)]: customError }))
        return false
      }
    }

    // Clear error if validation passes
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[String(field)]
      return newErrors
    })

    return true
  }, [values, validationRules])

  const validate = useCallback((): boolean => {
    const fieldKeys = Object.keys(validationRules) as (keyof T)[]
    const results = fieldKeys.map(field => validateField(field))
    return results.every(result => result)
  }, [validationRules, validateField])

  const setValue = useCallback((field: keyof T, value: any) => {
    setValuesState(prev => ({ ...prev, [field]: value }))
    // Auto-validate on change
    setTimeout(() => validateField(field), 0)
  }, [validateField])

  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState(prev => ({ ...prev, ...newValues }))
  }, [])

  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  const reset = useCallback((initialValues: T) => {
    setValuesState(initialValues)
    setErrors({})
  }, [])

  const isValid = Object.keys(errors).length === 0

  return {
    values,
    errors,
    isValid,
    setValue,
    setValues,
    validate,
    validateField,
    clearErrors,
    reset,
  }
} 