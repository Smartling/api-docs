# Smartling REST OpenAPI Specification
[![Build Status](http://jenkins.data.dev.smartling.net/job/api-docs/)](http://jenkins.data.dev.smartling.net/job/api-docs/)

## Links

- Documentation(ReDoc): https://api-reference.smartling.com/
- SwaggerUI: https://api-reference.smartling.com/swagger-ui/
- Look full spec:
    + JSON https://api-reference.smartling.com/swagger.json
    + YAML https://api-reference.smartling.com/swagger.yaml
- Preview spec version for branch `<branch>`: https://api-reference.smartling.com/preview/<branch>
  (Note: use lower case name in the url for the branch)
  
**Warning:** All above links are updated only after Jenkins finishes deployment

## Working on specification
### Install

1. Install [Node JS](https://nodejs.org/)
2. Clone repo and `cd`
    + Run `npm install`

### Usage
1. If you make changes for TQC endpoint description run `npm run process-yaml`
2. Run `npm start`
3. Checkout console output to see where local server is started. You can use all [links](#links) (except `preview`) by replacing https://smartling.github.io/api-docs/ with url from the message: `Server started <url>`
4. Make changes using your favorite editor or `swagger-editor` (look for URL in console output)
5. All changes are immediately propagated to your local server, moreover all documentation pages will be automagically refreshed in a browser after each change
**TIP:** you can open `swagger-editor`, documentation and `swagger-ui` in parallel
6. Once you finish with the changes you can run tests using: `npm test`
7. Share your changes with the rest of the world by pushing to GitHub :smile:

### Stale reviews for branches and PR
Our current build procedure doesn't clean up old review files for the previous branches and pull requests. As the result
we may have dozens or hundreds of preview folders for those obsolete branches.

Here is the sequence of instructions to clean up all previews.

1. Switch for `gh-pages` git branch with all published content.

   `git checkout gh-pages`


2. Delete all previews.

   `rm -rf ./preview/*`


3. Commit the changes

   `git commit -am "Clean up contents of branch and pull requests previews"`


4. Push the changes

   `git push`

**NOTE:** these commands will delete all preview branches and pull requests. If some of the reviews are still needed
then one has to manually rerun build for those branches/PRs.

