# 🤖 TGPC Webinar Automation System

## Overview

This automation system automatically removes outdated webinar dates from the TGPC documentation platform, ensuring that users always see current, accurate information without manual maintenance.

## 🎯 What It Does

- **Daily Automation:** Runs every day at 1:00 AM UTC
- **Smart Removal:** Automatically removes past webinar dates
- **Multi-File Updates:** Updates all documentation files consistently
- **Zero Maintenance:** No manual intervention required
- **Git Integration:** Automatically commits and pushes changes

## 📁 System Components

```
automation/
├── webinar-schedule.json    # Central data source (30 webinars)
├── update-webinars.js      # Main update script
├── test-automation.js      # Comprehensive test suite
└── README.md              # This documentation

.github/workflows/
└── update-webinars.yml    # GitHub Action workflow
```

## 📊 Current Schedule (as of October 13, 2025)

- **Total Webinars:** 26 remaining
- **Flipping:** 11 sessions
- **Deal Sourcing:** 10 sessions  
- **YPN:** 5 sessions
- **Next Updates:** Daily at 1:00 AM UTC

### Upcoming Webinars
- **Next Flipping:** Wednesday 15th October 2025
- **Next Deal Sourcing:** Sunday 19th October 2025
- **Next YPN:** Tuesday 21st October 2025 (Deal Sourcing)

## 🔄 How It Works

### 1. **Daily Check**
- GitHub Action triggers at 1:00 AM UTC
- Script loads `webinar-schedule.json`
- Compares all webinar dates against current date

### 2. **Smart Removal**
- Identifies webinars that have passed
- Removes outdated entries from schedule
- Updates metadata (counts, last updated date)

### 3. **File Updates**
- Updates next webinar information across all files:
  - `webinars/index.mdx` (main overview)
  - `webinars/flipping.mdx` (flipping schedule)
  - `webinars/deal-sourcing.mdx` (deal sourcing schedule)
  - `webinars/ypn-webinars.mdx` (YPN schedule)
  - `free-resources/index.mdx` (masterclass dates)

### 4. **Git Commit**
- Automatically commits changes with detailed message
- Pushes to main branch
- Deploys updates to live site

## 🚀 Manual Usage

### Run Update Script Locally
```bash
# Test the update script
node automation/update-webinars.js

# Run comprehensive tests
node automation/test-automation.js
```

### Trigger GitHub Action Manually
1. Go to **Actions** tab in GitHub repository
2. Select **"🤖 Auto-Update Webinar Schedules"**
3. Click **"Run workflow"**
4. Choose options:
   - **Dry Run:** Test without committing changes
   - **Normal Run:** Execute full update process

## 📋 Files Updated Automatically

| File | Purpose | Update Type |
|------|---------|-------------|
| `webinars/index.mdx` | Main webinar overview | Next webinar dates |
| `webinars/flipping.mdx` | Flipping schedule | Next session info |
| `webinars/deal-sourcing.mdx` | Deal sourcing schedule | Next session info |
| `webinars/ypn-webinars.mdx` | YPN schedule | Next session info |
| `free-resources/index.mdx` | Free masterclasses | Next session dates |
| `automation/webinar-schedule.json` | Central schedule | Remove past dates |

## 🔧 Configuration

### Schedule Data Structure
```json
{
  "flipping": [
    {
      "date": "2025-10-15",
      "time": "19:00",
      "day": "Wednesday",
      "formatted": "Wednesday 15th October 2025",
      "status": "upcoming"
    }
  ],
  "deal-sourcing": [...],
  "ypn": [...],
  "metadata": {
    "last_updated": "2025-10-12",
    "total_webinars": 26,
    "flipping_count": 11,
    "deal_sourcing_count": 10,
    "ypn_count": 5
  }
}
```

### Special Cases Handled
- **Different Times:** Monday 22nd December at 12:30 PM
- **Tentative Dates:** Sunday 14th December (HYROX dependent)
- **YPN Types:** Separate tracking for Flipping vs Deal Sourcing

## 🧪 Testing

### Automated Tests Include:
1. **JSON Validation:** Schedule file structure
2. **Data Structure:** Required fields present
3. **Chronological Order:** Dates in correct sequence
4. **Future Dates:** No past dates remaining
5. **Metadata Accuracy:** Counts match actual data
6. **File Existence:** All documentation files present

### Run Tests
```bash
# Run full test suite
node automation/test-automation.js

# Expected output: "🎉 ALL TESTS PASSED!"
```

## 📈 Benefits

### Operational
- **Zero Manual Work:** Eliminates updating 5+ files manually
- **100% Consistency:** All pages always show identical information
- **Error Prevention:** Impossible for outdated dates to remain
- **Time Savings:** Hours of manual work eliminated monthly

### User Experience
- **Always Current:** Users never see outdated information
- **Professional Image:** Maintains credibility and trust
- **Better Conversions:** Accurate dates improve registration rates
- **Reduced Support:** Fewer questions about incorrect dates

### Technical
- **Version Controlled:** All changes tracked in Git
- **Auditable:** Clear log of when webinars were removed
- **Scalable:** Easy to add new webinar types
- **Reliable:** Runs automatically without human intervention

## 🚨 Monitoring & Alerts

### Success Indicators
- ✅ Daily GitHub Action runs successfully
- ✅ No outdated webinars visible on site
- ✅ Consistent information across all pages
- ✅ Automatic commits with detailed messages

### Failure Scenarios
- ❌ GitHub Action fails to run
- ❌ Script encounters errors
- ❌ Git push fails
- ❌ Schedule file becomes corrupted

### Alert Channels
- GitHub Action failure notifications
- Repository commit history
- Workflow summary reports
- Manual monitoring dashboard

## 🔮 Future Enhancements

### Planned Improvements
1. **Slack Notifications:** Alert team of updates
2. **Email Reminders:** Notify before webinars
3. **Calendar Integration:** Sync with Google Calendar
4. **Analytics Tracking:** Monitor automation performance
5. **Advanced Scheduling:** Handle recurring patterns

### Extensibility
- **New Webinar Types:** Easy to add new categories
- **Custom Time Zones:** Support multiple regions
- **Batch Operations:** Handle bulk schedule changes
- **API Integration:** Connect to external systems

## 📞 Support

### Common Issues

**Q: Automation stopped working?**
A: Check GitHub Actions tab for error logs

**Q: Wrong dates showing?**
A: Verify `webinar-schedule.json` has correct data

**Q: Need to add new webinars?**
A: Update `webinar-schedule.json` and commit changes

**Q: Manual override needed?**
A: Run script locally or trigger GitHub Action manually

### Contact
For system issues or enhancements, contact the development team or create a GitHub issue.

---

**System Status:** ✅ Active and Running  
**Last Updated:** October 13, 2025  
**Next Scheduled Run:** Daily at 1:00 AM UTC  
**Current Webinars:** 26 remaining through December 2025
