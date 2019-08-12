#!/usr/bin/env node

const Octokit = require('@octokit/rest');
const chalk = require('chalk');

const octokit = new Octokit({auth: process.env.GITHUB_TOKEN});

if (process.argv.length != 3) {
    console.log("Usage: gh_watch_or_not.js ORG");
    process.exit(1);
}

options = octokit.activity.listWatchedReposForAuthenticatedUser.endpoint.merge()
octokit.paginate(options).then((watched_repos) => {
    let watched_ids = [];
    for (repo of watched_repos) {
        watched_ids.push(repo.id);
    }
    options = octokit.repos.listForOrg.endpoint.merge({
        org: process.argv[2],
        type: 'all'
    });
    octokit.paginate(options).then((org_repos) => {
        for (repo of org_repos) {
            console.log(repo.name, watched_ids.includes(repo.id) ? chalk.green("watched") : chalk.red("not watched"));
        }
    });
});

