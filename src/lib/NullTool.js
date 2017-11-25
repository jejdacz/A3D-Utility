/**
 * Empty tool.
 *
 * @author Marek Mego
 */
 
import { ToolBase } from "./ToolBase.js";
 
class NullTool extends ToolBase {	
	
	static create() {
		return new NullTool();
	}
	
	onActivate(){}
	onDeactivate(){}
	onDraw(){}
}

export { NullTool };	
