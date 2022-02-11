import endent from 'endent'

import type Page from './__types__/Page'
import type Issue from './__types__/Issue'

export default function makeIssues(
  pages: Page[],
  platforms: string[],
  generatedStamp: string,
): Issue[] {
  const issues: Issue[] = []
  platforms.forEach((platform) => {
    pages.forEach((page) => {
      const issue = makeIssue(page, platform, generatedStamp)
      issues.push(issue)
    })
  })
  return issues
}

function makeIssue(page: Page, platform: string, generatedStamp: string) {
  platform = platform.toLowerCase()
  const platformLabel = platform.replace(/ /g, '-')
  const capitalizedPlatform =
    platform.charAt(0).toUpperCase() + platform.slice(1)
  const title = `[${platform}] ${page.name}`
  const body = endent`
  Does the following page work on ${capitalizedPlatform}?
  [${page.url}](${page.url})

  Here are some thoughts on how to test the page:

  1. Make sure that you assign yourself to this issue.
  2. Try to follow the page on ${capitalizedPlatform}. If everything works, close this issue :tada:
  3. If something on the page doesn't work or isn't correct
     1. Assign a label to the issue, such as \`bug\` or \`documentation-needs-update\`
     2. Write a comment on this issue explaining what's wrong (note, Github let's you include images or videos in comments).
  4. If you make a PR fixing the issue, make sure to add a comment linking to the PR.
  5. Once the page is fixed, close this issue :thumbsup:

  ${generatedStamp}
  `
  return {
    title,
    body,
    labels: [...page.labels, platformLabel],
  }
}

async function main() {
  const getPages = (await import('./lib/get-site-pages')).default
  const distro = 'rolling'
  const baseUrl = 'https://docs.ros.org/en/'
  const sections: string[] = ['Install', 'Tutorials', 'How-to-guide']
  const platforms = ['ubuntu', 'windows']
  const generatedStamp = 'generated by @audrow'

  const pages = await getPages(distro, baseUrl, sections)
  const issues = makeIssues(pages, platforms, generatedStamp)
  console.log(issues.slice(0, 10))
}

if (typeof require !== 'undefined' && require.main === module) {
  main()
}
