

import { debug } from '../../platform/debug';
import { ShaderInfo } from '../base/define';
import { Shader } from '../base/shader';

export class EmptyShader extends Shader {
    public initialize (info: Readonly<ShaderInfo>) {
        debug(`Shader '${info.name}' compilation succeeded.`);
    }
    public destroy () {}
}
