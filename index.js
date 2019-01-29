#!/usr/bin/env node
'use strict'

let path = require('path')
let crypto = require('crypto')
let file_read = require('util').promisify(require('fs').readFile)
let {parseNES} = require('nes-file')
let crc32 = require('buffer-crc32')
let R = require('ramda')
let sprintf = require('sprintf-js').sprintf

function main() {
    let cmd = require('commander')
    let meta = require('./package.json')

    cmd.version(meta.version)
	.arguments('[file.nes]')
	.option('-f, --format <type>', 'jsonl, shell, human')
	.option('-a, --all', 'output all available info')
	.option('--nointro', 'extract additional info from file _names_')
	.option('-v, --verbose', 'be verbose')
	.parse(process.argv)

    let src = cmd.args.length ? cmd.args : [process.stdin]

    src.forEach( input => {
	open(input)
	    .then( r => parse(r, cmd))
	    .then( r => filter(r, cmd))
	    .then( r => print(r, cmd))
	    .catch( err => {
		let prefix = `${cmd._name} error: ${sq(filename(input))}: `
		console.error(prefix + err[cmd.verbose ? 'stack' : 'message'])
		process.exitCode = 1
	    })
    })
}

function print(rom, opt) {	// modifies opt
    if (opt.format === 'shell') {
	console.log('')
	R.mapObjIndexed( (val, key) => {
	    console.log(`${key}=${sq(val)}`)
	}, rom)
    } else if (opt.format === 'jsonl') {
	process.stdout.write(JSON.stringify(rom) + "\n")

    } else { // human-readable
	console.log('')
	R.mapObjIndexed( (val, key) => {
	    if (Array.isArray(val)) val = val.join(', ')
	    console.log(sprintf('%-23s	%s', key, val))
	}, rom)
    }
}

function filter(rom, opt) {
    let essential = ['file', 'file_size',
		     'name', 'publisher', 'regions', 'variant', 'date',
		     'licensed',
		     'crc32', 'sha1',
		     'tv_system9_pal', 'has_trainer',
		     'is_vs_unisystem', 'is_playchoice10']
    let uninteresting = ['header', 'prg_rom', 'chr_rom', 'trailer']
    return opt.all ? R.omit(uninteresting, rom) : R.pick(essential, rom)
}

function parse(input, opt) {
    let rom = parseNES(input.buf)
    let game = input.buf.slice(16)
    rom.crc32 = crc32.unsigned(game).toString(16).padStart(8, '0')
    rom.sha1 = crypto.createHash('sha1').update(game).digest('hex')

    rom.file = path.basename(input.file)
    rom.file_size = input.buf.length

    if (opt.nointro) rom = R.mergeRight(rom, parse_filename(rom.file))
    return rom
}

function parse_filename(file) {	// the No-Intro style
    let r = {
	name: file.match(/[^(]+/)[0].trim(),
	licensed: true
    }
    let tags = file.match(/\(([^(]+)\)/g) // (Asia) (PAL) (Unl)
    if (tags) {
	tags = tags.map( v => v.slice(1, -1))
	r.regions = tags[0].split(',').map( v => v.trim()).filter( v => v)
	if (tags[1] && tags[1] !== 'Unl') r.variant = tags[1]
	if (tags[tags.length-1] === 'Unl') r.licensed = false
    }
    return r
}

async function open(input) {
    return {
	file: filename(input),
	buf: await (is_str(input) ? file_read(input) : read(input))
    }
}

function filename(input) { return is_str(input) ? input : 'stdin' }

function read(stream) {
    return new Promise( (resolve, reject) => {
	let data = []
	stream.on('data', chunk => data.push(chunk))
	    .on('end', () => resolve(Buffer.concat(data)))
	    .on('error', reject)
    })
}

function is_str(s) {
    return Object.prototype.toString.call(s) === "[object String]"
}
function sq(s) {
    return /^[\w-,]+$/.test(s) ? s : "'" + s.toString().replace(/'/g, "'\\''") + "'"
}


require.main === module ? main() : module.exports = parse
