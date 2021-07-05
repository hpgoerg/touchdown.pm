/**
 * @module ask
 *
 * @description
 * console helpers
 *
 * @author Hans-Peter Görg
 **/
const inquirer = require('inquirer');

/**
 * console prompt to answer a question with Y(es) or n(o)
 *
 * Hint: console may not working in an integrated development environment
 *
 * @param question {string}- the question
 * @param defaultAnswer {boolean=} - default answer (true oder false), if user does not give input _Y_ oder _n_
 * @returns {Promise<boolean>} - _true_ or _false_
 */
async function askYesNo(question, defaultAnswer) {
        const { answer } = await inquirer.prompt([{
            type: 'confirm',
            name: 'answer',
            message: question,
            default: defaultAnswer
        }]);
        return answer;
}

/**
 * console prompt to answer a question via user input
 *
 *  Hint: console may not working in an integrated development environment
 *
 * @param question {string} - the question
 * @returns {Promise<string>} - the user answer
 */
async function askQuestion(question) {
    const { answer } = await inquirer.prompt([{
        type: 'input',
        name: 'answer',
        message: question
    }]);
    return answer;
}

exports.askYesNo = askYesNo;
exports.askQuestion = askQuestion;
