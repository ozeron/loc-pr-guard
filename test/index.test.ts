// You can import your modules
// import index from '../src/index'

import nock from 'nock'
// Requiring our app implementation
import myProbotApp from '../src'
import { Probot } from 'probot'
// Requiring our fixtures
import payload from './fixtures/pull_request.synchronize.json'
import compareSuccessPayload from './fixtures/compare.success.json'
import compareFailurePayload from './fixtures/compare.failure.json'
const checkCreateBody = { 'name': 'loc-guard', 'head_sha': 'a930751d19af64b9fcc737b7f9ff294152174472', 'status': 'queued' }
const checkSuccessBody = { 'conclusion': 'success', 'head_sha': 'a930751d19af64b9fcc737b7f9ff294152174472', 'name': 'loc-guard', 'output': { 'summary': 'It is ok', 'title': 'Checked LOC – It smaller than 1000' }, 'status': 'completed' }
const checkFailureBody = { 'conclusion': 'failure', 'head_sha': 'a930751d19af64b9fcc737b7f9ff294152174472', 'name': 'loc-guard', 'output': { 'summary': 'It is have problem', 'title': "Checked LOC – It 1100, it's bigger than maximum 1000" }, 'status': 'completed' }

nock.disableNetConnect()

describe('My Probot app', () => {
  let probot: any

  beforeEach(() => {
    probot = new Probot({ id: 123, cert: 'test' })
    // Load our app into probot
    const app = probot.load(myProbotApp)

    // just return a test token
    app.app = () => 'test'
  })

  afterEach(() => {
    nock.cleanAll()
  })

  test('creates a check with success conclusion when additions less than 1000', async (done) => {
    // Test that we correctly return a test token
    nock('https://api.github.com')
      .post('/app/installations/738924/access_tokens')
      .reply(200, { token: 'test' })

    nock('https://api.github.com')
      .get('/repos/ozeron/amazone_service/compare/533b99d5e676ba7303d0f9bfb6101b8d47cab689...a930751d19af64b9fcc737b7f9ff294152174472')
      .reply(200, compareSuccessPayload)

    // Test that a check is created
    nock('https://api.github.com')
      .post('/repos/ozeron/amazone_service/check-runs', (body: any) => {
        expect(body).toMatchObject(checkCreateBody)
        return true
      })
      .reply(200)
      .post('/repos/ozeron/amazone_service/check-runs', (body: any) => {
        done(expect(body).toMatchObject(checkSuccessBody))
        return true
      })
      .reply(200)

    // Receive a webhook event
    await probot.receive({ name: 'pull_request.synchronize', payload })
  })

  test('creates a check with failure conclusion when additions more than 1000', async (done) => {
    // Test that we correctly return a test token
    nock('https://api.github.com')
      .post('/app/installations/738924/access_tokens')
      .reply(200, { token: 'test' })

    nock('https://api.github.com')
      .get('/repos/ozeron/amazone_service/compare/533b99d5e676ba7303d0f9bfb6101b8d47cab689...a930751d19af64b9fcc737b7f9ff294152174472')
      .reply(200, compareFailurePayload)

    // Test that a check is created
    nock('https://api.github.com')
      .post('/repos/ozeron/amazone_service/check-runs', (body: any) => {
        expect(body).toMatchObject(checkCreateBody)
        return true
      })
      .reply(200)
      .post('/repos/ozeron/amazone_service/check-runs', (body: any) => {
        done(expect(body).toMatchObject(checkFailureBody))
        return true
      })
      .reply(200)

    // Receive a webhook event
    await probot.receive({ name: 'pull_request.synchronize', payload })
  })
})

// For more information about testing with Jest see:
// https://facebook.github.io/jest/

// For more information about using TypeScript in your tests, Jest recommends:
// https://github.com/kulshekhar/ts-jest

// For more information about testing with Nock see:
// https://github.com/nock/nock
