import { array, isString } from '@visactor/vutils';
import type { GlyphDefaultEncoder, IGlyphMeta, GlyphChannelEncoder, MarkType, GlyphFunctionEncoder } from '../types';
export class GlyphMeta<EncodeValuesType = any, GlyphConfigType = any>
  implements IGlyphMeta<EncodeValuesType, GlyphConfigType>
{
  private marks: { [markName: string]: MarkType };

  private channelEncoder: { [channel: string]: GlyphChannelEncoder<any, EncodeValuesType, GlyphConfigType> } = {};
  private defaultEncoder: GlyphDefaultEncoder<GlyphConfigType>;
  private functionEncoder: GlyphFunctionEncoder<GlyphConfigType>;
  private progressiveChannels: string[];

  constructor(
    marks: { [markName: string]: MarkType },
    encoders?: { [markName: string]: GlyphChannelEncoder<any, EncodeValuesType, GlyphConfigType> },
    defaultEncoder?: GlyphDefaultEncoder<GlyphConfigType>,
    progressiveChannels?: string | string[]
  ) {
    this.marks = marks;
    if (encoders) {
      this.registerChannelEncoder(encoders);
    }
    if (defaultEncoder) {
      this.registerDefaultEncoder(defaultEncoder);
    }
    if (this.progressiveChannels) {
      this.registerProgressiveChannels(progressiveChannels);
    }
  }

  getMarks() {
    return this.marks;
  }

  registerChannelEncoder(encoders: {
    [markName: string]: GlyphChannelEncoder<any, EncodeValuesType, GlyphConfigType>;
  }): this;
  registerChannelEncoder(channel: string, encoder: GlyphChannelEncoder<any, EncodeValuesType, GlyphConfigType>): this;
  registerChannelEncoder(
    channel: string | { [markName: string]: GlyphChannelEncoder<any, EncodeValuesType, GlyphConfigType> },
    encoder?: GlyphChannelEncoder<any, EncodeValuesType, GlyphConfigType>
  ) {
    if (isString(channel)) {
      this.channelEncoder[channel] = encoder;
    } else {
      Object.assign(this.channelEncoder, channel);
    }
    return this;
  }
  registerFunctionEncoder(encoder: GlyphFunctionEncoder<GlyphConfigType>) {
    this.functionEncoder = encoder;
    return this;
  }

  registerDefaultEncoder(encoder: GlyphDefaultEncoder<GlyphConfigType>) {
    this.defaultEncoder = encoder;
    return this;
  }

  registerProgressiveChannels(channels: string | string[]) {
    this.progressiveChannels = array(channels);
    return this;
  }

  getChannelEncoder() {
    return this.channelEncoder;
  }
  getFunctionEncoder() {
    return this.functionEncoder;
  }

  getDefaultEncoder() {
    return this.defaultEncoder;
  }

  getProgressiveChannels() {
    return this.progressiveChannels;
  }
}
