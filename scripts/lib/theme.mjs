// Colour tokens for both GitHub themes. Two accents carry meaning everywhere:
//   ag = an agent acting on its own      hu = a human being asked first
export const themes = {
  dark: {
    name: 'dark',
    bg: '#0B0E13', bg2: '#12161D', line: '#252C37', grid: '#1B212A',
    ink: '#E9ECEF', mut: '#9AA3B0', fnt: '#6B7482',
    ag: '#34D6B9', agSoft: 'rgba(52,214,185,.13)',
    hu: '#FF8E4D', huSoft: 'rgba(255,142,77,.13)',
    stop: '#F2707A',
    heat: ['#171C24', '#12423E', '#16695F', '#1FA08D', '#34D6B9'],
    shade: '#0B0E13', // what a face is blended toward as it turns from the light
    // face shades for extruded shapes: [top, left, right]
    iso: {
      plate: ['#1B212C', '#131821', '#0E1219'],
      dim: ['#2B3341', '#1F2631', '#181D26'],
      ag: ['#7AF3DE', '#34D6B9', '#1C9A86'],
      hu: ['#FFBD92', '#FF8E4D', '#C7662D'],
    },
  },
  light: {
    name: 'light',
    bg: '#FCFBF8', bg2: '#F3F1EA', line: '#DCD8CD', grid: '#E6E3DA',
    ink: '#15181D', mut: '#565E6A', fnt: '#7C838E',
    ag: '#0B8F7D', agSoft: 'rgba(11,143,125,.11)',
    hu: '#CF521A', huSoft: 'rgba(207,82,26,.11)',
    stop: '#C4374A',
    heat: ['#EBE8DF', '#BFE5DD', '#7DCFC1', '#34AE9C', '#0B8F7D'],
    shade: '#0F4F47',
    iso: {
      plate: ['#FFFFFF', '#EAE7DE', '#DBD7CB'],
      dim: ['#F4F2EB', '#DEDAD0', '#CEC9BC'],
      ag: ['#58D3C1', '#0B8F7D', '#08705F'],
      hu: ['#F5A174', '#CF521A', '#A8410F'],
    },
  },
};

export const MONO = "ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,'Liberation Mono','DejaVu Sans Mono',monospace";
export const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI','Noto Sans',Helvetica,Arial,sans-serif";
