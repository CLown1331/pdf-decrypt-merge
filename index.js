const shell = require('shelljs');
const fse = require('fs-extra');
const PDFMerger = require('pdf-merger-js');
require('dotenv').config()

const mergedPath = process.env.MERGED_PATH;
const decryptedPath = process.env.DECRYPTED_PATH;
const inputPath = process.env.INPUT_PATH;
const password = process.env.PASSWORD;

const execCommand = ({command, successMessage, failMessage, successCode}) => {
    if (shell.exec(command) == successCode) {
        console.log(successMessage);
    } else {
        console.log(failMessage);
    }
}

fse.emptyDirSync(decryptedPath);
fse.emptyDirSync(mergedPath);

const files = fse.readdirSync(inputPath);

files.forEach((file) => {
    execCommand({
        command: `qpdf --decrypt --password=${password} ./input/${file} ./decrypted/${file}`, 
        successMessage: `decrpting ${file} succeded`, 
        failMessage: `decrpting ${file} failed`, 
        successCode: 0
    });
});

(async () => {
    const merger = new PDFMerger();
    const decryptedFiles = fse.readdirSync(decryptedPath);
    decryptedFiles.forEach((file) => {
        merger.add(`${decryptedPath}${file}`);
    });
    await merger.save(`${mergedPath}merged.pdf`);
    console.log(`merged ${decryptedFiles.length} files to ${mergedPath}merged.pdf`);
})();