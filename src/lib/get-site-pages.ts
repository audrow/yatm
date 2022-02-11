import Sitemapper from 'sitemapper'
import urlJoin from 'proper-url-join'

import type Page from '../__types__/Page'

export default async function getSitePages(
  distro: string,
  baseUrl: string,
  sections: string[],
) {
  const pages = await processSitemap(distro, baseUrl)
  sections = sections.map((s) => s.toLowerCase())
  return pages.filter((p) => sections.some((s) => p.labels.includes(s)))
}

async function processSitemap(distro: string, baseUrl: string) {
  const distroUrl = urlJoin(baseUrl, distro)
  const distroSitemapUrl = urlJoin(distroUrl, 'sitemap.xml')
  const distroSitemap = await getSitemap(distroSitemapUrl)

  if (!distroSitemap) {
    throw new Error('Could not fetch distro sitemap')
  }
  const pages: Page[] = distroSitemap.map((url) => {
    const match = url.match(distroUrl + '/(.+).html')
    if (!match) {
      throw new Error(`Could not parse url ${url}`)
    }
    const urlParts = match[1].split('/')
    const name = urlParts.pop()?.replace(/-/g, ' ')
    if (!name) {
      throw new Error(`Could not parse url ${url}`)
    }
    const labels = urlParts.map((p) => p.toLowerCase())
    return {
      url,
      name,
      labels,
    }
  })
  return pages
}

async function getSitemap(sitemapUrl: string) {
  const sitemapper = new Sitemapper({
    url: sitemapUrl,
  })
  try {
    const {sites} = await sitemapper.fetch()
    return sites
  } catch (error) {
    console.error(error)
  }
}
