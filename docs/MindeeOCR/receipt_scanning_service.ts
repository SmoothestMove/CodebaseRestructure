import { toast } from 'react-toastify';

// Mindee API Response Types
export interface MindeeSupplierCompanyRegistration {
  value: string;
  type: string;
}

export interface MindeeLineItem {
  description: string | null;
  quantity: number | null;
  total_amount: number | null;
  unit_price: number | null;
}

export interface MindeeTax {
  rate: number | null;
  base: number | null;
  value: number | null;
  code: string | null;
}

export interface MindeeLocale {
  language: string | null;
  country: string | null;
  currency: string | null;
}

export interface MindeeReceiptPrediction {
  category: {
    value: string | null;
    confidence: number;
  };
  subcategory: {
    value: string | null;
    confidence: number;
  };
  date: {
    value: string | null;
    confidence: number;
  };
  time: {
    value: string | null;
    confidence: number;
  };
  total_amount: {
    value: number | null;
    confidence: number;
  };
  total_net: {
    value: number | null;
    confidence: number;
  };
  total_tax: {
    value: number | null;
    confidence: number;
  };
  supplier_name: {
    value: string | null;
    confidence: number;
  };
  supplier_address: {
    value: string | null; 
    confidence: number;
  };
  supplier_phone_number: {
    value: string | null;
    confidence: number;
  };
  receipt_number: {
    value: string | null;
    confidence: number;
  };
  tip: {
    value: number | null;
    confidence: number;
  };
  locale: {
    value: MindeeLocale | null;
    confidence: number;
  };
  line_items: MindeeLineItem[];
  taxes: MindeeTax[];
  supplier_company_registrations: MindeeSupplierCompanyRegistration[];
}

export interface MindeeApiResponse {
  api_request: {
    error: any;
    resources: string[];
    status: string;
    status_code: number;
    url: string;
  };
  document: {
    id: string;
    name: string;
    n_pages: number;
    is_rotation_applied: boolean;
    inference: {
      started_at: string;
      finished_at: string;
      processing_time: number;
      pages: Array<{
        id: number;
        orientation: { value: number };
        prediction: MindeeReceiptPrediction;
        extras: any;
      }>;
      prediction: MindeeReceiptPrediction;
      extras: any;
    };
  };
}

// Extracted receipt data interface
export interface ExtractedReceiptData {
  merchantName: string;
  amount: number;
  date: string;
  description: string;
  categoryHint?: string;
  subcategoryHint?: string;
  confidence: {
    overall: number;
    merchantName: number;
    amount: number;
    date: number;
  };
  rawData: MindeeReceiptPrediction;
}

// Configuration interface
export interface ReceiptScanningConfig {
  apiKey: string;
  confidenceThreshold?: number;
  retryAttempts?: number;
  timeoutMs?: number;
}

export class ReceiptScanningService {
  private apiKey: string;
  private confidenceThreshold: number;
  private retryAttempts: number;
  private timeoutMs: number;
  private baseUrl = 'https://api.mindee.net/v1/products/mindee/expense_receipts/v5/predict';

  constructor(config: ReceiptScanningConfig) {
    this.apiKey = config.apiKey;
    this.confidenceThreshold = config.confidenceThreshold || 0.7;
    this.retryAttempts = config.retryAttempts || 2;
    this.timeoutMs = config.timeoutMs || 10000;
  }

  /**
   * Scans a receipt image and extracts structured data
   */
  async scanReceipt(imageFile: File): Promise<ExtractedReceiptData> {
    this.validateFile(imageFile);

    const formData = new FormData();
    formData.append('document', imageFile, imageFile.name);

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await this.makeApiCall(formData);
        return this.parseApiResponse(response);
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < this.retryAttempts) {
          // Wait before retrying (exponential backoff)
          await this.delay(Math.pow(2, attempt) * 1000);
          continue;
        }
      }
    }

    throw new Error(`Receipt scanning failed after ${this.retryAttempts + 1} attempts: ${lastError?.message}`);
  }

  /**
   * Validates the uploaded file
   */
  private validateFile(file: File): void {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];

    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB');
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error('File must be an image (JPEG, PNG, GIF) or PDF');
    }
  }

  /**
   * Makes the API call to Mindee
   */
  private async makeApiCall(formData: FormData): Promise<MindeeApiResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.apiKey}`,
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your Mindee API credentials.');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait before scanning another receipt.');
        } else if (response.status >= 500) {
          throw new Error('Mindee service is temporarily unavailable. Please try again later.');
        }
        
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (data.api_request.status !== 'success') {
        throw new Error(`API request failed: ${JSON.stringify(data.api_request.error)}`);
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      
      throw error;
    }
  }

  /**
   * Parses the Mindee API response into our application format
   */
  private parseApiResponse(response: MindeeApiResponse): ExtractedReceiptData {
    const prediction = response.document.inference.prediction;

    // Extract basic fields with confidence checks
    const merchantName = this.extractFieldValue(prediction.supplier_name, 'Unknown Merchant');
    const amount = this.extractFieldValue(prediction.total_amount, 0);
    const rawDate = this.extractFieldValue(prediction.date, '');
    
    // Format date to YYYY-MM-DD
    const date = this.formatDate(rawDate);
    
    // Build description from available information
    const description = this.buildDescription(prediction);
    
    // Map categories to our system
    const categoryHint = this.mapCategoryToLocal(prediction.category.value);
    const subcategoryHint = prediction.subcategory.value;

    // Calculate overall confidence
    const confidence = {
      merchantName: prediction.supplier_name.confidence || 0,
      amount: prediction.total_amount.confidence || 0,
      date: prediction.date.confidence || 0,
      overall: this.calculateOverallConfidence(prediction),
    };

    // Validate confidence thresholds
    if (confidence.overall < this.confidenceThreshold) {
      console.warn(`Low confidence extraction: ${confidence.overall.toFixed(2)}`);
    }

    return {
      merchantName,
      amount,
      date,
      description,
      categoryHint,
      subcategoryHint, 
      confidence,
      rawData: prediction,
    };
  }

  /**
   * Safely extracts field value with fallback
   */
  private extractFieldValue<T>(field: { value: T | null; confidence: number } | undefined, fallback: T): T {
    return field?.value ?? fallback;
  }

  /**
   * Formats date string to YYYY-MM-DD format
   */
  private formatDate(dateString: string): string {
    if (!dateString) {
      return new Date().toISOString().split('T')[0];
    }

    try {
      // Handle various date formats
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return new Date().toISOString().split('T')[0];
      }
      return date.toISOString().split('T')[0];
    } catch {
      return new Date().toISOString().split('T')[0];
    }
  }

  /**
   * Builds a meaningful description from available receipt data
   */
  private buildDescription(prediction: MindeeReceiptPrediction): string {
    const parts: string[] = [];

    // Add receipt number if available
    if (prediction.receipt_number.value) {
      parts.push(`Receipt #${prediction.receipt_number.value}`);
    }

    // Add line items summary if available
    if (prediction.line_items && prediction.line_items.length > 0) {
      const validItems = prediction.line_items.filter(item => item.description);
      if (validItems.length > 0) {
        if (validItems.length === 1) {
          parts.push(validItems[0].description!);
        } else {
          parts.push(`${validItems.length} items`);
        }
      }
    }

    // Add location info if available
    if (prediction.supplier_address.value) {
      const address = prediction.supplier_address.value;
      // Extract city or short address
      const addressParts = address.split(',');
      if (addressParts.length > 1) {
        parts.push(addressParts[addressParts.length - 1].trim());
      }
    }

    return parts.length > 0 ? parts.join(' - ') : 'Scanned receipt';
  }

  /**
   * Maps Mindee categories to our local category system
   */
  private mapCategoryToLocal(mindeeCategory: string | null): string | undefined {
    if (!mindeeCategory) return undefined;

    const categoryMap: Record<string, string> = {
      'food': 'Food & Refreshments',
      'transport': 'Transportation',
      'gasoline': 'Transportation',
      'parking': 'Transportation',
      'accommodation': 'Professional Services',
      'shopping': 'New Home Essentials',
      'software': 'Professional Services',
      'telecom': 'New Home Essentials',
      'energy': 'New Home Essentials',
      'toll': 'Transportation',
      'miscellaneous': 'Miscellaneous/Contingency',
    };

    return categoryMap[mindeeCategory.toLowerCase()];
  }

  /**
   * Calculates overall confidence score
   */
  private calculateOverallConfidence(prediction: MindeeReceiptPrediction): number {
    const scores = [
      prediction.supplier_name.confidence || 0,
      prediction.total_amount.confidence || 0,
      prediction.date.confidence || 0,
    ];

    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }

  /**
   * Utility method for delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Processes multiple receipts from a single image (if supported)
   */
  async scanMultipleReceipts(imageFile: File): Promise<ExtractedReceiptData[]> {
    // For now, treat as single receipt since multi-receipt detection
    // requires a separate API endpoint that may not be available in basic plan
    const result = await this.scanReceipt(imageFile);
    return [result];
  }

  /**
   * Gets supported file types
   */
  static getSupportedFileTypes(): string[] {
    return ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
  }

  /**
   * Gets max file size
   */
  static getMaxFileSize(): number {
    return 5 * 1024 * 1024; // 5MB
  }
}