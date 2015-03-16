# WebRTC_Floyd_Steinberg_dithering

Floyd–Steinberg dithering algoritham implementation in WebRTC using pure javascript

Find more on [http://en.wikipedia.org/wiki/Floyd%E2%80%93Steinberg_dithering]

pseudo code:

```sh
> for each y from top to bottom
> > for each x from left to right
> > > oldpixel  := pixel[x][y]
> > > newpixel  := find_closest_palette_color(oldpixel)
> > >  pixel[x][y]  := newpixel
> > >  quant_error  := oldpixel - newpixel
> > >  pixel[x+1][y  ] := pixel[x+1][y  ] + quant_error * 7/16
> > >  pixel[x-1][y+1] := pixel[x-1][y+1] + quant_error * 3/16
> > >  pixel[x  ][y+1] := pixel[x  ][y+1] + quant_error * 5/16
> > > pixel[x+1][y+1] := pixel[x+1][y+1] + quant_error * 1/16
```
