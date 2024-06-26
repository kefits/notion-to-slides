#!/usr/bin/env node

import yargs from 'yargs';
import fs from 'fs';
import { tmpdir } from 'os';
import notion2md from './notion2md.js';
import md2slides from './md2slides.js';
import { getPageId } from './utils.js';
import open from 'open'; // ESモジュール形式のインポート

const args = yargs(process.argv.slice(2))
  .scriptName('notion2slides')
  .usage('Usage: $0 <command> [options]')
  .option('url', {
    alias: 'u',
    describe: 'The url of the Notion page to convert',
    type: 'string',
    demandOption: true
  })
  .option('theme', {
    alias: 't',
    describe: 'The theme to use for the slides',
    type: 'string',
    default: 'default',
    demandOption: false
  })
  .help()
  .parseSync();

// check the env variable
const NOTION_TOKEN: string | undefined = process.env.NOTION_TOKEN;
if (!NOTION_TOKEN) {
  console.error('Please set the NOTION_TOKEN env variable');
  process.exit(1);
}

// get the url and extract page id from it
const url = args.url as string;
const pageId = getPageId(url);

// get the theme from the --theme flag
const theme = args.theme as string;

// download the page and convert it to markdown slides
(async () => {
  const mdString = await notion2md(pageId, NOTION_TOKEN);
  const htmlString = md2slides(mdString, theme);
  const tmpFilePath = tmpdir() + `/${pageId}.html`;
  fs.writeFileSync(tmpFilePath, htmlString);
//  open(tmpFilePath);
})();
