# 🛠️ Accessibility Implementation Checklist for Developers

## ✅ Component Accessibility Checklist

Use this checklist when creating or updating components to ensure they're accessible for blind users and people with disabilities.

## Semantic HTML

### Navigation
- [ ] Use `<nav>` for navigation regions
- [ ] Use `<a>` for links (not `<span onclick>`)
- [ ] Links have descriptive text (not just "Click here")
- [ ] Active page link has `aria-current="page"`

### Forms
- [ ] Each `<input>` has associated `<label>`
- [ ] `<label htmlFor="id">` matches input ID
- [ ] Required fields marked with `aria-required="true"` and `*`
- [ ] Form groups use `<fieldset>` and `<legend>`
- [ ] Error messages have `role="alert"` and `aria-live="polite"`

### Structure
- [ ] Main content in `<main>` with ID "main-content"
- [ ] Proper heading hierarchy (H1 → H2 → H3, no skips)
- [ ] Sections have `<section>` with `aria-label`
- [ ] Lists use `<ul>`, `<ol>`, `<li>` for structure

### Content
- [ ] All images have meaningful `alt` text
- [ ] Decorative images have `alt=""`
- [ ] Icons have `aria-label` or hidden text
- [ ] Color not the only way to convey info

## ARIA Attributes

### Live Regions
- [ ] Dynamic updates use `role="status"` with `aria-live="polite"`
- [ ] Urgent alerts use `aria-live="assertive"`
- [ ] Live regions are outside initial focus

### Labels & Descriptions
- [ ] Icon buttons have `aria-label`
- [ ] Complex elements have `aria-describedby`
- [ ] Inputs have `aria-label` or associated `<label>`
- [ ] Error messages linked with `aria-describedby`

### States
- [ ] Buttons show `aria-pressed` if toggles
- [ ] Expandable items have `aria-expanded`
- [ ] Hidden items have `aria-hidden="true"`
- [ ] Loading states have `aria-busy="true"`

### Relationships
- [ ] Form validation: `aria-invalid="true"` with error
- [ ] Disabled elements: `aria-disabled="true"` or native `disabled`
- [ ] Menu items: `role="menuitem"` with parent `role="menu"`

## Keyboard Navigation

### Tab Order
- [ ] Tab order is logical (left to right, top to bottom)
- [ ] Skip link at top of page (usually first element)
- [ ] Focus indicator clearly visible
- [ ] Focus trap in modals (can't Tab out)

### Keyboard Shortcuts
- [ ] All functionality available via keyboard
- [ ] Shortcuts documented (press `?` shows help)
- [ ] Shortcuts don't conflict with browser/AT
- [ ] Arrow keys work in lists/menus

### Focus Management
- [ ] Focus visible on all interactive elements
- [ ] Focus indicator meets contrast requirements (3:1)
- [ ] Focus moves to modals when they open
- [ ] Focus returns from closed modals

### Implementation Pattern
```javascript
// Standard Tab navigation
<button tabIndex={0}>Click me</button>

// For non-interactive elements
<div tabIndex={-1} ref={focusRef}>Announcement area</div>

// Skip link
<a href="#main-content" className="sr-only">
  Skip to main content
</a>
```

## Screen Reader Support

### Text Content
- [ ] All text content is real text (not images of text)
- [ ] Abbreviations expanded on first use
- [ ] Long form alternatives for dates (not just "2/14/25")
- [ ] Numbers formatted for reading ("$10.50" not "1050")

### Interactive Elements
- [ ] Button purpose clear from text or aria-label
- [ ] Link destination clear from text
- [ ] Form field labels descriptive
- [ ] Help text associated with inputs

### Announcements
```javascript
import { announceSuccess } from '../../utils/screenReaderAnnouncements';

// Announce important changes
announceSuccess('Medicine added successfully');
announceError('Invalid medication');
announceNavigation('Navigated to reminders');
```

### Hidden Content
- [ ] Decorative elements: `aria-hidden="true"`
- [ ] Screen reader only text: `class="sr-only"`
- [ ] Visibility: hidden elements have `aria-hidden="true"`

## Using Global Accessibility Settings

### Import and Use
```javascript
import { useAccessibilitySettings } from '../../contexts/AccessibilitySettingsContext';

const MyComponent = () => {
  const { settings } = useAccessibilitySettings();
  
  return (
    <div style={{
      fontSize: settings.fontSize === 'large' ? '18px' : '16px',
      backgroundColor: settings.highContrast ? '#ffffff' : '#f9fafb',
      color: settings.highContrast ? '#000000' : '#1f2937',
      transition: settings.reducedMotion ? 'none' : 'all 0.3s ease'
    }}>
      Content
    </div>
  );
};
```

### Available Settings
```javascript
settings = {
  highContrast: boolean,
  fontSize: 'small' | 'medium' | 'large' | 'extraLarge',
  voiceEnabled: boolean,
  voiceVolume: 0-1,
  voiceSpeed: 0.5-2,
  screenReaderOptimized: boolean,
  keyboardNavigationEnabled: boolean,
  focusIndicatorSize: 'thin' | 'normal' | 'thick',
  reducedMotion: boolean,
  largeButtons: boolean,
  colorBlindMode: 'none' | 'deuteranopia' | 'protanopia' | 'tritanopia'
}
```

## Color & Contrast

### Contrast Ratios (WCAG AA)
- [ ] Normal text: 4.5:1 minimum
- [ ] Large text (18px+): 3:1 minimum
- [ ] UI components: 3:1 minimum
- [ ] Focus indicators: 3:1 minimum

### Color Usage
- [ ] Color not sole identifier (use icons/text too)
- [ ] Color combinations accessible for color blind
- [ ] Sufficient brightness difference
- [ ] Test with accessibility tools

### Dark Mode Considerations
- [ ] High contrast in both light and dark
- [ ] Test focus indicators in both modes
- [ ] Borders visible in both modes

## Testing Checklist

### Manual Testing
- [ ] Test with keyboard only (no mouse)
- [ ] Tab through entire page in order
- [ ] All buttons/links clickable via keyboard
- [ ] Can close all modals and dropdowns
- [ ] Focus indicators visible at all times

### Screen Reader Testing
- [ ] Test with NVDA (Windows, free)
- [ ] All content announced
- [ ] Form labels clear
- [ ] Page structure clear
- [ ] Headings make sense
- [ ] Skip link works first

### Zoom Testing
- [ ] Test at 200% zoom
- [ ] No overlap or cut-off content
- [ ] Readable at 400% zoom
- [ ] Two-column layout doesn't break

### Mobile Testing
- [ ] Touch targets ≥44x44px
- [ ] Focus indicators visible
- [ ] Works with mobile screen readers
- [ ] Zoom works properly

## Tools for Testing

### Browser Extensions
- axe DevTools
- WAVE
- Lighthouse (built-in)
- Color Contrast Analyzer

### Standalone Tools
- NVDA (screen reader)
- WebAIM Contrast Checker
- Accessibility Insights
- WAVE Browser Extension

### Testing Commands
```bash
# Check for common issues
npm run test:a11y

# Run accessibility tests
npm run test:accessibility

# Validate HTML semantics
npm run validate:html
```

## Common Mistakes to Avoid

### ❌ Don't Do This
```javascript
// ❌ Bad: div used as button
<div onClick={handleClick} style={{cursor: 'pointer'}}>Click me</div>

// ❌ Bad: no label
<input type="text" placeholder="Name" />

// ❌ Bad: color only
<span style={{color: 'red'}}>Error</span>

// ❌ Bad: image with no alt
<img src="medicine.jpg" />

// ❌ Bad: hidden from AT
<button aria-hidden="true">Help</button>

// ❌ Bad: wrong heading order
<h1>Page</h1>
<h3>Section</h3> {/* Skipped h2 */}
```

### ✅ Do This Instead
```javascript
// ✅ Good: semantic button
<button onClick={handleClick}>Click me</button>

// ✅ Good: button with label
<label htmlFor="name">Name</label>
<input id="name" type="text" />

// ✅ Good: text + visual indicator
<span>❌ Error: Invalid input</span>

// ✅ Good: meaningful alt
<img src="medicine.jpg" alt="Aspirin 500mg tablet" />

// ✅ Good: visible to AT
<button>Help</button>

// ✅ Good: proper hierarchy
<h1>Page</h1>
<h2>Section</h2>
<h3>Subsection</h3>
```

## Component Examples

### Accessible Button
```javascript
<button
  aria-label="Save medication"
  aria-disabled={isLoading}
  disabled={isLoading}
  onClick={handleSave}
>
  {isLoading ? 'Saving...' : 'Save'}
</button>
```

### Accessible Form
```javascript
<FormField
  label="Medication Name"
  id="med-name"
  required={true}
  error={errors.name}
  description="Enter the full name of the medication"
>
  <input
    id="med-name"
    type="text"
    value={name}
    onChange={(e) => setName(e.target.value)}
    aria-describedby="med-name-description med-name-error"
  />
</FormField>
```

### Accessible Navigation
```javascript
<nav aria-label="Main navigation">
  <ul>
    {items.map(item => (
      <li key={item.id}>
        <Link 
          to={item.path}
          aria-current={isActive(item.path) ? 'page' : undefined}
        >
          {item.label}
        </Link>
      </li>
    ))}
  </ul>
</nav>
```

### Accessible List
```javascript
<ul role="list">
  {medicines.map(medicine => (
    <li key={medicine.id}>
      <h3>{medicine.name}</h3>
      <p>Dosage: {medicine.dosage}</p>
      <button aria-label={`Edit ${medicine.name}`}>Edit</button>
    </li>
  ))}
</ul>
```

## Documentation Requirements

### For Each Component
- [ ] Document keyboard navigation
- [ ] List ARIA attributes used
- [ ] Show accessibility example
- [ ] Note any screen reader considerations
- [ ] Include focus management details

### Example Component Doc
```javascript
/**
 * MedicineCard - Accessible medicine information card
 * 
 * Keyboard Navigation:
 * - Tab: Move between card elements
 * - Enter: Activate buttons
 * 
 * ARIA:
 * - Uses heading for card title
 * - Buttons have aria-label
 * - Status updates use aria-live
 * 
 * Screen Reader:
 * - All information available without images
 * - Status changes announced
 * 
 * @example
 * <MedicineCard 
 *   medicine={{name: "Aspirin", dosage: "500mg"}}
 *   onEdit={handleEdit}
 * />
 */
```

## Accessibility Audit Checklist

### Pre-Deployment
- [ ] All pages keyboard navigable
- [ ] NVDA announces all content
- [ ] Focus indicators visible
- [ ] Contrast ratios meet WCAG AA
- [ ] No images without alt text
- [ ] Forms have proper labels
- [ ] Error messages clear
- [ ] Mobile screen reader works
- [ ] All links have descriptive text
- [ ] Color not sole identifier

### Code Review
- [ ] No `role` misuse
- [ ] Proper heading hierarchy
- [ ] Semantic HTML used
- [ ] ARIA only when needed
- [ ] Focus management correct
- [ ] No keyboard traps
- [ ] Settings used properly
- [ ] Announcements implemented
- [ ] No unused ARIA
- [ ] Code is clean and maintainable

## Resources

### Quick Links
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Resources](https://webaim.org/)

### Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [NVDA](https://www.nvaccess.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

## Getting Help

### In Project
- Check `ACCESSIBILITY_GUIDE.md`
- Review component examples
- Ask accessibility team

### External
- Read WCAG 2.1 quickref
- Check MDN Accessibility guides
- Test with actual users with disabilities

---

**Remember**: Accessibility is not an afterthought—it's a core feature! 🎉
