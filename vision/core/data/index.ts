

/**
 * @packageDocumentation
 * @module core/data
 */

import * as _decorator from './class-decorator';
import { legacyCC } from '../global-exports';

legacyCC._decorator = _decorator;
export { _decorator };
export { CCClass } from './class';
export { CCObject, isValid } from './object';
export { deserialize } from './deserialize';
export { Details } from './deserialize';
export { getSerializationMetadata } from './serialization-metadata';
export type { SerializationMetadata } from './serialization-metadata';
export { instantiate } from './instantiate';
export { CCInteger, CCFloat, CCBoolean, CCString } from './utils/attribute';
export { CompactValueTypeArray } from './utils/compact-value-type-array';
export { editorExtrasTag } from './editor-extras-tag';
export { deserializeTag, serializeTag } from './custom-serializable';
export type {
    SerializationInput,
    SerializationOutput,
    SerializationContext,
    CustomSerializable,
} from './custom-serializable';
