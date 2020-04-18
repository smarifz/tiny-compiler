'use strict';

const tiny = require('./tiny'),
	fs = require('fs'),
	Table = require('cli-table2'),
	_ = require('lodash'),
	Converter = require('./baseConverter');

const loadRegister = (line) => {
	const tokens = line.split(' '),
		register = {};
	for(let i = 1; i < tokens.length; i++){
		const kv = tokens[i].split('=');
		register[kv[0]] = kv[1];
	}
	return register;
};


const ascii2Hex = (str) =>{
	let arr1 = [];
	for (let n = 0, l = str.length; n < l; n ++){
		let hex = Number(str.charCodeAt(n)).toString(16);
		arr1.push(hex);
	}
	return arr1.join('');
};

try {
	// read contents of the file
	const data = fs.readFileSync('./input.txt', 'UTF-8');

	// split the contents by new line
	const lines = data.split(/\r?\n/);
	let register = {
		r1: 0x00000000,
		r2: 0x00000000,
		r3: 0x00000000
	};

	// print all lines
	lines.forEach((line) => {
		if(line.startsWith('lr')){
			register = loadRegister(line.slice(2))
		}else{

			const opTable = new Table({
				                          head: ['Address', 'Source']
				                          , colWidths: [50, 50]
			                          });

			opTable.push([ascii2Hex(line), line]);
			console.log(opTable.toString());

			// ===================================================================================================


			const registerBeforeTable = new Table();
			registerBeforeTable.push(
				{ 'Register (before)': 'Value' }
			);
			for(let reg in register){
				registerBeforeTable.push({reg: `${Converter.dec2hex(register[reg])}`})
			}
			console.log(registerBeforeTable.toString());


			// ===================================================================================================

			const tokens = tiny.lex(line);
			const ast = tiny.parse(tokens);
			register = tiny.e(ast, register, [5,6,7]);


			// ===================================================================================================

			const registerAfterTable = new Table();
			registerAfterTable.push(
				{ 'Register (after)': 'Value' }
			);
			for(let reg in register){
				registerAfterTable.push({reg: `${Converter.dec2hex(register[reg])}`})
			}
			console.log(registerAfterTable.toString());


		}

	});
} catch (err) {
	console.error(err);
}




