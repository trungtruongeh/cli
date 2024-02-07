import React, {  } from 'react';
import { Box, Text } from 'ink';
import { v4 as uuidv4 } from 'uuid';

export default function RandomUUID() {
	const uuid = uuidv4();

	return (
		<Box
			flexDirection='row'
		>
			<Text>
				{`UUID (ver4): `}
			</Text>
			<Text color="yellow">"{uuid}"</Text>
		</Box>
	);
}
