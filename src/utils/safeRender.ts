/**
 * Utility functions to safely render values in React
 * Prevents React Error #31: "Objects are not valid as a React child"
 */

/**
 * Safely converts a value to a string for rendering
 */
export function safeString(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (typeof value === 'string') {
    return value;
  }
  
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  
  if (typeof value === 'object') {
    // If it's an object with a 'name' property, use that
    if ('name' in value && typeof (value as { name?: unknown }).name === 'string') {
      return (value as { name: string }).name;
    }
    
    // If it's an object with a 'title' property, use that
    if ('title' in value && typeof (value as { title?: unknown }).title === 'string') {
      return (value as { title: string }).title;
    }
    
    // Otherwise, try JSON.stringify but limit length
    try {
      const json = JSON.stringify(value);
      return json.length > 100 ? json.substring(0, 100) + '...' : json;
    } catch {
      return '[Object]';
    }
  }
  
  return String(value);
}

/**
 * Safely extracts source name from various source formats
 */
export function safeSourceName(source: unknown): string {
  if (typeof source === 'string') {
    return source;
  }
  
  if (source && typeof source === 'object') {
    if ('name' in source && typeof (source as { name?: unknown }).name === 'string') {
      return (source as { name: string }).name;
    }
    
    if ('source' in source && typeof (source as { source?: unknown }).source === 'string') {
      return (source as { source: string }).source;
    }
  }
  
  return 'Tech News';
}

/**
 * Safely extracts a property from an object
 */
export function safeGet<T>(obj: unknown, key: string, defaultValue: T): T {
  if (!obj || typeof obj !== 'object') {
    return defaultValue;
  }
  
  if (key in obj) {
    const value = (obj as Record<string, unknown>)[key];
    return (value as T) ?? defaultValue;
  }
  
  return defaultValue;
}

/**
 * Validates that a value can be safely rendered in React
 */
export function canRender(value: unknown): boolean {
  return (
    value === null ||
    value === undefined ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    (typeof value === 'object' && React.isValidElement(value))
  );
}

// Import React for isValidElement check
import React from 'react';




