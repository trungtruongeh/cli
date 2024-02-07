import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Text, useApp, useStdin, useStdout } from 'ink';

function parseJwt(token: string) {
	return JSON.parse(Buffer.from(token.split('.')[1] || '', 'base64').toString());
}

type Props = {
	token: string;
};

export default function ParseJwtToken({ token }: Props) {
	const tokenBody = useMemo(() => parseJwt(token), []);

	const { exit } = useApp();

	const { stdin, setRawMode } = useStdin();
	const { write } = useStdout();

	const attrRef = useRef<string>('');
	const [attr, setAttr] = useState<string>();

	useEffect(() => {
		console.log(tokenBody);
		process.stdout.write('Extract attribute ([enter] for all): ');

		if (stdin) {
			setRawMode(true); // Enable raw mode to capture individual key presses

			const handleKeyPress = (...args: any[]) => {
				const key = args[0];
				if (key === '\r' || key === '\x03') {
					console.log('');
					setAttr(attrRef.current);
					exit();
				}
				write(key);
				attrRef.current += key;
			};

			stdin.on('data', handleKeyPress);

			return () => {
				setRawMode(false); // Disable raw mode when the component unmounts
				stdin.off('data', handleKeyPress);
			};
		}
		return () => { };
	}, [stdin, setRawMode]);

	console.log(attrRef.current);

	return (
		<Box
			flexDirection='column'
		>
			<Text>
				DATA:
			</Text>
			<Text color="yellow">
				{JSON.stringify(attr?.length ? tokenBody[attr] : tokenBody)}
			</Text>
		</Box>
	);
}
