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

Print all available info in a shell-compatible code, that can be
safely `eval`uated in sh:

~~~
$ ines-dump --nointro -f shell -a 'Battletoads-Double Dragon (USA).nes'
prg_rom_size=262144
chr_rom_size=0
has_chr_ram=true
mirroring=horizontal
has_battery_backed_sram=false
has_trainer=false
four_screen_mode=true
mapper=7
is_vs_unisystem=false
is_playchoice10=false
is_nes2_0=false
is_ines=true
prg_ram_size=0
tv_system9_pal=NTSC
reserved9=0
tv_system10=0
has_prg_ram=false
has_bus_conflicts=false
crc32=ceb65b06
sha1=a14563325b0f33c358142e7363d31614722fddb1
publisher=Tradewest
regions=USA
date='1993-06-15T01:00:00.000Z'
file='Battletoads-Double Dragon (USA).nes'
rom_size=262144
name='Battletoads-Double Dragon'
licensed=true
~~~

## License

GPLv2.

[ucon64]: http://ucon64.sourceforge.net
[nes-file]: https://github.com/satoshinm/nes-file
