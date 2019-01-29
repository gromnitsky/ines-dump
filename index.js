'use strict'

let path = require('path')
let crypto = require('crypto')
let {parseNES} = require('nes-file')
let crc32 = require('buffer-crc32')
let R = require('ramda')

module.exports = function(input, opt) {
    let rom = parseNES(input.buf)
    let game = input.buf.slice(16)
    rom.crc32 = crc32.unsigned(game).toString(16).padStart(8, '0')
    rom.sha1 = crypto.createHash('sha1').update(game).digest('hex')

    rom.file = path.basename(input.file)
    rom.file_size = input.buf.length

    if (opt.nointro && input.file !== 'stdin')
	rom = R.mergeRight(rom, parse_filename(rom.file))
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
