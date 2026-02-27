Ext.define("CGP.builderbackground.view.face.UploadBackgroundImg",{
	extend : "Ext.window.Window",
	

	
	controller : null,//保存controller.BackgroundFaceGrid
	
	modal : true,
	
	
	layout : "fit",
	initComponent: function(){
		var me = this;

		
		me.title = i18n.getKey('addImage');
		
		me.tbar = [{
			xtype : 'button',
			text : i18n.getKey('ok'),
			iconCls : 'icon_save',
			handler : function(btn){
				if(me.down("form").isValid()){
					me.controller.save(me);
				}
			}
		},{
			xtype : 'button',
			text : i18n.getKey('cancel'),
			iconCls : 'icon_cancel',
			handler : function(btn){
				me.close();
			}
		}];
		me.items = [{
			xtype : 'form',
			defaults : {
				labelAlign: 'right',
                width : 380
			},
			bodyStyle : {
				padding : '5px'
			},
			itemId : 'form',
			items : [{
				xtype : 'combo',
				allowBlank : false,
				itemId : "faceType",
				name :'faceType',
				fieldLabel : i18n.getKey('applyToFace'),
				store : Ext.create("CGP.builderbackground.store.SelectFace"),
				valueField : 'id',
				displayField : 'name',
				listeners : {
					change : function(field,value,oldValue){
						var imageTypeField = me.getComponent("form").getComponent("imageType")
						var imageType = imageTypeField.getValue();
						if(imageType != null && value != null){
							var is = me.controller.validate(value,imageType);
							if(!is){
								var message = i18n.getKey('applyToFace ')+":"+field.getRawValue()+","+i18n.getKey('imageType')
											+":"+imageTypeField.getRawValue()+ i18n.getKey('isExist');
								Ext.Msg.alert(i18n.getKey('prompt'),message);
								field.setValue();
							}
						}
					}
				}
			},{
				xtype : 'combo',
				itemId : 'imageType',
				allowBlank : false,
				name : 'type',
				fieldLabel : i18n.getKey('imageType'),
				store : Ext.create("CGP.builderbackground.store.ImageType"),
				displayField : 'name',
				valueField : 'value',
				listeners : {
					change : function(field,value,oldValue){
						var faceTypeField = me.getComponent("form").getComponent("faceType")
						var faceType = faceTypeField.getValue();
						if(faceType != null && value != null){
							var is = me.controller.validate(faceType,value);
							if(!is){
								var message = i18n.getKey('applyToFace ')+":"+faceTypeField.getRawValue()+","+i18n.getKey('imageType')
											+":"+field.getRawValue()+ i18n.getKey('isExist');
								Ext.Msg.alert(i18n.getKey('prompt'),message);
								field.setValue();
							}
						}
					}
				}
			},{
				xtype : 'filefield',
				editable : false,
				disableKeyFilter : true,
				allowBlank : false,
//				errorText : "该输入项为必输项",
				name : 'files',
				itemId : "files",
				buttonText : i18n.getKey('browser'),
				fieldLabel : i18n.getKey('image'),
				buttonConfig : {
					width : 70
				}
//				width : 580,
//				height : 180
			}]
		}]
		
		
		me.callParent(arguments);
	}
});