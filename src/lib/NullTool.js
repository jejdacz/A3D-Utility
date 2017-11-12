/**
 * Empty tool.
 *
 * @author Marek Mego
 */
 
import { ToolBase } from './ToolBase.js';
 
class NullTool extends ToolBase {
	constructor() {
		super();
	}
	
	activate(){}
	deactivate(){}
}

export { NullTool };	
