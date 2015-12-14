" some colors:  "white on black"
"  hi normal   ctermfg=black  ctermbg=white guifg=black  guibg=white
"  hi nontext  ctermfg=blue   ctermbg=white guifg=blue   guibg=white
" syntax coloring!! :-)
syntax on
map  :set timeout=9000
" security block
set cm=blowfish
set nobackup
set noswapfile
set nowritebackup
" end of security block
set noautoindent
set shiftwidth=4
set tabstop=4
set ignorecase
set nonumber
" write marked info in a buffer
" Mark
map == mb
" Yank from mark
map =y :'b,.y
" Delete from mark
map =d :'b,.d
" Cb grom mark
map =b :'b,.!cb
" Write block
map =w :'b,. w! $HOME/.vitemp  
" Read block
map =r :r $HOME/.vitemp  
" Box from mark
map =c ^mc`bO/*========`co========*/
map =C :'b,. !cbox
"
map =t 1GO:r !title %1Gdd
" end copy in buffer block
map g $
" Cursor keys
map [216z 
map [222z 
map [214z 1G
map [220z G
map OA k
map OB j
map OD h
map OC l
" Next File F1
map [224z :n
" Write - Next File F1
map [225z :w:n
" Word completion (Komplete, Next, Previous).
"
" Eric Edward Bowles  (bowles@is.s.u-tokyo.ac.jp)
"
" Here is my set of word completion macros.  Type the first part of
" a word, then do ^K to try to complete it.  If it's not correct, keep
" on trying using ^N (for next).  If you want a previous match, use
" ^P (for previous).
:map!  a. hbmmi?\<2h"zdt.@zywmx`mPbea dwbis"zdt.x@z
:map!  a. hbmmdw`xnywmx`mPbea dwbis"zdt.x@z
:map!  a. hbmmdw`xNywmx`mPbea dwbis"zdt.x@z
:map!  #
"
" Call cb
"
map \b :%!cb
map \f :%!fmt
map \e :%!expand -t4
"
" Comment line
"
map  ^i/* A */^
" Uncomment
map  :s/\/\* \([^*]*\) \*\//\1
"
" subsitute
map \s :1,$ s/
" Agian
map \a :1,$ sg
"Date \d
map \d :r !echo %:r !finger $USER|grep life|cut -f3 -d:|uniq:r !date
"Add support for read gzip text files without having to uncompress them
augroup gzip
 autocmd!
 autocmd BufReadPre,FileReadPre *.gz set bin
 autocmd BufReadPost,FileReadPost   *.gz '[,']!gunzip
 autocmd BufReadPost,FileReadPost   *.gz set nobin
 autocmd BufReadPost,FileReadPost   *.gz execute ":doautocmd BufReadPost " . expand("%:r")
 autocmd BufWritePost,FileWritePost *.gz !mv <afile> <afile>:r
 autocmd BufWritePost,FileWritePost *.gz !gzip <afile>:r
 autocmd FileAppendPre      *.gz !gunzip <afile>
 autocmd FileAppendPre      *.gz !mv <afile>:r <afile>
 autocmd FileAppendPost     *.gz !mv <afile> <afile>:r
 autocmd FileAppendPost     *.gz !gzip <afile>:r
augroup END
