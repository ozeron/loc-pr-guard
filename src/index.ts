import { Application, Context } from 'probot' // eslint-disable-line no-unused-vars

import { CheckStatus, CheckConclusion } from './types'
import fileFilter from './fileFilter'

const ADDITIONS_MAX_NUM = 1000;

async function eventHandler(context: Context) {
  const owner : string = context.payload.pull_request.base.repo.owner.login;
  const repo : string = context.payload.pull_request.base.repo.name;
  const name : string = 'loc-guard';
  const head_sha : string = context.payload.pull_request.head.sha;
  let status = "queued" as CheckStatus;
  let opts = {owner, repo, name, head_sha, status}
  await context.github.checks.create(opts);


  const base = context.payload.pull_request.base.sha;
  const head = head_sha;

  const comparison = await context.github.repos.compareCommits({owner, repo, base, head})
  const files = comparison.data.files

  const allAdditions = files.filter(fileFilter).reduce((a : number, e : any) => a + e.additions, 0);

  status = "completed" as CheckStatus;
  let conclusion = "success" as CheckConclusion;
  const output : any = {}
  output.title = `Checked LOC – It smaller than ${ADDITIONS_MAX_NUM}`
  output.summary = 'It is ok'
  if ( allAdditions > ADDITIONS_MAX_NUM ) {
  conclusion = "failure" as CheckConclusion;
  output.title = `Checked LOC – It ${allAdditions}, it's bigger than maximum ${ADDITIONS_MAX_NUM}`;
  output.summary = 'It is have problem'
  }
  const completed_at = (new Date()).toISOString();
  const finalOpts = {owner, repo, name, head_sha, status, conclusion, completed_at, output};
  await context.github.checks.create(finalOpts);
};

export = (app: Application) => {
  app.on(['pull_request.opened', 'pull_request.synchronize'], eventHandler);
}
