import fs from 'fs'
import {join} from 'path'
import * as ros2 from 'ros2-cache'
import type GazeboDoc from './__types__/GazeboDoc'
import type GazeboRepoDocs from './__types__/GazeboRepoDocs'

export async function getGazeboLinks({
  docsRepo,
  worldsRepo,
  tutorials,
  cacheDir = '.cache',
}: {
  docsRepo: {
    url: string
    org: string
    name: string
    branch: string
    releaseName: string
  }
  worldsRepo: {
    url: string
    org: string
    name: string
    branch: string
    pathToWoldFiles: string
  }
  tutorials: {
    reposYamlUrl: string
    reposToSkip: string[]
  }
  cacheDir?: string
}): Promise<{
  repoDocs: GazeboRepoDocs[]
  errorText?: string
}> {
  ros2.cache.makeCacheDir({path: cacheDir})

  const gzDocs = await getGzDocs({
    cacheDir,
    releaseName: docsRepo.releaseName,
    branch: docsRepo.branch,
    repoUrl: docsRepo.url,
  })

  const gzRepos = await getGzTutorialDocs({
    cacheDir,
    reposYamlUrl: tutorials.reposYamlUrl,
    reposToSkip: tutorials.reposToSkip,
  })

  const gzWorld = await getGzWorlds({
    cacheDir,
    repoUrl: worldsRepo.url,
    branch: worldsRepo.branch,
    org: worldsRepo.org,
    repo: worldsRepo.name,
    relativePath: worldsRepo.pathToWoldFiles,
  })

  const gzAll = [gzDocs, ...gzRepos, gzWorld]
  // console.log(JSON.stringify(gzAll, null, 2))
  let errorText: string | undefined
  if (gzAll.some((gz) => gz.errors.length > 0)) {
    errorText = '\nErrors\n======\n'
    gzAll.forEach((gz) => {
      if (gz.errors.length > 0) {
        errorText += `Errors in ${gz.org}/${gz.repo}:\n`
        gz.errors.forEach((error) => (errorText += ` * ${error}\n`))
        errorText += '\n'
      }
    })
  }
  return {
    repoDocs: gzAll,
    errorText,
  }
}

async function getGzWorlds({
  cacheDir,
  repoUrl,
  org,
  repo,
  branch,
  relativePath,
}: {
  cacheDir: string
  repoUrl: string
  org: string
  repo: string
  branch: string
  relativePath: string
}) {
  const gzWorlds: GazeboRepoDocs = {
    org,
    repo,
    branch,
    localPath: join(cacheDir, org, repo),
    docs: [],
    errors: [],
  }
  const errorMessage = await cloneRepo({
    repoUrl,
    destinationPath: gzWorlds.localPath,
    branch: gzWorlds.branch,
  })
  if (errorMessage) {
    gzWorlds.errors.push(errorMessage)
    return gzWorlds
  }
  const worldsPath = join(gzWorlds.localPath, relativePath)
  let files: string[] = []
  try {
    files = fs.readdirSync(worldsPath)
  } catch (_: unknown) {
    gzWorlds.errors.push(`Could not read the ${relativePath} directory`)
  }
  files.forEach((file) => {
    const filePath = join(worldsPath, file)
    if (fs.statSync(filePath).isDirectory()) {
      return
    } else if (!file.endsWith('.sdf')) {
      gzWorlds.errors.push(`Skipping '${file}' since it is not an SDF file`)
      return
    }
    const doc: GazeboDoc = {
      localPath: filePath,
      handle: filePath,
      sourceUrl: `https://github.com/${org}/${repo}/tree/${branch}/${relativePath}/${file}`,
    }
    gzWorlds.docs.push(doc)
  })
  return gzWorlds
}

async function getGzDocs({
  cacheDir,
  repoUrl,
  releaseName,
  org = 'gazebosim',
  repo = 'docs',
  branch = 'master',
}: {
  cacheDir: string
  repoUrl: string
  releaseName: string
  org?: string
  repo?: string
  branch?: string
}) {
  const gzDoc: GazeboRepoDocs = {
    org,
    repo,
    branch,
    localPath: join(cacheDir, org, repo),
    docs: [],
    errors: [],
  }
  const errorMessage = await cloneRepo({
    repoUrl,
    destinationPath: gzDoc.localPath,
    branch: gzDoc.branch,
  })
  if (errorMessage) {
    gzDoc.errors.push(errorMessage)
    return gzDoc
  }

  const docsPath = join(gzDoc.localPath, releaseName)
  let files: string[] = []
  try {
    files = fs.readdirSync(docsPath)
  } catch (_: unknown) {
    gzDoc.errors.push(`Could not read the ${releaseName} directory`)
  }

  files.forEach((file) => {
    const filePath = join(docsPath, file)
    if (fs.statSync(filePath).isDirectory()) {
      return
    } else if (!file.endsWith('.md')) {
      gzDoc.errors.push(`Skipping '${file}' since it is not a markdown file`)
      return
    }
    const fileNoExt = file.replace('.md', '')
    const relativePath = join(releaseName, file)
    const relativePathNoExt = join(releaseName, fileNoExt)
    const liveUrl = `https://gazebosim.org/docs/${relativePathNoExt}`
    const sourceUrl = `https://github.com/${org}/${repo}/tree/${branch}/${relativePath}`
    const doc: GazeboDoc = {
      localPath: filePath,
      handle: fileNoExt,
      liveUrl,
      sourceUrl,
    }
    gzDoc.docs.push(doc)
  })

  return gzDoc
}

async function getGzTutorialDocs({
  cacheDir,
  reposYamlUrl,
  reposToSkip = [],
  tutorialsDirectory = 'tutorials',
}: {
  cacheDir: string
  reposYamlUrl: string
  reposToSkip?: string[]
  tutorialsDirectory?: string
}) {
  const reposYamlPath = join(cacheDir, 'repos.yaml')
  await ros2.cache.downloadFile({
    url: reposYamlUrl,
    path: reposYamlPath,
  })
  const repos = ros2.reposFile.getRepos(reposYamlPath).filter((repo) => {
    return !reposToSkip.includes(repo.name)
  })

  const gzRepos: GazeboRepoDocs[] = []
  for (const repo of repos) {
    const gzRepo: GazeboRepoDocs = {
      org: repo.org,
      repo: repo.name,
      branch: repo.version,
      majorVersion: getNumber(repo.version),
      localPath: join(cacheDir, repo.org, repo.name),
      docs: [],
      errors: [],
    }

    const errorMessage = await cloneRepo({
      repoUrl: repo.url,
      destinationPath: gzRepo.localPath,
      branch: gzRepo.branch,
    })
    if (errorMessage) {
      gzRepo.errors.push(errorMessage)
    }

    const gzWebsiteRef = repo.name.replace(/gz-/, '')
    const readmePath = join(gzRepo.localPath, 'README.md')
    if (fs.existsSync(readmePath)) {
      const readmeDoc: GazeboDoc = {
        localPath: readmePath,
        handle: 'README',
        liveUrl: `https://gazebosim.org/libs/${gzWebsiteRef}`,
        sourceUrl: `https://github.com/${gzRepo.org}/${gzRepo.repo}/blob/${gzRepo.branch}/README.md`,
      }
      gzRepo.docs.push(readmeDoc)
    }

    const localTutorialsPath = join(gzRepo.localPath, tutorialsDirectory)

    let files: string[] = []
    try {
      files = fs.readdirSync(localTutorialsPath)
    } catch (_: unknown) {
      gzRepo.errors.push('Could not read the tutorials directory')
    }
    files.forEach((file) => {
      const filePath = join(localTutorialsPath, file)
      if (fs.statSync(filePath).isDirectory()) {
        return
      }
      const relativePath = join(tutorialsDirectory, file)
      const fileText = fs.readFileSync(filePath, 'utf8')
      const match = fileText.match(/\\page\s([a-zA-Z_0-9]+)\s/)
      if (!match) {
        gzRepo.errors.push(`Skipping ${file}: Could not find a \\page handle`)
        return
      } else if (!file.endsWith('.md')) {
        gzRepo.errors.push(`Skipping '${file}' since it is not a markdown file`)
        return
      }
      const handle = match![1]
      const liveUrl = `https://gazebosim.org/api/${gzWebsiteRef}/${gzRepo.majorVersion}/${handle}.html`
      const sourceUrl = `https://github.com/${gzRepo.org}/${gzRepo.repo}/tree/${gzRepo.branch}/${relativePath}`
      const doc: GazeboDoc = {
        localPath: filePath,
        handle,
        liveUrl,
        sourceUrl,
      }
      gzRepo.docs.push(doc)
    })
    gzRepos.push(gzRepo)
  }
  return gzRepos
}

async function cloneRepo({
  repoUrl,
  destinationPath,
  branch,
}: {
  repoUrl: string
  destinationPath: string
  branch: string
}) {
  try {
    const pullMessage = await ros2.cache.pullGitRepo({
      url: repoUrl,
      destinationPath,
      version: branch,
    })
    console.log(pullMessage)
  } catch (error) {
    let errorMessage = `Could not pull the repo: ${repoUrl}`
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`
    }
    return errorMessage
  }
}

export function getNumber(text: string) {
  const match = text.match(/\d+/)
  if (!match) {
    throw new Error(`Could not parse text: ${text}`)
  }
  return Number(match[0])
}

async function main() {
  const {errorText} = await getGazeboLinks({
    docsRepo: {
      url: 'https://github.com/gazebosim/docs',
      org: 'gazebosim',
      name: 'docs',
      branch: 'master',
      releaseName: 'garden',
    },
    worldsRepo: {
      url: 'https://github.com/gazebosim/gz-sim',
      org: 'gazebosim',
      name: 'gz-sim',
      branch: 'gz-sim7',
      pathToWoldFiles: 'examples/worlds',
    },
    tutorials: {
      reposYamlUrl:
        'https://raw.githubusercontent.com/ignition-tooling/gazebodistro/master/collection-garden.yaml',
      reposToSkip: ['gz-cmake'],
    },
  })
  if (errorText) {
    console.error(errorText)
  }
}

if (typeof require !== 'undefined' && require.main === module) {
  main()
}
