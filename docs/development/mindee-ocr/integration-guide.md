# Mindee Receipt API Integration Guide

This guide explains how to integrate the Mindee Receipt OCR API into your budgeting feature for automated receipt scanning and data extraction.

## Overview

The integration adds AI-powered receipt scanning capabilities to your expense tracking system, allowing users to:
- Automatically extract merchant names, amounts, dates, and categories from receipt images
- Reduce manual data entry errors
- Speed up expense logging process
- Support multiple image formats (JPEG, PNG, GIF, PDF)

## Prerequisites

1. **Mindee API Key**: Set `VITE_MINDEE_API_KEY` via environment variables (do not commit real keys)
2. **React 18+** with TypeScript support
3. **Existing budget feature components** (which you already have)

## Integration Steps

### Step 1: Add the Receipt Scanning Service

Create `src/features/budget/services/ReceiptScanningService.ts` with the provided code. This service:
- Handles API communication with Mindee
- Validates uploaded files
- Implements retry logic with exponential backoff
- Parses and structures the API response
- Maps Mindee categories to your local categories

**Key Features:**
- **File validation**: Checks file type and size limits
- **Error handling**: Provides user-friendly error messages
- **Confidence scoring**: Returns confidence levels for extracted data
- **Category mapping**: Maps Mindee's predefined categories to your system

### Step 2: Add the Receipt Scanning Hook

Create `src/features/budget/hooks/useReceiptScanner.ts` with the provided code. This hook:
- Manages scanning state (loading, success, error)
- Provides a reusable interface for receipt scanning
- Handles image preview generation
- Implements success/error callbacks

### Step 3: Add the Receipt Scan Modal

Create `src/features/budget/components/ReceiptScanModal.tsx` with the provided code. This modal:
- Provides a 3-step scanning workflow (Upload → Scanning → Review)
- Shows real-time confidence indicators
- Allows users to review and edit extracted data
- Includes image preview functionality
- Provides category suggestions based on AI analysis

**Modal Features:**
- **Progressive UI**: Visual step indicator showing scan progress
- **Confidence indicators**: Color-coded confidence scores for each field
- **Smart category matching**: Automatically suggests the best matching category
- **Data validation**: Ensures all required fields are present before submission
- **Error handling**: User-friendly error messages for various failure scenarios

### Step 4: Update the AddExpenseModal Component

Replace your existing `src/features/budget/components/AddExpenseModal.tsx` with the updated version. The changes include:
- Integration of the receipt scanning modal
- Quick scan button in the expense form
- Auto-population of form fields from scanned data
- Enhanced UI to guide users toward scanning option

**New Features:**
- **Scan integration**: Prominent "Scan Receipt with AI" button
- **Smart form population**: Automatically fills form with extracted data
- **Seamless workflow**: Users can scan and immediately review/edit before saving

### Step 5: Install Required Dependencies

Ensure you have the following dependencies in your `package.json`:

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-toastify": "^9.0.0",
    "react-icons": "^4.0.0",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/uuid": "^9.0.0"
  }
}
```

### Step 6: Update Your Exports

Add the new components to your `src/features/budget/index.ts`:

```typescript
// Add these exports
export { default as ReceiptScanModal } from './components/ReceiptScanModal';
export { ReceiptScanningService } from './services/ReceiptScanningService';
export { useReceiptScanner } from './hooks/useReceiptScanner';

// Update existing export
export { default as AddExpenseModal } from './components/AddExpenseModal';
```

## API Configuration

### Mindee API Endpoints

The integration uses Mindee's Receipt API v5:
- **Endpoint**: `https://api.mindee.net/v1/products/mindee/expense_receipts/v5/predict`
- **Method**: POST
- **Authentication**: Bearer token via `Authorization: Token {your-api-key}`

### Supported File Formats

- **Images**: JPEG, PNG, GIF
- **Documents**: PDF
- **File Size Limit**: 5MB
- **Processing Time**: ~1 second average

### Extracted Data Fields

The API extracts the following information:
- **Merchant Information**: Name, address, phone number
- **Financial Data**: Total amount, net amount, tax amount, tip
- **Purchase Details**: Date, time, receipt number
- **Line Items**: Individual items with descriptions and amounts
- **Categories**: AI-suggested expense categories
- **Taxes**: Detailed tax breakdown

## Error Handling

### Common Error Scenarios

1. **Invalid API Key** (401)
   - Message: "Invalid API key. Please check your Mindee API credentials."
   - Action: Verify API key configuration

2. **Rate Limiting** (429)
   - Message: "Rate limit exceeded. Please wait before scanning another receipt."
   - Action: Implement exponential backoff (already included)

3. **File Size/Type Errors**
   - Message: "File size must be less than 5MB" or "File must be an image or PDF"
   - Action: Client-side validation prevents these

4. **Network/Timeout Errors**
   - Message: "Request timed out. Please try again."
   - Action: Automatic retry with backoff

5. **Service Unavailable** (500+)
   - Message: "Mindee service is temporarily unavailable."
   - Action: User should try again later

## Confidence Scoring

### Understanding Confidence Levels

- **High Confidence** (80%+): Green indicator, reliable extraction
- **Medium Confidence** (60-79%): Yellow indicator, may need review
- **Low Confidence** (<60%): Red indicator, requires user verification

### Confidence Display

The UI shows confidence indicators for:
- Overall extraction quality
- Merchant name accuracy
- Amount detection
- Date recognition

## Category Mapping

### Mindee to Local Category Mapping

```typescript
const categoryMap = {
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
  'miscellaneous': 'Miscellaneous/Contingency'
};
```

## Usage Examples

### Basic Integration

```typescript
// In your main budget component
import { ReceiptScanModal } from '../components/ReceiptScanModal';

const [isReceiptScanOpen, setIsReceiptScanOpen] = useState(false);

// Handle scanned receipt
const handleReceiptScanned = (expense: Omit<Expense, 'id'>) => {
  // Add the expense to your state
  dispatch({ type: 'ADD_EXPENSE', payload: expense });
  toast.success('Expense added from receipt!');
};

// Render the modal
<ReceiptScanModal
  isOpen={isReceiptScanOpen}
  onClose={() => setIsReceiptScanOpen(false)}
  onConfirm={handleReceiptScanned}
  categories={categories}
  apiKey="${import.meta.env.VITE_MINDEE_API_KEY}"
/>
```

### Using the Hook Directly

```typescript
import { useReceiptScanner } from '../hooks/useReceiptScanner';

const MyComponent = () => {
  const scanner = useReceiptScanner({
    apiKey: import.meta.env.VITE_MINDEE_API_KEY,
    onScanSuccess: (data) => {
      console.log('Extracted data:', data);
    },
    onScanError: (error) => {
      console.error('Scan failed:', error);
    }
  });

  const handleFileDrop = async (file: File) => {
    const result = await scanner.scanReceipt(file);
    if (result) {
      // Use the extracted data
      setFormData(result);
    }
  };

  return (
    <div>
      {scanner.isScanning && <p>Scanning receipt...</p>}
      {scanner.extractedData && (
        <div>
          <p>Merchant: {scanner.extractedData.merchantName}</p>
          <p>Amount: ${scanner.extractedData.amount}</p>
        </div>
      )}
    </div>
  );
};
```

## Testing the Integration

### Test Cases to Verify

1. **Successful Scanning**
   - Upload a clear receipt image
   - Verify all fields are extracted correctly
   - Check confidence scores are reasonable
   - Confirm category suggestion works

2. **Error Handling**
   - Try uploading oversized files
   - Test with invalid file types
   - Simulate network errors
   - Verify error messages are user-friendly

3. **Low Confidence Scenarios**
   - Upload blurry or damaged receipt images
   - Verify warning messages appear
   - Check that users can still edit extracted data

4. **Category Mapping**
   - Upload receipts from different business types
   - Verify category suggestions match expectations
   - Test fallback to default category

### Sample Test Receipts

For testing, use receipts with:
- Clear, well-lit text
- Different business types (restaurants, gas stations, retail)
- Various currencies and formats
- Both English and international formats

## Performance Considerations

### Optimization Tips

1. **File Size**: Encourage users to compress large images
2. **Caching**: Store successful extractions to avoid re-scanning
3. **Loading States**: Always show progress indicators during scanning
4. **Error Recovery**: Provide clear retry options

### Rate Limiting

Mindee's free tier includes:
- 250 API calls per month
- 20 calls per minute rate limit

For production use, consider:
- Upgrading to a paid plan for higher limits
- Implementing client-side rate limiting
- Adding usage analytics

## Security Considerations

### Data Protection

1. **API Key Security**: Store API key in environment variables for production
2. **Image Handling**: Don't store receipt images longer than necessary
3. **HTTPS**: Ensure all API calls use HTTPS
4. **Data Sanitization**: Validate all extracted data before use

### Privacy Compliance

- Receipt images are temporarily processed by Mindee
- Consider GDPR compliance for European users
- Implement data retention policies
- Allow users to opt-out of AI scanning

## Troubleshooting

### Common Issues

1. **"Receipt scanning service not initialized"**
   - Check API key is properly set
   - Verify service initialization in useEffect

2. **Low extraction accuracy**
   - Ensure good image quality
   - Check receipt language/format support
   - Review confidence thresholds

3. **Category mapping issues**
   - Verify your category structure matches expected format
   - Check category IDs are consistent
   - Update mapping table as needed

4. **Modal not appearing**
   - Check modal dependencies are imported
   - Verify state management for modal visibility
   - Check for CSS conflicts

## Future Enhancements

### Potential Improvements

1. **Multi-receipt Detection**: Support scanning multiple receipts in one image
2. **Offline Capability**: Cache common merchant data for offline use
3. **Receipt Templates**: Learn from user corrections to improve accuracy
4. **Bulk Processing**: Allow batch upload of multiple receipts
5. **Integration with Other APIs**: Combine with mapping APIs for location data

### Advanced Features

- **Smart Categorization**: Machine learning based on user's spending patterns
- **Expense Analytics**: Track scanning accuracy and usage patterns
- **Custom Fields**: Extract additional data fields specific to your use case
- **OCR Training**: Fine-tune the model for specific receipt types

## Support and Resources

### Mindee Resources

- [Official Documentation](https://developers.mindee.com/docs/receipt-ocr)
- [API Reference](https://developers.mindee.com/docs/receipt-ocr)
- [Community Support](https://join.slack.com/t/mindee-community/shared_invite/zt-1jv6nawjq-FDgFcF2T5CmMmRpl9LLptw)

### Getting Help

For issues with this integration:
1. Check the console for detailed error messages
2. Verify API key and network connectivity
3. Test with known good receipt images
4. Review the confidence scores for extraction quality

This integration should provide a seamless receipt scanning experience that significantly improves the user experience of your budgeting application.
