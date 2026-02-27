Ext.define("CGP.builderbackground.controller.BackgroundFaceGrid",{

	
	validateStore : null, //用来验证是否该背景是否还能加图片否。
	faceTypeStore : null,
	imageTypeStore : null,
	constructor : function(config){

		this.callParent(arguments);
		this.faceTypeStore = Ext.create("CGP.builderbackground.store.SelectFace");
		this.imageTypeStore = Ext.create("CGP.builderbackground.store.ImageType");
	},
	
	dataGrid : null, 
	add: function(backgroundFaceGrid){
		var me = this,
		store = backgroundFaceGrid.grid.getStore();
		me.dataGrid = backgroundFaceGrid;
		var addWin = Ext.create("CGP.builderbackground.view.face.UploadBackgroundImg",{
			controller : me
		});
		addWin.show();
		
	},
	
	save : function(imgWindow){
		var me =this,
		form = imgWindow.getComponent("form"),
		faceTypeField = form.getComponent("faceType"),
		imageTypeField = form.getComponent("imageType"),
		files = form.getComponent("files");
		
		var mask = imgWindow.setLoading(i18n.getKey('upLoading'));
		if(form.getForm().isValid()){
			form.getForm().submit({
				url : adminPath + 'api/admin/builderbackground/uploadImgs',
				clientValidation : true,
				success: function(form, action) {
					mask.hide();
					var data = action.response.data;
					me.imageDataToGrid(data,faceTypeField,imageTypeField);
					imgWindow.close();
			    },
			    failure: function(form, action) {
			    	mask.hide();
			        Ext.Msg.alert(i18n.getKey('prompt'), action.response.message);
			    }
			});
		}
	},
	imageDataToGrid : function(imgData,faceTypeField,imageTypeField){
		var me = this;
		//构建数据
		for(var i= 0; i < imgData.length; i++){
			imgData[i][faceTypeField.name] = faceTypeField.getValue();
			var faceTypeRecord  = faceTypeField.store.getById(faceTypeField.getValue());
			imgData[i].faceName = faceTypeRecord.get("name");
			imgData[i][imageTypeField.name] = imageTypeField.getValue();
			var imgTypeRecord = imageTypeField.store.findRecord("value",imageTypeField.getValue(), 0, false, false, true);
			imgData[i].typeName = imgTypeRecord.get("name");
		}
		//构建好之后将data放入Store
		me.dataGrid.store.add(imgData);
	},
	
	canAdd : function(store){
		var me = this;
		me.validateStore = store;
		var can = false;
		me.faceTypeStore.each(function(faceTypeRecord){
			me.imageTypeStore.each(function(imageTypeRecord){
				var faceId = faceTypeRecord.get("id");
				var type = imageTypeRecord.get("value");
				
				var exist = false;
				store.each(function(record){
					if(record.get("faceType") == faceId && record.get("type") == type){
						exist = true;
					}
				});
				if(!exist){
					can = true;
				}
			});
		});
		return can;
	},
	
	validate :function(faceType , imageType){
		var me = this,store = me.validateStore,is;
		is = true;
		store.each(function(record){
			if(record.get("faceType") == faceType && record.get("type") == imageType){
				is = false;
			}
		});
		return is;
	}
	
	
});