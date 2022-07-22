# Web Scraper

You can get other people's websites and search them for data or updates

## Methodology

After we make the GET call with axios we can use JSDOM to create a mini-DOM from that HTML text and then query it like we would a normal web page!

## Usage

### Scraping

The URL is passed in as an environment variable, so you'd do:

```shell
TARGET_URL='https://www.thejump.tech/' node scrape.js
```

### Finding

The URL is passed in as an environment variable, so you'd do:

```shell
TARGET_URL='https://www.thejump.tech/' TARGET_TAG='h1' node find-tag.js
```