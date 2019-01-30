# ines-dump

List detailed information about .nes files in jsonl, shell or a
human-readable format.

    # npm -g i ines-dump

CRC db was copied from [ucon64][] src, ines header parsing is done via
a tiny [nes-file][] library.

~~~
$ ines-dump -h
Usage: ines-dump [options] [file.nes ...]

Options:
  -V, --version        output the version number
  -f, --format <type>  jsonl, shell, human
  -a, --all            output all available info
  --nointro            extract additional info from file _names_
  -v, --verbose        be verbose
  -h, --help           output usage information
~~~

## Examples

~~~
$ ines-dump --nointro 'Battletoads-Double Dragon (USA).nes'

file                    Battletoads-Double Dragon (USA).nes
rom_size                262144
name                    Battletoads-Double Dragon
publisher               Tradewest
regions                 USA
date                    6/1993
licensed                true
crc32                   ceb65b06
sha1                    a14563325b0f33c358142e7363d31614722fddb1
tv_system9_pal          NTSC
has_trainer             false
is_vs_unisystem         false
is_playchoice10         false
~~~

crc32 & sha1 are computed for a rom portion, not for a whole file.

Print json lines for a bunch of roms:

    $ find no-intro-2014-08-25 -type f -print0 | xargs -0 -n20 ines-dump --nointro -f jsonl

## License

GPLv2.

[ucon64]: http://ucon64.sourceforge.net
[nes-file]: https://github.com/satoshinm/nes-file
