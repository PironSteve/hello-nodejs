#!/usr/bin/env node

const validator = require("email-validator");
const axios = require("axios");
const figlet = require('figlet');
const chalk = require('chalk');
const ora = require('ora');

const [,,  ...args] = process.argv;

console.log(chalk.yellow(figlet.textSync('Simply Mail Checker !', {
    horizontalLayout: 'default',
    verticalLayout: 'default'
})));

if (validator.validate(`${args}`)==true) {
    console.log(chalk.black.bgGreen(`\nEmail ${args} is  valid ! \n`))
    const spinner = ora('Loading unicorns');
    spinner.start();
    setTimeout(() => {
        spinner.color = 'yellow';
        spinner.text = 'Loading rainbows';
        axios({
            method:'get',
            url:`https://haveibeenpwned.com/api/v2/breachedaccount/${args}`,
            headers: {
                "user-agent":'checkmail-cli',
            }
        })
        .then(response => {
            console.log(chalk.bgRed(`Some breaches found ! \n`))
            response.data.forEach(breach => {
                console.log(chalk.yellow("Breach name:")+" "+chalk.blue.italic(breach.Name));
                console.log(chalk.yellow("Breach domain:")+" "+chalk.blue.italic(breach.Domain));
                console.log(chalk.yellow("Breach description:")+" "+chalk.blue.italic(breach.Description));
                console.log(chalk.yellow("Breach date:")+" "+chalk.blue.italic(breach.BreachDate)+"\n");
            })
        })
        .catch(error => {
            if (error.response.status === 404) {
                console.log(chalk.blue.italic(`GG ! pwned not found, ${args} is ok !\n`))
            }
        })
        spinner.stop();
    }, 2000);
}else{
    console.log(chalk.bgRed(`\nEmail : ${args} is invalid !`))
};