import { PluginSettings, PluginOverrides } from '../types/plugins';

const cropsGravityAuto = [ 'crop', 'fill', 'lfill', 'fill_pad', 'thumb' ];
const cropsWithZoom = ['crop', 'thumb'];

export const props = [
  'crop',
  'gravity',
  'zoom'
];

export function plugin(props: PluginSettings) {
  const { cldImage, options } = props;
  const { width, height, widthResize, crop = 'limit' } = options;

  const overrides: PluginOverrides = {
    width: undefined
  };

  let transformationString = '';

  if ( width ) {
    transformationString = `c_${crop},w_${width}`;
  }

  if ( !options.gravity && cropsGravityAuto.includes(crop) ) {
    options.gravity = 'auto';
  }

  if ( !['limit'].includes(crop) ) {
    transformationString = `${transformationString},h_${height}`;
  }

  if ( options.gravity ) {
    if ( options.gravity === 'auto' && !cropsGravityAuto.includes(crop) ) {
      console.warn(`Auto gravity can only be used with crop modes: ${cropsGravityAuto.join(', ')}. Not applying gravity.`);
    } else {
      transformationString = `${transformationString},g_${options.gravity}`;
    }
  }

  if ( options.zoom ) {
    if ( options.zoom === 'auto' && !cropsWithZoom.includes(crop) ) {
      console.warn(`Zoom can only be used with crop modes: ${cropsWithZoom.join(', ')}. Not applying zoom.`);
    } else {
      transformationString = `${transformationString},z_${options.zoom}`;
    }
  }

  cldImage.effect(transformationString);

  // If we have a resize width that's smaller than the user-defined width, we want to give the
  // ability to perform a final resize on the image without impacting any of the effects like text
  // overlays that may depend on the size to work properly

  if ( width && typeof widthResize === 'number' && widthResize < width ) {
    overrides.width = widthResize;
  }

  return {
    options: overrides
  }
}
