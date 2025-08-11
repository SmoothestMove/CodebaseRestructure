# MARVIN Smart Color & Icon Selection

## Overview

MARVIN now uses intelligent semantic matching to automatically choose appropriate colors and icons for budget categories based on the category name. This provides a much better user experience than the previous approach of always using blue (`#3B82F6`) and question mark icons.

## How It Works

### 🧠 **Semantic Matching Algorithm**
MARVIN analyzes the category name and matches it against predefined semantic mappings:

```typescript
const categoryMappings = {
  // Transportation related
  gas: { color: '#ef4444', icon: 'Fuel' },            // Red fuel icon
  fuel: { color: '#ef4444', icon: 'Fuel' },           // Red fuel icon
  transport: { color: '#8b5cf6', icon: 'Truck' },     // Purple truck
  truck: { color: '#8b5cf6', icon: 'Truck' },         // Purple truck
  
  // Home related
  utilities: { color: '#f59e0b', icon: 'Plug' },      // Orange plug
  internet: { color: '#06b6d4', icon: 'Wifi' },       // Cyan wifi
  
  // Food related
  food: { color: '#10b981', icon: 'Utensils' },       // Green utensils
  groceries: { color: '#10b981', icon: 'Groceries' }, // Green groceries
  
  // Services related
  movers: { color: '#ec4899', icon: 'MovingCompany' }, // Pink moving company
  cleaning: { color: '#84cc16', icon: 'Broom' },      // Lime broom
  
  // And many more valid options...
};
```

### 🎯 **Selection Priority**
1. **User Specified**: If user provides color/icon in their request, use those
2. **Gemini Intelligence**: Gemini can choose appropriate colors/icons with guidance
3. **Semantic Matching**: System automatically chooses based on category name keywords
4. **Default Fallback**: Blue (#3B82F6) and question mark if no match found

## Example Interactions

### ✅ **Smart Automatic Selection**

**User Input**: *"Create a new budget category for Gas with $55 estimate"*

**MARVIN Response**: Creates category with:
- **Name**: "Gas"
- **Amount**: $55
- **Color**: `#ef4444` (red) 🔴
- **Icon**: `Fuel` ⛽

---

**User Input**: *"Add a category for Internet costs with $80 budget"*

**MARVIN Response**: Creates category with:
- **Name**: "Internet costs"
- **Amount**: $80
- **Color**: `#06b6d4` (cyan) 🔵
- **Icon**: `Wifi` 📶

---

**User Input**: *"Create a Movers category with $300"*

**MARVIN Response**: Creates category with:
- **Name**: "Movers"
- **Amount**: $300
- **Color**: `#ec4899` (pink) 🩷
- **Icon**: `MovingCompany` 👥

### 🎨 **User-Specified Colors**

**User Input**: *"Create a Storage category with $200 budget using green color"*

**Gemini Intelligence**: Can interpret "green color" and specify:
```json
{
  "action": "create_budget_category",
  "category": {
    "name": "Storage",
    "estimatedAmount": 200,
    "color": "#22c55e",
    "icon": "FaWarehouse"
  }
}
```

## Supported Semantic Categories

### 🚗 **Transportation**
- **Keywords**: gas, fuel, transport, truck, vehicle
- **Colors**: Red (#ef4444) for fuel, Purple (#8b5cf6) for vehicles
- **Icons**: Fuel, Truck

### 🏠 **Home & Utilities**
- **Keywords**: utilities, electricity, internet, wifi, home
- **Colors**: Orange (#f59e0b) for utilities, Cyan (#06b6d4) for internet, Orange (#f97316) for home
- **Icons**: Plug, Wifi, Home

### 🍽️ **Food & Dining**
- **Keywords**: food, meals, restaurant, groceries
- **Colors**: Green (#10b981)
- **Icons**: Utensils, Groceries

### 📦 **Supplies & Packing**
- **Keywords**: supplies, boxes, packing, tape
- **Colors**: Blue (#3b82f6)
- **Icons**: PackingSupplies, Tape

### 👥 **Services**
- **Keywords**: movers, moving, cleaning, insurance, professional
- **Colors**: Pink (#ec4899) for movers, Lime (#84cc16) for cleaning, Gray (#64748b) for insurance
- **Icons**: MovingCompany, Broom, ShieldCheck, ProfessionalServicesIcon

### 🏢 **Storage & Financial**
- **Keywords**: storage, tips, deposit, credit, shopping
- **Colors**: Purple (#a855f7) for storage, Green (#22c55e) for tips, Orange (#f59e0b) for deposits
- **Icons**: Warehouse, MoversTip, Deposits, CreditCard, ShoppingCart

### 🏡 **Home Essentials**
- **Keywords**: furniture, bed, paint, keys, pet, child, tools
- **Colors**: Various contextual colors
- **Icons**: Couch, Bed, Paintbrush, Key, PetCare, ChildCare, ToolsEquipment

## Benefits

### 🎯 **Better User Experience**
- Categories are visually distinct and meaningful
- Colors and icons provide instant recognition
- No need to manually specify colors/icons for common categories

### 🧠 **Intelligent Defaults**
- System learns from category names to provide appropriate styling
- Consistent color schemes across similar category types
- Professional appearance without user effort

### 🔧 **Flexible Override**
- Users can still specify custom colors and icons if desired
- Gemini can interpret color descriptions ("use green") and choose appropriate hex values
- System gracefully falls back to defaults when unsure

## Technical Implementation

The logic is implemented in `src/features/budget/hooks/useMarvinBudget.ts` with the `getSmartCategoryDefaults()` function, which:

1. **Normalizes** category name to lowercase
2. **Searches** for keyword matches in the mappings
3. **Returns** the first match found
4. **Fallbacks** to blue/question mark if no match

This approach ensures that users get intuitive, meaningful category styling without any extra effort, while maintaining the flexibility for custom specifications when needed.