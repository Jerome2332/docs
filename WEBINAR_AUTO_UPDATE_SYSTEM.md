# Webinar Auto-Update System Design

## Overview

This document outlines a system to automatically remove outdated webinar dates and maintain current schedules across the TGPC documentation platform.

## Problem Statement

Currently, webinar dates are manually maintained across multiple files:
- `webinars/index.mdx` (main overview)
- `webinars/flipping.mdx` (flipping schedule)
- `webinars/deal-sourcing.mdx` (deal sourcing schedule)
- `webinars/ypn-webinars.mdx` (YPN schedule)
- `free-resources/index.mdx` (masterclass dates)

**Issues:**
- Manual updates required across 5+ files
- Risk of outdated dates remaining visible
- Inconsistencies between different pages
- Time-consuming maintenance process

## Proposed Solution

### Option 1: GitHub Actions Automation (Recommended)

**Implementation:**
1. **Central Data Source:** Create a `webinar-schedule.json` file containing all webinar dates
2. **Automated Script:** GitHub Action runs daily to:
   - Check current date against webinar schedule
   - Remove past webinars from the JSON file
   - Update all documentation files automatically
   - Commit changes to repository

**Benefits:**
- Fully automated
- Consistent across all files
- Version controlled
- No manual intervention required

### Option 2: Dynamic Content Generation

**Implementation:**
1. **API Integration:** Connect to calendar/scheduling system
2. **Build-Time Generation:** Generate webinar content during site build
3. **Template System:** Use templates that populate with current data

**Benefits:**
- Real-time accuracy
- Single source of truth
- Scalable solution

### Option 3: Hybrid Manual + Automation

**Implementation:**
1. **Centralized Schedule File:** Single JSON/YAML file with all dates
2. **Manual Updates:** Team updates central file only
3. **Automated Distribution:** Script distributes to all documentation files

**Benefits:**
- Maintains manual control
- Reduces update locations from 5+ to 1
- Semi-automated distribution

## Recommended Implementation: Option 1

### File Structure
```
/automation/
├── webinar-schedule.json          # Central data source
├── update-webinars.js            # Update script
└── .github/workflows/
    └── update-webinars.yml       # GitHub Action
```

### Central Data File (`webinar-schedule.json`)
```json
{
  "flipping": [
    {
      "date": "2025-10-15",
      "time": "19:00",
      "day": "Tuesday",
      "formatted": "Tuesday 15th October 2025",
      "status": "upcoming"
    },
    {
      "date": "2025-10-20",
      "time": "19:00", 
      "day": "Monday",
      "formatted": "Monday 20th October 2025",
      "status": "upcoming"
    }
  ],
  "deal-sourcing": [
    {
      "date": "2025-10-12",
      "time": "19:00",
      "day": "Sunday", 
      "formatted": "Sunday 12th October 2025",
      "status": "upcoming"
    }
  ],
  "ypn": [
    {
      "date": "2025-09-03",
      "time": "19:00",
      "day": "Wednesday",
      "formatted": "Wednesday 3rd September 2025", 
      "type": "YPN Flipping Webinar",
      "status": "upcoming"
    }
  ]
}
```

### GitHub Action (`update-webinars.yml`)
```yaml
name: Update Webinar Dates
on:
  schedule:
    - cron: '0 1 * * *'  # Run daily at 1 AM UTC
  workflow_dispatch:      # Allow manual trigger

jobs:
  update-webinars:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Update webinar schedules
        run: node automation/update-webinars.js
        
      - name: Commit changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add .
          git diff --staged --quiet || git commit -m "Auto-update: Remove outdated webinars [$(date +'%Y-%m-%d')]"
          git push
```

### Update Script (`update-webinars.js`)
```javascript
const fs = require('fs');
const path = require('path');

// Load webinar schedule
const schedule = JSON.parse(fs.readFileSync('automation/webinar-schedule.json', 'utf8'));

// Get current date
const today = new Date();
today.setHours(0, 0, 0, 0);

// Function to remove outdated webinars
function removeOutdatedWebinars(webinars) {
  return webinars.filter(webinar => {
    const webinarDate = new Date(webinar.date);
    return webinarDate >= today;
  });
}

// Update schedule data
schedule.flipping = removeOutdatedWebinars(schedule.flipping);
schedule['deal-sourcing'] = removeOutdatedWebinars(schedule['deal-sourcing']);
schedule.ypn = removeOutdatedWebinars(schedule.ypn);

// Function to get next webinar
function getNextWebinar(webinars) {
  return webinars.length > 0 ? webinars[0] : null;
}

// Update documentation files
function updateFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  replacements.forEach(replacement => {
    content = content.replace(replacement.search, replacement.replace);
  });
  
  fs.writeFileSync(filePath, content);
}

// Update main webinars page
const nextFlipping = getNextWebinar(schedule.flipping);
const nextDealSourcing = getNextWebinar(schedule['deal-sourcing']);
const nextYPN = getNextWebinar(schedule.ypn);

if (nextFlipping) {
  updateFile('webinars/index.mdx', [
    {
      search: /\*\*Next:\*\* .+ at 7:00 PM UK time/g,
      replace: `**Next:** ${nextFlipping.formatted} at 7:00 PM UK time`
    }
  ]);
}

// Save updated schedule
fs.writeFileSync('automation/webinar-schedule.json', JSON.stringify(schedule, null, 2));

console.log('Webinar schedules updated successfully');
```

## Implementation Steps

### Phase 1: Setup (Week 1)
1. Create `automation/` directory structure
2. Create initial `webinar-schedule.json` with current dates
3. Develop and test update script locally
4. Create GitHub Action workflow

### Phase 2: Testing (Week 2)
1. Test automation on development branch
2. Verify all files update correctly
3. Test edge cases (no upcoming webinars, date formatting)
4. Manual verification of generated content

### Phase 3: Deployment (Week 3)
1. Deploy to main branch
2. Monitor first automated runs
3. Document system for team
4. Create manual override procedures

### Phase 4: Maintenance (Ongoing)
1. Monitor GitHub Action runs
2. Update schedule data as needed
3. Extend system for new webinar types
4. Performance optimization

## Benefits of This System

### Operational Benefits
- **Zero Manual Maintenance:** Webinars automatically removed after they occur
- **Consistency Guaranteed:** All pages always show identical information
- **Time Savings:** Eliminates manual updates across multiple files
- **Error Prevention:** Reduces risk of outdated information being displayed

### Technical Benefits
- **Version Controlled:** All changes tracked in Git history
- **Auditable:** Clear log of when webinars were removed
- **Extensible:** Easy to add new webinar types or pages
- **Reliable:** Runs automatically without human intervention

### Business Benefits
- **Professional Image:** Always current information
- **Improved User Experience:** No confusion from outdated dates
- **Reduced Support Queries:** Fewer questions about incorrect dates
- **Scalable Process:** System grows with business needs

## Alternative Approaches

### Manual Process Improvements
If automation isn't immediately feasible:

1. **Centralized Update Checklist:**
   - Create monthly task to review all webinar dates
   - Checklist of all files requiring updates
   - Standardized date format across all files

2. **Template System:**
   - Use consistent date variables
   - Single file with date definitions
   - Manual find/replace process

3. **Calendar Integration:**
   - Connect to Google Calendar or similar
   - Export upcoming dates monthly
   - Manual update from calendar export

## Monitoring and Alerts

### Success Metrics
- **Automation Success Rate:** % of successful daily runs
- **Date Accuracy:** Regular audits of displayed vs actual dates
- **User Feedback:** Reduced complaints about outdated information

### Alert System
- **Failed Runs:** Email notification if GitHub Action fails
- **No Upcoming Webinars:** Alert when schedule becomes empty
- **Manual Override:** Notification when manual changes detected

## Conclusion

The automated webinar update system will significantly improve the maintenance of TGPC's documentation platform while ensuring users always see current, accurate information. The recommended GitHub Actions approach provides the best balance of automation, reliability, and maintainability.

**Next Steps:**
1. Approve system design
2. Begin Phase 1 implementation
3. Set up development environment for testing
4. Create initial webinar schedule data file

---

*Document Version: 1.0*  
*Created: October 2025*  
*Status: Proposal - Awaiting Approval*
