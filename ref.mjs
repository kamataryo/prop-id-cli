#! /usr/bin/env node
import fs from 'fs/promises'
import fetch from 'node-fetch'
const { PROP_ID_API_KEY, PROP_ID_ACCESS_TOKEN } = process.env

const STDIN_TIMEOUT = 50

const main = async () => {

	let propId = process.argv[2]

	if(!propId) {
		process.stdin.resume();
		process.stdin.setEncoding('utf8');
	
		let data = ''
		process.stdin.on('data', chunk => data += chunk)
		await Promise.race([
			new Promise(resolve => process.stdin.on('end', resolve)),
			new Promise(resolve => setTimeout(resolve, STDIN_TIMEOUT)),
		])
		propId = data.replace(/[\n\r]+$/, '')
	
	}

	if(!propId) {
		throw new Error('No propId.')
	}

	const resp = await fetch(`https://api.propid.jp/v1/${propId}?api-key=${PROP_ID_API_KEY}`, {
		"headers": {
			'x-access-token': PROP_ID_ACCESS_TOKEN
		}
	});
	if(resp.status > 399) {
		throw new Error(`Request with ${propId} ends with status code ${resp.status}.`)
	}
	const body = await resp.json()
	process.stdout.write(JSON.stringify(body) + '\n')
}

main()
