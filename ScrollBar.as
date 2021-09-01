package dag.c9.sideliner
{ 
	import flash.display.*;
	import flash.events.*;
	
	public class ScrollBar extends MovieClip
	{
		private var yOffset:Number;
		private var yMin:Number;
		public var yMax:Number;
		
		public function ScrollBar():void
		{
			yMin = 0.45;
			yMax = track.height - thumb.height;
			if(stage==null){

				this.addEventListener(Event.ADDED_TO_STAGE, addedToList);

			} else {

				thumb.addEventListener(MouseEvent.MOUSE_DOWN, thumbDown);
				stage.addEventListener(MouseEvent.MOUSE_UP, thumbUp);

			}

			
		}
		private function addedToList(e:Event):void {

			thumb.addEventListener(MouseEvent.MOUSE_DOWN, thumbDown);
			stage.addEventListener(MouseEvent.MOUSE_UP, thumbUp);

		}

		private function thumbDown(e:MouseEvent):void
		{
			stage.addEventListener(MouseEvent.MOUSE_MOVE, thumbMove);
			yOffset = mouseY - thumb.y;
		}

		private function thumbUp(e:MouseEvent):void
		{
			stage.removeEventListener(MouseEvent.MOUSE_MOVE, thumbMove);
		}

		private function thumbMove(e:MouseEvent):void
		{
			thumb.y = mouseY - yOffset;
			if(thumb.y <= yMin)
				thumb.y = yMin;
			if(thumb.y >= yMax)
				thumb.y = yMax;
			dispatchEvent(new ScrollBarEvent(thumb.y / yMax));
			e.updateAfterEvent();
		}
	}
}
