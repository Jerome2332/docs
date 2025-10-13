#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Webinar Automation System...\n');

// Test 1: Verify schedule file exists and is valid JSON
console.log('📋 Test 1: Schedule File Validation');
const scheduleFile = path.join(__dirname, 'webinar-schedule.json');

if (!fs.existsSync(scheduleFile)) {
  console.log('❌ FAIL: webinar-schedule.json not found');
  process.exit(1);
}

let schedule;
try {
  schedule = JSON.parse(fs.readFileSync(scheduleFile, 'utf8'));
  console.log('✅ PASS: Schedule file is valid JSON');
} catch (error) {
  console.log('❌ FAIL: Schedule file is invalid JSON');
  console.log('Error:', error.message);
  process.exit(1);
}

// Test 2: Verify schedule structure
console.log('\n📊 Test 2: Schedule Structure Validation');
const requiredSections = ['flipping', 'deal-sourcing', 'ypn', 'metadata'];
const missingSections = requiredSections.filter(section => !schedule[section]);

if (missingSections.length > 0) {
  console.log(`❌ FAIL: Missing sections: ${missingSections.join(', ')}`);
  process.exit(1);
}
console.log('✅ PASS: All required sections present');

// Test 3: Verify webinar data structure
console.log('\n🗓️ Test 3: Webinar Data Structure');
const requiredFields = ['date', 'time', 'day', 'formatted', 'status'];

function validateWebinars(webinars, type) {
  for (const webinar of webinars) {
    const missingFields = requiredFields.filter(field => !webinar[field]);
    if (missingFields.length > 0) {
      console.log(`❌ FAIL: ${type} webinar missing fields: ${missingFields.join(', ')}`);
      return false;
    }
    
    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(webinar.date)) {
      console.log(`❌ FAIL: ${type} webinar has invalid date format: ${webinar.date}`);
      return false;
    }
    
    // Validate time format (HH:MM)
    if (!/^\d{2}:\d{2}$/.test(webinar.time)) {
      console.log(`❌ FAIL: ${type} webinar has invalid time format: ${webinar.time}`);
      return false;
    }
  }
  return true;
}

if (!validateWebinars(schedule.flipping, 'Flipping')) process.exit(1);
if (!validateWebinars(schedule['deal-sourcing'], 'Deal Sourcing')) process.exit(1);
if (!validateWebinars(schedule.ypn, 'YPN')) process.exit(1);

console.log('✅ PASS: All webinar data structures are valid');

// Test 4: Verify dates are in chronological order
console.log('\n📅 Test 4: Chronological Order Validation');

function validateChronologicalOrder(webinars, type) {
  for (let i = 1; i < webinars.length; i++) {
    const prevDate = new Date(webinars[i-1].date);
    const currDate = new Date(webinars[i].date);
    
    if (currDate < prevDate) {
      console.log(`❌ FAIL: ${type} webinars not in chronological order`);
      console.log(`  ${webinars[i-1].formatted} comes before ${webinars[i].formatted}`);
      return false;
    }
  }
  return true;
}

if (!validateChronologicalOrder(schedule.flipping, 'Flipping')) process.exit(1);
if (!validateChronologicalOrder(schedule['deal-sourcing'], 'Deal Sourcing')) process.exit(1);
if (!validateChronologicalOrder(schedule.ypn, 'YPN')) process.exit(1);

console.log('✅ PASS: All webinars are in chronological order');

// Test 5: Verify no past dates (all should be future)
console.log('\n⏰ Test 5: Future Dates Validation');
const today = new Date();
today.setHours(0, 0, 0, 0);

function validateFutureDates(webinars, type) {
  for (const webinar of webinars) {
    const webinarDate = new Date(webinar.date);
    webinarDate.setHours(0, 0, 0, 0);
    
    if (webinarDate < today) {
      console.log(`❌ FAIL: ${type} has past date: ${webinar.formatted}`);
      return false;
    }
  }
  return true;
}

if (!validateFutureDates(schedule.flipping, 'Flipping')) process.exit(1);
if (!validateFutureDates(schedule['deal-sourcing'], 'Deal Sourcing')) process.exit(1);
if (!validateFutureDates(schedule.ypn, 'YPN')) process.exit(1);

console.log('✅ PASS: All webinar dates are in the future');

// Test 6: Verify metadata accuracy
console.log('\n📊 Test 6: Metadata Accuracy');
const actualTotal = schedule.flipping.length + schedule['deal-sourcing'].length + schedule.ypn.length;

if (schedule.metadata.total_webinars !== actualTotal) {
  console.log(`❌ FAIL: Metadata total (${schedule.metadata.total_webinars}) doesn't match actual (${actualTotal})`);
  process.exit(1);
}

if (schedule.metadata.flipping_count !== schedule.flipping.length) {
  console.log(`❌ FAIL: Metadata flipping count incorrect`);
  process.exit(1);
}

if (schedule.metadata.deal_sourcing_count !== schedule['deal-sourcing'].length) {
  console.log(`❌ FAIL: Metadata deal sourcing count incorrect`);
  process.exit(1);
}

if (schedule.metadata.ypn_count !== schedule.ypn.length) {
  console.log(`❌ FAIL: Metadata YPN count incorrect`);
  process.exit(1);
}

console.log('✅ PASS: Metadata is accurate');

// Test 7: Verify documentation files exist
console.log('\n📄 Test 7: Documentation Files Validation');
const requiredFiles = [
  'webinars/index.mdx',
  'webinars/flipping.mdx',
  'webinars/deal-sourcing.mdx',
  'webinars/ypn-webinars.mdx',
  'free-resources/index.mdx'
];

const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));

if (missingFiles.length > 0) {
  console.log(`❌ FAIL: Missing documentation files: ${missingFiles.join(', ')}`);
  process.exit(1);
}

console.log('✅ PASS: All documentation files exist');

// Test Summary
console.log('\n🎉 ALL TESTS PASSED!');
console.log('\n📊 Current Schedule Summary:');
console.log(`   Total Webinars: ${schedule.metadata.total_webinars}`);
console.log(`   Flipping: ${schedule.flipping.length}`);
console.log(`   Deal Sourcing: ${schedule['deal-sourcing'].length}`);
console.log(`   YPN: ${schedule.ypn.length}`);
console.log(`   Last Updated: ${schedule.metadata.last_updated}`);

// Show next webinars
if (schedule.flipping.length > 0) {
  console.log(`\n🎯 Next Flipping: ${schedule.flipping[0].formatted}`);
}
if (schedule['deal-sourcing'].length > 0) {
  console.log(`🎯 Next Deal Sourcing: ${schedule['deal-sourcing'][0].formatted}`);
}
if (schedule.ypn.length > 0) {
  console.log(`🎯 Next YPN: ${schedule.ypn[0].formatted} (${schedule.ypn[0].type})`);
}

console.log('\n✅ Automation system is ready for deployment!');
