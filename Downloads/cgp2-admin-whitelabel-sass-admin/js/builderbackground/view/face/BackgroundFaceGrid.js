Ext.define("CGP.builderbackground.view.face.BackgroundFaceGrid",{
	extend : 'Ext.form.FieldContainer',
	alias : ['widget.backgroundfacegrid'],
	mixins : ["Ext.form.field.Field"],
	

	
	controller : null,//这个field的controller对象
	allowBlank : false,
	
	initComponent : function(){
		var me = this;

		
		me.controller = Ext.create("CGP.builderbackground.controller.BackgroundFaceGrid");
		
		me.grid = Ext.create("Ext.grid.Panel",{
			store : me.store,
			width : 664,
			minHeight : 400,
			features : [{
				ftype : "groupingsummary",
				groupHeaderTpl : i18n.getKey('applyToFace') + ':{name}'
			}],
			columns : [{
				 xtype: 'actioncolumn',
                 itemId: 'actioncolumn',
                 width : 50,
                 sortable: false,
                 resizable: false,
                 menuDisabled: true,
                 tdCls: 'vertical-middle',
                 items: [{
                 	iconCls: 'icon_remove icon_margin',
                    itemId: 'actiondelete',
                    tooltip: i18n.getKey('destroy'),
                    handler: function(view,rowIndex,colIndex,item,e,record,row){
                    	view.getStore().remove(record);
                    }
                 }]
			},{
                text: i18n.getKey('thumbnail'),
                itemId: 'name',
                renderer: function (value, metadata, record) {
                    var url = imageServer + record.get('name') + '/50/50/png';
                    return '<img src="' + url + '" />';
                }
			},{
				dataIndex: 'originalFileName',
				text : i18n.getKey('name')
			},{
				dataIndex : 'type',
				text: i18n.getKey('type'),
				renderer : function(value,metadata,record){
					return i18n.getKey(value);
				} 
			},{
				dataIndex : 'format',
				text : i18n.getKey('format')
			},{
				dataIndex : 'width',
				text : i18n.getKey('width')
			},{
				dataIndex : 'height',
				width : 100,
				text : i18n.getKey('height')
			}],
			tbar : [{
				text : i18n.getKey('add'),
				width : 80,
				handler : function(btn){
					var canAdd = me.controller.canAdd(me.store);
					if(canAdd){
						me.controller.add(me);
					}else{
						Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('imageFilledWith'));
					}
				}
			}]
		});
		me.items = [me.grid];
		me.callParent(arguments);
	},
	
	getSubmitValue : function(){
		var me = this,store = me.grid.store,value = [];
		store.each(function(record){
			var exist = false;
			for(var i = 0; i < value.length; i++){
				if( value[i].type == record.get("faceType")){
					exist = true;
					var objData = record.data;
//					delete data.objData;
//					delete data.faceName;
					value[i].backgroundImages.push(objData);
				}
			}
			if(exist == false){
				var obj = {};
				obj.type = record.get("faceType");
				var data = record.data;
//				delete data.faceType;
//				delete data.faceName;
				obj.backgroundImages = [data];
				value.push(obj);
			}
		});
		store.removeAll();
		return  value ;
	},
	
	setSubmitValue : function(value){
		var me = this, store = me.grid.store,recordData = [];
		for(var i = 0; i < value.length; i++){
			var  imgs = value[i].backgroundImages;
			for(var j = 0; j < imgs.length ; j++){
				var obj = {};
				obj = imgs[j];
				obj.faceType = value[i].type;
				obj.faceName = value[i].name;
				recordData.push(obj);
			}
		}
		store.add(recordData);
	},
	

	getErrors  : function(){
		var me = this,store = me.grid.getStore();
		if(me.allowBlank == false){
			if(Ext.isEmpty(store.data.items)){
				return Ext.create("Ext.form.field.Text").blankText;
			}
		}
		
	}
});