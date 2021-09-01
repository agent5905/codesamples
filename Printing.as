package dag{
    import flash.printing.PrintJob; 
    import flash.display.*
    import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
    import flash.text.TextFormat;
    import flash.geom.Rectangle;
       
    public class Printing extends Sprite
    {
        private var bg:Sprite;
		private var sheet:Sprite;
		private var textf:TextField = new TextField();
		private var centsText:TextField = new TextField();
		private var newFormat:TextFormat = new TextFormat();
		private var newFormat2:TextFormat = new TextFormat();
		private var template:MovieClip = new TagTemplate();
		private var template2:MovieClip = new TagTemplate();
		private var barcode:MovieClip = new Barcode();
		private var barcode2:MovieClip = new Barcode();
		
		private var tmpSku:String;
		private var tmpBrand:String;
		private var tmpModel:String;
		private var tmpPrice:String;
		private var tmpTitle:String;
		private var tmpRam:String;
		private var tmpHD:String;
		private var tmpBundle:Number;
		private var tmpBTP:Number;
		private var tmpOffice:String;
		private var tmpTotalPrice:String;
		private var tmpAV:Number;
		private var tmpList:Array = new Array();
		
		/////////////////////////////////////Spanish Update/////////////////////////////////
		private var tmpListSp:Array = new Array();
		private var tmpLang:Number;
		private var tmpSoftPrice:String;
		private var tmpDdr:String;
		private var tmpEng:String;
		private var tmpSpn:String;
		
        private var txt:TextField;

        public function Printing(lang:Number,english:String, spanish:String, softprice:String,ddr:String, listSp:Array, sku:String,brand:String,model:String,price:String,totalprice:String,officeprice:String,titleS:String,ram:String,hd:String,bundle:Number,av:Number,list:Array):void
        {
            
			tmpSku = sku;
			tmpBrand = brand;
			tmpModel = model;
			tmpPrice = totalprice;
			tmpTitle = titleS;
			tmpRam = ram;
			tmpHD = hd;
			tmpBundle = bundle;
			tmpBTP = Number(price);
			tmpOffice = officeprice;
			//tmpTotalPrice = totalprice;
			tmpAV = av;
			tmpList = list;
			
			///////////////////////////Spanish Update////////////////////////
			tmpListSp = listSp;
			tmpLang = lang;
			tmpSoftPrice = softprice;
			tmpDdr = ddr;
			tmpEng = english;
			tmpSpn = spanish;
			
			init();
            draw();
            printPage();
        }
        
        private function printPage():void
        {
            var pj:PrintJob = new PrintJob();
            
            if (pj.start())
            {
                try
                {
                    pj.addPage(this, null);
                }
                catch (error:Error)
                {
                    trace(error);// Do nothing.
                }
                pj.send();
            }
            else
            {
               
            }
            // Reset the txt scale properties.
           
        }
        
        private function init():void
        {
			sheet = new Sprite();
			switch(tmpLang){
				case 1:
					template.gotoAndStop(1);
					template.c1s.visible = false;
					template.c2s.visible = false;
					template.c3s.visible = false;
					template.c4s.visible = false;
					template.c5s.visible = false;
					template.line1s.visible = false;
					template.line2s.visible = false;
					template.line3s.visible = false;
					template.line4s.visible = false;
					template.line5s.visible = false;
					template.btp.visible = true;
					template.btpe.visible = false;
					template.btps.visible = false;
					template.hd.visible = true;
					template.hds.visible = false;
					template.hde.visible = false;
					template.rams.visible = false;
					template.ddrs.visible = false;
					template.english.visible = false;
					template.spanish.visible = false;
					barcode.spanish.visible = false;
			
					template2.gotoAndStop(1);
					template2.c1s.visible = false;
					template2.c2s.visible = false;
					template2.c3s.visible = false;
					template2.c4s.visible = false;
					template2.c5s.visible = false;
					template2.line1s.visible = false;
					template2.line2s.visible = false;
					template2.line3s.visible = false;
					template2.line4s.visible = false;
					template2.line5s.visible = false;
					template2.btp.visible = true;
					template2.btpe.visible = false;
					template2.btps.visible = false;
					template2.hd.visible = true;
					template2.hds.visible = false;
					template2.hde.visible = false;
					template2.rams.visible = false;
					template2.ddrs.visible = false;
					template2.english.visible = false;
					template2.spanish.visible = false;
					barcode2.spanish.visible = false;
					break;
				case 2:
					template.gotoAndStop(2);template.c1s.visible = false;
					template.c1s.visible = false;
					template.c2s.visible = false;
					template.c3s.visible = false;
					template.c4s.visible = false;
					template.c5s.visible = false;
					template.line1s.visible = false;
					template.line2s.visible = false;
					template.line3s.visible = false;
					template.line4s.visible = false;
					template.line5s.visible = false;
					template.btp.visible = false;
					template.btpe.visible = true;
					template.btps.visible = true;
					template.hd.visible = false;
					template.hds.visible = true;
					template.hde.visible = true;
					template.rams.visible = true;
					template.ddrs.visible = true;
					template.english.visible = true;
					template.spanish.visible = true;
					barcode.spanish.visible = true;
					
					template2.gotoAndStop(2);
					template2.c1s.visible = false;
					template2.c2s.visible = false;
					template2.c3s.visible = false;
					template2.c4s.visible = false;
					template2.c5s.visible = false;
					template2.line1s.visible = false;
					template2.line2s.visible = false;
					template2.line3s.visible = false;
					template2.line4s.visible = false;
					template2.line5s.visible = false;
					template2.btp.visible = false;
					template2.btpe.visible = true;
					template2.btps.visible = true;
					template2.hd.visible = false;
					template2.hds.visible = true;
					template2.hde.visible = true;
					template2.rams.visible = true;
					template2.ddrs.visible = true;
					template2.english.visible = true;
					template2.spanish.visible = true;
					barcode2.spanish.visible = true;
					break;

			}
		
			 if(tmpPrice.length <= 6){
				if(tmpPrice.indexOf(".") > -1){
					template.price.text = tmpPrice.substr(0,tmpPrice.indexOf("."));
					template.cents.text = tmpPrice.substring(tmpPrice.indexOf(".") + 1,tmpPrice.length);
				}else{
			    	template.price.text = tmpPrice;
					template.cents.text = "00";
		   		}
			 }else{
				template.price2.text = tmpPrice.substr(0,tmpPrice.indexOf("."));
				template.cents.text = tmpPrice.substring(tmpPrice.indexOf(".") + 1,tmpPrice.length);
			 }
			template.model.text = tmpModel;
			template.brand.text = tmpBrand;
			template.titleT.text = tmpTitle;
			template.ram.text = tmpRam;
			template.hd.text = tmpHD;
			template.sku.text = tmpSku;
			
			if (tmpSoftPrice == "$0" ){
				template.bundle.software.sprice.text = "";
				
			} else{
				template.bundle.software.sprice.text = tmpSoftPrice;
			}
			
			template.ddr.text = tmpDdr;
			template.ddrs.text = tmpDdr;
			template.rams.text = tmpRam;
			template.hde.text = tmpHD;
			template.hds.text = tmpHD;
			template.english.text = tmpEng;
			template.spanish.text = tmpSpn;

			
		   if(tmpBTP > 0 && tmpBTP <= 399.99){
				template.btps.text = "229.99";
				template.btpe.text = "229.99";
			}else if(tmpBTP >= 400 && tmpBTP <= 599.99){
				template.btps.text = "269.99";
				template.btpe.text = "269.99";
			}else if(tmpBTP >= 600 && tmpBTP <= 749.99){
				template.btps.text = "299.99";
				template.btpe.text = "299.99";
			}else if(tmpBTP >= 750 && tmpBTP <= 999.99){
				template.btps.text = "329.99";
				template.btpe.text = "329.99";
			}else if(tmpBTP >= 1000 && tmpBTP <= 1499.99){
				template.btps.text = "399.99";
				template.btpe.text = "399.99";
			}else if(tmpBTP >= 1500){
				template.btps.text = "449.99";
				template.btpe.text = "449.99";
			}
			
			template.bundle.gotoAndStop(tmpBundle);
			template.bundle.software.gotoAndStop(tmpAV);
			
			switch(tmpBundle - 1){
		case 3:
			template.bundle.officeprice1.text = "$" + tmpOffice;
			template.bundle.officeprice2.text = "";
			template.bundle.officeprice3.text = "";
			break;
		case 4:
			template.bundle.officeprice1.text = "";
			template.bundle.officeprice2.text = "$" + tmpOffice;
			template.bundle.officeprice3.text = "";
			break;
		case 5:
			template.bundle.officeprice1.text = "";
			template.bundle.officeprice2.text = "";
			template.bundle.officeprice3.text = "$" + tmpOffice;
			break;
		default:
			template.bundle.officeprice1.text = "";
			template.bundle.officeprice2.text = "";
			template.bundle.officeprice3.text = "";
			break;
			}
			
			if( tmpList[0] != null){
				template.line1.text = tmpList[0];
				template.c1.visible = true;
			}else{
				template.line1.text = "";
				template.c1.visible = false;
			}
			if( tmpList[1] != null){
				template.line2.text = tmpList[1];
				template.c2.visible = true;
			}else{
				template.line2.text = "";
				template.c2.visible = false;
			}
			if( tmpList[2] != null){
				template.line3.text = tmpList[2];
				template.c3.visible = true;
			}else{
				template.line3.text = "";
				template.c3.visible = false;
			}
			if( tmpList[3] != null){
				template.line4.text = tmpList[3];
				template.c4.visible = true;
			}else{
				template.line4.text = "";
				template.c4.visible = false;
			}
			if( tmpList[4] != null){
				template.line5.text = tmpList[4];
				template.c5.visible = true;
			}else{
				template.line5.text = "";
				template.c5.visible = false;
			}
			
			
			////////////////////////////////////Spanish List/////////////////////////
			
			if( tmpListSp[0] != null){
				template.line1s.text = tmpListSp[0];
				template.line1s.visible = true;
				template.c1s.visible = true;
			}else{
				template.line1s.text = "";
				template.c1s.visible = false;
			}
			if( tmpListSp[1] != null){
				template.line2s.text = tmpListSp[1];
				template.line2s.visible = true;
				template.c2s.visible = true;
			}else{
				template.line2s.text = "";
				template.c2s.visible = false;
			}
			if( tmpListSp[2] != null){
				template.line3s.text = tmpListSp[2];
				template.line3s.visible = true;
				template.c3s.visible = true;
			}else{
				template.line3s.text = "";
				template.c3s.visible = false;
			}
			if( tmpListSp[3] != null){
				template.line4s.text = tmpListSp[3];
				template.line4s.visible = true;
				template.c4s.visible = true;
			}else{
				template.line4s.text = "";
				template.c4s.visible = false;
			}
			if( tmpListSp[4] != null){
				template.line5s.text = tmpListSp[4];
				template.line5s.visible = true;
				template.c5s.visible = true;
			}else{
				template.line5s.text = "";
				template.c5s.visible = false;
			}
			
			///////////////////////////////////////////Template 2////////////////////////////////
			
			
							 
			 if(tmpPrice.length <= 6){
				if(tmpPrice.indexOf(".") > -1){
					template2.price.text = tmpPrice.substr(0,tmpPrice.indexOf("."));
					template2.cents.text = tmpPrice.substring(tmpPrice.indexOf(".") + 1,tmpPrice.length);
				}else{
			    	template2.price.text = tmpPrice;
					template2.cents.text = "00";
		   		}
			 }else{
				template2.price2.text = tmpPrice.substr(0,tmpPrice.indexOf("."));
				template2.cents.text = tmpPrice.substring(tmpPrice.indexOf(".") + 1,tmpPrice.length);
			 }
			template2.model.text = tmpModel;
			template2.brand.text = tmpBrand;
			template2.titleT.text = tmpTitle;
			template2.ram.text = tmpRam;
			template2.hd.text = tmpHD;
			template2.sku.text = tmpSku;
			
			if (tmpSoftPrice == "$0" ){
				template2.bundle.software.sprice.text = "";
				
			} else{
				template2.bundle.software.sprice.text = tmpSoftPrice;
			}
			
			template2.ddr.text = tmpDdr;
			template2.ddrs.text = tmpDdr;
			template2.rams.text = tmpRam;
			template2.hde.text = tmpHD;
			template2.hds.text = tmpHD;
			template2.english.text = tmpEng;
			template2.spanish.text = tmpSpn;
			template2.ddr.text = tmpDdr;
			template2.ddrs.text = tmpDdr;
	
			
		   if(tmpBTP > 0 && tmpBTP <= 399.99){
				template2.btps.text = "229.99";
				template2.btpe.text = "229.99";
			}else if(tmpBTP >= 400 && tmpBTP <= 599.99){
				template2.btps.text = "269.99";
				template2.btpe.text = "269.99";
			}else if(tmpBTP >= 600 && tmpBTP <= 749.99){
				template2.btps.text = "299.99";
				template2.btpe.text = "299.99";
			}else if(tmpBTP >= 750 && tmpBTP <= 999.99){
				template2.btps.text = "329.99";
				template2.btpe.text = "329.99";
			}else if(tmpBTP >= 1000 && tmpBTP <= 1499.99){
				template2.btps.text = "399.99";
				template2.btpe.text = "399.99";
			}else if(tmpBTP >= 1500){
				template2.btps.text = "449.99";
				template2.btpe.text = "449.99";
			}
			
			template2.bundle.gotoAndStop(tmpBundle);
			template2.bundle.software.gotoAndStop(tmpAV);
			
			switch(tmpBundle - 1){
		case 3:
			template2.bundle.officeprice1.text = "$" + tmpOffice;
			template2.bundle.officeprice2.text = "";
			template2.bundle.officeprice3.text = "";
			break;
		case 4:
			template2.bundle.officeprice1.text = "";
			template2.bundle.officeprice2.text = "$" + tmpOffice;
			template2.bundle.officeprice3.text = "";
			break;
		case 5:
			template2.bundle.officeprice1.text = "";
			template2.bundle.officeprice2.text = "";
			template2.bundle.officeprice3.text = "$" + tmpOffice;
			break;
		default:
			template2.bundle.officeprice1.text = "";
			template2.bundle.officeprice2.text = "";
			template2.bundle.officeprice3.text = "";
			break;
		}
			
			if( tmpList[0] != null){
				template2.line1.text = tmpList[0];
				template2.c1.visible = true;
			}else{
				template2.line1.text = "";
				template2.c1.visible = false;
			}
			if( tmpList[1] != null){
				template2.line2.text = tmpList[1];
				template2.c2.visible = true;
			}else{
				template2.line2.text = "";
				template2.c2.visible = false;
			}
			if( tmpList[2] != null){
				template2.line3.text = tmpList[2];
				template2.c3.visible = true;
			}else{
				template2.line3.text = "";
				template2.c3.visible = false;
			}
			if( tmpList[3] != null){
				template2.line4.text = tmpList[3];
				template2.c4.visible = true;
			}else{
				template2.line4.text = "";
				template2.c4.visible = false;
			}
			if( tmpList[4] != null){
				template2.line5.text = tmpList[4];
				template2.c5.visible = true;
			}else{
				template2.line5.text = "";
				template2.c5.visible = false;
			}
			
			////////////////////////////////////Spanish List/////////////////////////
			if( tmpListSp[0] != null){
				template2.line1s.text = tmpListSp[0];
				template2.line1s.visible = true;
				template2.c1s.visible = true;
			}else{
				template2.line1s.text = "";
				template2.c1s.visible = false;
			}
			if( tmpListSp[1] != null){
				template2.line2s.text = tmpListSp[1];
				template2.line2s.visible = true;
				template2.c2s.visible = true;
			}else{
				template2.line2s.text = "";
				template2.c2s.visible = false;
			}
			if( tmpListSp[2] != null){
				template2.line3s.text = tmpListSp[2];
				template2.line3s.visible = true;
				template2.c3s.visible = true;
			}else{
				template2.line3s.text = "";
				template2.c3s.visible = false;
			}
			if( tmpListSp[3] != null){
				template2.line4s.text = tmpListSp[3];
				template2.line4s.visible = true;
				template2.c4s.visible = true;
			}else{
				template2.line4s.text = "";
				template2.c4s.visible = false;
			}
			if( tmpListSp[4] != null){
				template2.line5s.text = tmpListSp[4];
				template2.line5s.visible = true;
				template2.c5s.visible = true;
			}else{
				template2.line5s.text = "";
				template2.c5s.visible = false;
			}
		
			template2.x = 288;
			
			
			
			sheet.addChild(template);
			sheet.addChild(template2);
			
			switch(tmpBundle -1){
				case 1:
					switch(tmpAV - 1){
						case 1:
							barcode.gotoAndStop(1);
							barcode2.gotoAndStop(1);
							break;
						case 2:
							barcode.gotoAndStop(2);
							barcode2.gotoAndStop(2);
							break;
						case 3:
							barcode.gotoAndStop(3);
							barcode2.gotoAndStop(3);
							break;
						case 4:
							barcode.gotoAndStop(4);
							barcode2.gotoAndStop(4);
							break;
						case 5:
						case 6:
							barcode.gotoAndStop(33);
							barcode2.gotoAndStop(33);
							break;
						case 7:
							barcode.gotoAndStop(23);
							barcode2.gotoAndStop(23);
							break;
						case 8:
							barcode.gotoAndStop(28);
							barcode2.gotoAndStop(28);
							break;
					}
					break;
				case 2:
						switch(tmpAV - 1){
						case 1:
							barcode.gotoAndStop(5);
							barcode2.gotoAndStop(5);
							break;
						case 2:
							barcode.gotoAndStop(6);
							barcode2.gotoAndStop(6);
							break;
						case 3:
							barcode.gotoAndStop(7);
							barcode2.gotoAndStop(7);
							break;
						case 4:
							barcode.gotoAndStop(8);
							barcode2.gotoAndStop(8);
							break;
						case 5:
						case 6:
							barcode.gotoAndStop(34);
							barcode2.gotoAndStop(34);
							break;
						case 7:
							barcode.gotoAndStop(24);
							barcode2.gotoAndStop(24);
							break;
						case 8:
							barcode.gotoAndStop(29);
							barcode2.gotoAndStop(29);
							break;
					}
					break;
				case 3:
					switch(tmpAV - 1){
						case 1:
							barcode.gotoAndStop(9);
							barcode2.gotoAndStop(9);
							break;
						case 2:
							barcode.gotoAndStop(10);
							barcode2.gotoAndStop(10);
							break;
						case 3:
							barcode.gotoAndStop(11);
							barcode2.gotoAndStop(11);
							break;						
						case 4:
							barcode.gotoAndStop(12);
							barcode2.gotoAndStop(12);
							break;
						case 5:
						case 6:
							barcode.gotoAndStop(36);
							barcode2.gotoAndStop(36);
							break;
						case 7:
							barcode.gotoAndStop(26);
							barcode2.gotoAndStop(26);
							break;
						case 8:
							barcode.gotoAndStop(31);
							barcode2.gotoAndStop(31);
							break;
					}
					break;
				case 4:
					switch(tmpAV - 1){
						case 1:
							barcode.gotoAndStop(13);
							barcode2.gotoAndStop(13);
							break;
						case 2:
							barcode.gotoAndStop(14);
							barcode2.gotoAndStop(14);
							break;
						case 3:
							barcode.gotoAndStop(15);
							barcode2.gotoAndStop(15);
							break;						
						case 4:
							barcode.gotoAndStop(16);
							barcode2.gotoAndStop(16);
							break;
						case 5:
						case 6:
							barcode.gotoAndStop(35);
							barcode2.gotoAndStop(35);
							break;
						case 7:
							barcode.gotoAndStop(25);
							barcode2.gotoAndStop(25);
							break;
						case 8:
							barcode.gotoAndStop(30);
							barcode2.gotoAndStop(30);
							break;
					}
					break;
				case 5:
						barcode.gotoAndStop(17);
						barcode2.gotoAndStop(17);
						break;
				case 6:
						barcode.gotoAndStop(18);
						barcode2.gotoAndStop(18);
						break;
				case 7:
					switch(tmpAV - 1){
						case 1:
							barcode.gotoAndStop(19);
							barcode2.gotoAndStop(19);
							break;
						case 2:
							barcode.gotoAndStop(20);
							barcode2.gotoAndStop(20);
							break;
						case 3:
							barcode.gotoAndStop(21);
							barcode2.gotoAndStop(21);
							break;						
						case 4:
							barcode.gotoAndStop(22);
							barcode2.gotoAndStop(22);
							break;
						case 5:
						case 6:
							barcode.gotoAndStop(37);
							barcode2.gotoAndStop(37);
							break;
						case 7:
							barcode.gotoAndStop(27);
							barcode2.gotoAndStop(27);
							break;
						case 8:
							barcode.gotoAndStop(32);
							barcode2.gotoAndStop(32);
							break;
					}
					break;
				case 8:
					barcode.gotoAndStop(38);
					barcode2.gotoAndStop(38);
					break;
					
			}
			
			barcode.y = 396;
			barcode.x = 11;
			
			barcode2.y = 396;
			barcode2.x = 299;
			
			
			sheet.addChild(barcode);
			sheet.addChild(barcode2);
			
		}
        
        private function draw():void
        {
           addChild(sheet);
		
        }
	}
}

