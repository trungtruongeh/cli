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
	.command('dependency')
	.alias('dep')
	.description('dependency between npm packages');

depCommandGroup.command('root')
	.alias('rt')
	.description('show root package')
	.argument('<repo>', 'repository')
	.argument('<name>', 'name of package to trace')
	.action((repo, name) => {
		showDepGraph(repo, name);
	});

program.parse();
