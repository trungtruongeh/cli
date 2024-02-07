#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import { program } from 'commander';
import ParseJwtToken from './ParseJwtToken.js';
import RandomUUID from './RandomUUID.js';
import { showDepGraph } from './DepShow.js';

const tokenCommandGroup = program
	.command('token')
	.alias('t')
	.description('working around token');

tokenCommandGroup.command('parse-jwt')
	.alias('pjwt')
	.description('parse jwt token')
	.argument('<token>', 'token to parse')
	.action((token) => {
		render(<ParseJwtToken token={token} />);
	});
tokenCommandGroup.command('generate-uuid')
	.alias('guuid')
	.description('generate random uuid')
	.action(() => {
		render(<RandomUUID />);
	});

const depCommandGroup = program
	.command('dep')
	.alias('d')
	.description('dependency between npm packages');

depCommandGroup.command('show')
	.alias('s')
	.description('show root package')
	.argument('<file_path>', 'path to yarn.lock file')
	.argument('<name>', 'name of package to trace')
	.action((file_path, name) => {
		showDepGraph(file_path, name);
	});

program.parse();
