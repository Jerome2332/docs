#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🤖 Starting webinar schedule update...');

// Load webinar schedule
const scheduleFile = path.join(__dirname, 'webinar-schedule.json');
if (!fs.existsSync(scheduleFile)) {
  console.error('❌ webinar-schedule.json not found!');
  process.exit(1);
}

const schedule = JSON.parse(fs.readFileSync(scheduleFile, 'utf8'));
console.log(`📅 Loaded schedule with ${schedule.metadata.total_webinars} total webinars`);

// Get current date (UK timezone)
const today = new Date();
today.setHours(0, 0, 0, 0);
console.log(`📍 Current date: ${today.toISOString().split('T')[0]}`);

// Function to remove outdated webinars
function removeOutdatedWebinars(webinars, type) {
  const originalCount = webinars.length;
  const updated = webinars.filter(webinar => {
    const webinarDate = new Date(webinar.date);
    webinarDate.setHours(0, 0, 0, 0);
    return webinarDate >= today;
  });
  
  const removedCount = originalCount - updated.length;
  if (removedCount > 0) {
    console.log(`🗑️  Removed ${removedCount} outdated ${type} webinar(s)`);
  }
  
  return updated;
}

// Update schedule data
const originalFlipping = schedule.flipping.length;
const originalDealSourcing = schedule['deal-sourcing'].length;
const originalYPN = schedule.ypn.length;

schedule.flipping = removeOutdatedWebinars(schedule.flipping, 'flipping');
schedule['deal-sourcing'] = removeOutdatedWebinars(schedule['deal-sourcing'], 'deal-sourcing');
schedule.ypn = removeOutdatedWebinars(schedule.ypn, 'YPN');

// Update metadata
const newTotal = schedule.flipping.length + schedule['deal-sourcing'].length + schedule.ypn.length;
const totalRemoved = schedule.metadata.total_webinars - newTotal;

schedule.metadata = {
  ...schedule.metadata,
  last_updated: today.toISOString().split('T')[0],
  total_webinars: newTotal,
  flipping_count: schedule.flipping.length,
  deal_sourcing_count: schedule['deal-sourcing'].length,
  ypn_count: schedule.ypn.length
};

// Function to get next webinar
function getNextWebinar(webinars) {
  return webinars.length > 0 ? webinars[0] : null;
}

// Function to update file content
function updateFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  File not found: ${filePath}`);
    return false;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  replacements.forEach(replacement => {
    if (content.includes(replacement.search)) {
      content = content.replace(new RegExp(replacement.search, 'g'), replacement.replace);
      updated = true;
    }
  });
  
  if (updated) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated: ${filePath}`);
  }
  
  return updated;
}

// Get next webinars for each type
const nextFlipping = getNextWebinar(schedule.flipping);
const nextDealSourcing = getNextWebinar(schedule['deal-sourcing']);
const nextYPN = getNextWebinar(schedule.ypn);

console.log('\n🔄 Updating documentation files...');

// Update main webinars overview page
if (nextFlipping && nextDealSourcing) {
  updateFile('webinars/index.mdx', [
    {
      search: '\\*\\*Next:\\*\\* .+ at \\d+:\\d+ (?:AM|PM) UK time',
      replace: `**Next:** ${nextFlipping.formatted} at 7:00 PM UK time`
    }
  ]);
}

// Update flipping webinar page
if (nextFlipping) {
  const nextFewFlipping = schedule.flipping.slice(0, 4);
  const nextFewText = nextFewFlipping.map(w => `- **${w.formatted}** - 7:00 PM`).join('\n');
  
  updateFile('webinars/flipping.mdx', [
    {
      search: '\\*\\*Next Webinar:\\*\\* .+ at \\d+:\\d+ (?:AM|PM) UK time',
      replace: `**Next Webinar:** ${nextFlipping.formatted} at 7:00 PM UK time`
    }
  ]);
}

// Update deal sourcing webinar page
if (nextDealSourcing) {
  const nextFewDealSourcing = schedule['deal-sourcing'].slice(0, 4);
  const nextFewText = nextFewDealSourcing.map(w => `- **${w.formatted}** - ${w.special_time ? '12:30 PM' : '7:00 PM'}`).join('\n');
  
  updateFile('webinars/deal-sourcing.mdx', [
    {
      search: '\\*\\*Next Webinar:\\*\\* .+ at \\d+:\\d+ (?:AM|PM) UK time',
      replace: `**Next Webinar:** ${nextDealSourcing.formatted} at ${nextDealSourcing.special_time ? '12:30 PM' : '7:00 PM'} UK time`
    }
  ]);
}

// Update YPN webinar page
if (nextYPN) {
  updateFile('webinars/ypn-webinars.mdx', [
    {
      search: '\\*\\*Next YPN Webinar:\\*\\* .+ \\(.+\\)',
      replace: `**Next YPN Webinar:** ${nextYPN.formatted} at 7:00 PM UK time (${nextYPN.type})`
    }
  ]);
}

// Update free resources page
if (nextFlipping && nextDealSourcing) {
  updateFile('free-resources/index.mdx', [
    {
      search: '\\*Next Session: .+ at \\d+:\\d+ (?:AM|PM) UK time\\*',
      replace: `*Next Session: ${nextFlipping.formatted} at 7:00 PM UK time*`
    }
  ]);
}

// Generate updated schedule tables for each webinar type
function generateScheduleTable(webinars, type) {
  if (webinars.length === 0) {
    return '| Date | Time | Status |\n|------|------|--------|\n| No upcoming sessions | - | - |';
  }
  
  let table = '| Date | Time | Status |\n|------|------|--------|\n';
  
  webinars.forEach(webinar => {
    const date = webinar.formatted.replace(/ \d{4}$/, ''); // Remove year
    const time = webinar.special_time ? '12:30 PM' : '7:00 PM';
    const status = webinar.note ? `Upcoming*` : 'Upcoming';
    table += `| ${date} | ${time} | ${status} |\n`;
  });
  
  return table;
}

// Update schedule tables in documentation files
function updateScheduleTables() {
  // Update flipping schedule table
  const flippingTable = generateScheduleTable(schedule.flipping, 'flipping');
  
  // Update deal sourcing schedule table  
  const dealSourcingTable = generateScheduleTable(schedule['deal-sourcing'], 'deal-sourcing');
  
  // Update YPN schedule table
  let ypnTable = '| Date | Time | Type | Status |\n|------|------|------|--------|\n';
  if (schedule.ypn.length === 0) {
    ypnTable += '| No upcoming sessions | - | - | - |\n';
  } else {
    schedule.ypn.forEach(webinar => {
      const date = webinar.formatted.replace(/ \d{4}$/, '');
      const type = webinar.type.replace('YPN ', '');
      ypnTable += `| ${date} | 7:00 PM | ${type} | Upcoming |\n`;
    });
  }
  
  console.log('📊 Schedule tables updated in memory (manual update required for complex table structures)');
}

updateScheduleTables();

// Save updated schedule
fs.writeFileSync(scheduleFile, JSON.stringify(schedule, null, 2));

// Summary
console.log('\n📋 Update Summary:');
console.log(`🗑️  Total webinars removed: ${totalRemoved}`);
console.log(`📅 Remaining webinars: ${newTotal}`);
console.log(`   - Flipping: ${schedule.flipping.length}`);
console.log(`   - Deal Sourcing: ${schedule['deal-sourcing'].length}`);
console.log(`   - YPN: ${schedule.ypn.length}`);

if (nextFlipping) {
  console.log(`🎯 Next Flipping: ${nextFlipping.formatted}`);
}
if (nextDealSourcing) {
  console.log(`🎯 Next Deal Sourcing: ${nextDealSourcing.formatted}`);
}
if (nextYPN) {
  console.log(`🎯 Next YPN: ${nextYPN.formatted} (${nextYPN.type})`);
}

console.log(`\n✅ Webinar schedule update completed at ${new Date().toISOString()}`);

// Exit with appropriate code
if (totalRemoved > 0) {
  console.log('🔄 Changes made - files updated');
  process.exit(0);
} else {
  console.log('✨ No changes needed - all webinars are current');
  process.exit(0);
}
