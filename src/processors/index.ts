import { ChildProcess, spawn } from 'child_process'
import {
  getIndexedChain,
  getIndexedChains,
  updateIndexedChainsFromArchives,
  updateIndexedChainsCurrentAndHeadBlock,
} from '../indexed-chains'
import { runProcessor } from './processorBase'
import { sleep } from '../util'

const runSupervisor = async () => {
  // spawn a repeating task to refresh each indexedChain's currentBlock and headBlock
  const refreshBlockRate = 10_000 // 10_000ms = 10 seconds
  const refreshBlockTimeout = async () => {
    try {
      await updateIndexedChainsCurrentAndHeadBlock()
    } catch (error) {
      console.error(error)
    }
    setTimeout(refreshBlockTimeout, refreshBlockRate)
  }
  setTimeout(refreshBlockTimeout, refreshBlockRate)

  // what follows is a crude mechanism to refresh all chain processors every 15 minutes

  // keep track of open processors, so that we can kill them on command
  const killProcessorCallbacks: Array<() => void> = []

  // function to refresh chain configs and start up all processors
  const startChains = async () => {
    await updateIndexedChainsFromArchives()

    const indexedChains = await getIndexedChains({ enabledOnly: true })

    for (const [index, chainId] of Object.keys(indexedChains).entries()) {
      killProcessorCallbacks.push(runProcessorInIsolatedProcess(index, chainId))
    }
  }

  // function to kill all running processors
  const stopChains = () => {
    killProcessorCallbacks.splice(0, killProcessorCallbacks.length).forEach((killProcessor) => killProcessor())
  }

  // a lil' 15 minute loop to call the above
  while (true) {
    console.log('Starting chain processors...')
    await startChains()

    console.log('Processors started')
    await sleep(15 * 60 * 1000 /* 15 * 60 * 1000 == 15 minutes in milliseconds */)

    console.log('Refreshing chain processors...')
    stopChains()
  }
}

// When `processor.run` exits, it kills the whole node process with `process.exit()`
// So if we want to isolate it from the other chains, and also restart it
// when it encounters an error, we must run it in a separate process!
const runProcessorInIsolatedProcess = (index: number, chainId: string): (() => void) => {
  // flag for whether we've attempted to kill this process
  // if true we should stop trying to revive it when it exits
  let killed = false
  let process: ChildProcess | undefined

  const runProcessRestartOnExit = () => {
    // run process
    process = spawn('node', [__filename, `--chain=${chainId} --index=${index}`], { stdio: 'inherit' })

    // check for errors
    process.on('error', (error) =>
      console.error(`Failed to spawn isolated chain process for chain ${chainId}: ${error}`)
    )

    // handle process exit
    process.on('exit', (code) => {
      if (code !== 0) console.error(`Chain processor for chain ${chainId} exited with an error.`)

      // don't restart if killed by caller
      if (killed) return

      console.info(`Restarting chain processor for chain ${chainId}`)
      runProcessRestartOnExit()
    })
  }

  console.info(`Starting chain processor for chain ${chainId}`)
  runProcessRestartOnExit()

  // return callback to kill the running processor's process
  return () => {
    killed = true
    process && process.kill('SIGKILL')
  }
}

// check if this process is an isolated chain processor
const chainArg = process.argv.find((arg) => arg.startsWith('--chain='))
if (chainArg) {
  // extract the requested chainId and index
  const [, chainId, index] = chainArg.match(/--chain=(.+) --index=(.+)/) || [undefined]

  if (chainId === undefined || index === undefined)
    throw new Error(`Failed to extract chainId and index from cli arguments: ${process.argv}`)

  // find the chain config for this chainId
  getIndexedChain(chainId).then((chain) => {
    if (chain === null) throw new Error(`No archive node found with chainId ${chainId}`)

    // run the processor in this process
    runProcessor(chain, parseInt(index, 10))
  })
}

// if not, this process should spawn all of the isolated chain processors
else runSupervisor()
