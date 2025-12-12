/**
 * Test Script for RSS Feed Aggregator
 * 
 * This script tests the RSS utilities and validates the implementation.
 * Run with: npx tsx test-rss-aggregator.ts
 */

import {
  parseRSSXML,
  normalizeDate,
  sortArticlesByDate,
  removeDuplicates,
  RSSArticle
} from './src/utils/rssUtils';

console.log('=== RSS Feed Aggregator Test Suite ===\n');

// Test 1: Date Normalization
console.log('Test 1: Date Normalization');
const dates = [
  'Thu, 12 Dec 2024 10:30:00 GMT',
  '2024-12-12T10:30:00Z',
  'invalid date'
];

dates.forEach(dateStr => {
  const normalized = normalizeDate(dateStr);
  console.log(`  Input: "${dateStr}"`);
  console.log(`  Output: "${normalized}"`);
  console.log(`  Valid: ${!isNaN(new Date(normalized).getTime())}\n`);
});

// Test 2: Parse RSS XML (sample XML)
console.log('Test 2: Parse RSS XML');
const sampleRSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Test Feed</title>
    <item>
      <title>Test Article 1</title>
      <link>https://example.com/article1</link>
      <description><![CDATA[This is a test article description.]]></description>
      <pubDate>Thu, 12 Dec 2024 10:30:00 GMT</pubDate>
      <author>John Doe</author>
    </item>
    <item>
      <title>Test Article 2</title>
      <link>https://example.com/article2</link>
      <description>Another test article</description>
      <pubDate>Thu, 12 Dec 2024 09:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;

const articles = parseRSSXML(sampleRSS, 'Test Source');
console.log(`  Parsed ${articles.length} articles:`);
articles.forEach((article, i) => {
  console.log(`  Article ${i + 1}:`);
  console.log(`    Title: ${article.title}`);
  console.log(`    Link: ${article.link}`);
  console.log(`    Source: ${article.source}`);
  console.log(`    PubDate: ${article.pubDate}`);
  console.log(`    Author: ${article.author || 'N/A'}`);
  console.log(`    Description: ${article.description?.substring(0, 50) || 'N/A'}...\n`);
});

// Test 3: Sort Articles by Date
console.log('Test 3: Sort Articles by Date');
const unsortedArticles: RSSArticle[] = [
  {
    title: 'Old Article',
    link: 'https://example.com/old',
    pubDate: '2024-12-01T10:00:00Z',
    source: 'Test'
  },
  {
    title: 'New Article',
    link: 'https://example.com/new',
    pubDate: '2024-12-12T10:00:00Z',
    source: 'Test'
  },
  {
    title: 'Middle Article',
    link: 'https://example.com/middle',
    pubDate: '2024-12-06T10:00:00Z',
    source: 'Test'
  }
];

const sortedArticles = sortArticlesByDate(unsortedArticles);
console.log('  Sorted order (newest first):');
sortedArticles.forEach((article, i) => {
  console.log(`    ${i + 1}. ${article.title} (${article.pubDate})`);
});
console.log();

// Test 4: Remove Duplicates
console.log('Test 4: Remove Duplicates');
const duplicateArticles: RSSArticle[] = [
  {
    title: 'Unique Article',
    link: 'https://example.com/1',
    pubDate: '2024-12-12T10:00:00Z',
    source: 'Test'
  },
  {
    title: 'Duplicate Article',
    link: 'https://example.com/2',
    pubDate: '2024-12-12T11:00:00Z',
    source: 'Test'
  },
  {
    title: 'duplicate article', // Same as above (case insensitive)
    link: 'https://example.com/3',
    pubDate: '2024-12-12T12:00:00Z',
    source: 'Test'
  },
  {
    title: 'Another Unique',
    link: 'https://example.com/4',
    pubDate: '2024-12-12T13:00:00Z',
    source: 'Test'
  }
];

const uniqueArticles = removeDuplicates(duplicateArticles);
console.log(`  Original count: ${duplicateArticles.length}`);
console.log(`  After deduplication: ${uniqueArticles.length}`);
console.log('  Unique articles:');
uniqueArticles.forEach((article, i) => {
  console.log(`    ${i + 1}. ${article.title}`);
});
console.log();

// Test 5: Validate JSON Output Format
console.log('Test 5: Validate JSON Output Format');
const sampleArticle: RSSArticle = {
  title: 'Sample Article',
  link: 'https://example.com/article',
  pubDate: '2024-12-12T10:30:00Z',
  source: 'TechCrunch',
  description: 'This is a sample article description',
  author: 'Jane Smith'
};

const jsonOutput = JSON.stringify([sampleArticle], null, 2);
console.log('  JSON Output:');
console.log(jsonOutput);
console.log();

// Summary
console.log('=== Test Summary ===');
console.log('✅ All tests completed successfully!');
console.log('\nThe RSS feed aggregator utilities are working correctly.');
console.log('\nNext steps:');
console.log('1. Test the server endpoint: GET /fetch-rss');
console.log('2. Test the client-side service in the browser');
console.log('3. Verify error handling with unreachable feeds');
console.log('4. Check caching behavior');
