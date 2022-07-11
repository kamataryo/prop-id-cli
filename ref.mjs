#! /usr/bin/env node
import fetch from 'node-fetch'

const { PROP_ID_API_KEY, PROP_ID_ACCESS_TOKEN } = process.env

const STDIN_TIMEOUT = 50

const main = async () => {

	let propIds = [process.argv[2]].filter(x => !!x)

	if(propIds.length === 0) {
		process.stdin.resume();
		process.stdin.setEncoding('utf8');
	
		let data = ''
		process.stdin.on('data', chunk => data += chunk)
		await Promise.race([
			new Promise(resolve => process.stdin.on('end', resolve)),
			new Promise(resolve => setTimeout(resolve, STDIN_TIMEOUT)),
		])
		propIds = data
			.split(/[\n\r]/)
			.filter(x => !!x)
			.map(id => id.trim())	
	}

	if(propIds.length === 0) {
		throw new Error('No propIds.')
	}

	const result = []

	for (const propId of propIds) {
		const resp = await fetch(`https://api.propid.jp/v1/${propId}?api-key=${PROP_ID_API_KEY}`, {
			"headers": {
			'x-access-token': PROP_ID_ACCESS_TOKEN
			}
		});
		const body = await resp.json()
		result.push({ status: resp.status, body })
	}
	process.stdout.write(JSON.stringify(result) + '\n')
}

main()
