const axios = require('axios');
const prompt = require('prompt');
const chalk = require('chalk');

function getGithub(label, language) {
  axios.get(`https://api.github.com/search/issues?q=label:${label}+language:${language}+state:open&sort=created&order=asc`)
    .then(function (response) {
      if (response.data.total_count == 0) {
        console.log("No issues match your inputs");
        return;
      }
      response["data"]["items"].forEach(function(item, index) {
        if (index < 40) {
          console.log(chalk.cyan.bold(`Item ${index + 1}`));
          console.log(chalk.cyan.bold('Repository url:'), chalk.grey(item["repository_url"]));
          console.log(chalk.cyan.bold('Issue title:'), chalk.grey(item["title"]), "\n");
        }
      });
      getFurther(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getFurther(response) {
  console.log("Enter a number to get more information, or enter 'quit' to finish");
  prompt.get(['number'], function (err, result) {
    if (result.number === 'quit') { return };
    if (isNaN(parseInt(result.number)) || result.number > 30 || result.number < 0) {
      console.log(chalk.red.bold('That is not a valid number, please try again'));
    }
    else {
      console.log(chalk.cyan.bold(`Issue ${result.number}:`), chalk.grey(response["data"]["items"][result.number - 1]["title"]), "\n");
      console.log(chalk.cyan.bold('Issue body:'), chalk.grey(response["data"]["items"][result.number - 1]["body"]), "\n");
      console.log(chalk.cyan.bold('Repository url:'), chalk.grey(response["data"]["items"][result.number - 1]["repository_url"], "\n"));
    }
    getFurther(response);
  });
}

prompt.start();

prompt.get(['label', 'language'], function (err, result) {
  const results = getGithub(result.label, result.language);
})
