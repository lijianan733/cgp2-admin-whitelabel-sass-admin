Ext.define("CGP.product.view.background.SelectBackground",{
	extend : 'Ext.window.Window',
	

	controller : null,
	filterData : null,
	modal : true,
	
	bodyStyle : {
		padding : '5px'
	},
	
	width : 1070,
	height : 630,
	initComponent : function(){
		var me = this;

		
		me.store = Ext.create("CGP.product.store.BuilderBackground",{
//			filterData : me.filterData
		});
		me.bbar = ["->",{
			text : i18n.getKey('ok'),
			width : 80,
			handler : function(){
				var value = me.getValue();
				if(!Ext.isEmpty(value)){
					me.controller.addBackground(value);
				}
				me.close();
			}
		},{
			text : i18n.getKey('cancel'),
			width : 80,
			handler : function(){
				me.close();
			}
		}];
		
		var backgroundClassStore = Ext.create("CGP.product.store.BuilderBackgroundClass",{
			listeners : {
				load : function(store){
					var grid = me.getComponent("background").down("grid");
					grid.getView().refresh();
				}
			}
		});
		
		me.title = i18n.getKey('selectBackground');
		me.items = [{
			xtype : 'fieldcontainer',
			fieldLabel : i18n.getKey('builderbackground'),
			itemId : 'background',
			labelAlign : 'right',
			items : [Ext.create("CGP.common.commoncomp.QueryGrid",{
				gridCfg : {
					editAction: false,
	        		deleteAction: false,
					store : me.store,
					multiSelect : true,
					columns : [{
		                text: i18n.getKey('id'),
		                dataIndex: 'id',
		                xtype: 'gridcolumn',
		                itemId: 'id',
		                sortable: true
		   			}, {
		                text: i18n.getKey('name'),
		                dataIndex: 'name',
		                xtype: 'gridcolumn',
		                itemId: 'name',
		                sortable: false
		   			}, {
		                text: i18n.getKey('keywords'),
		                dataIndex: 'keywords',
		                xtype: 'gridcolumn',
		                itemId: 'keywords',
		                sortable: false
		   			}, {
		                text: i18n.getKey('description'),
		                dataIndex: 'description',
		                xtype: 'gridcolumn',
		                itemId: 'description',
		                sortable: false,
		                minWidth : 150
		   			},{
		   				text : i18n.getKey('applyToFace'),
		   				dataIndex : 'backgroundFaces',
		   				xtype : 'gridcolumn',
		   				itemId : 'backgroundFaces',
		   				sortable : false,
		   				renderer : function(value,metadata,record){
		   					var faces = record.get("backgroundFaces");
		   					var valueStr = "";
		   					for(var i = 0; i < faces.length; i++){
		   						valueStr = valueStr + faces[i].name;
								if(i <faces.length -1){
									valueStr = valueStr + ",";
								}   					
		   					}
		   					return valueStr;
		   				}
		   			},{
		   				text : i18n.getKey('builderbackgroundclass'),
		   				dataIndex : 'backgroundClassIds',
		   				renderer : function(value, metadata, record){
		   					if(Ext.isEmpty(backgroundClassStore.data.items)){
		   						return "";
		   					}else{
		   						var result = "";
		   						for(var i = 0; i < value.length; i++){
		   							var record = backgroundClassStore.getById(value[i]);
		   							result = result + record.get("name");
		   							if(i < value.length - 1)
		   								result = result + ",";
		   						}
		   						return result;
		   					}
		   				}
		   			}]
				},
				filterCfg : {
					height : 120,
					defaults : {
						width : 280
					},
					items : [{
		                name: 'id',
		                xtype: 'numberfield',
		                hideTrigger: true,
		                fieldLabel: i18n.getKey('id'),
		                itemId: 'id'
		            }, {
		                name: 'name',
		                xtype: 'textfield',
		                fieldLabel: i18n.getKey('name'),
		                itemId: 'name'
		            }, {
		                name: 'keywords',
		                xtype: 'textfield',
		                fieldLabel: i18n.getKey('keywords'),
		                itemId: 'keywords'
		            },{
		            	name : "backgroundClass",
		            	xtype : 'combo',
		            	store : Ext.create("CGP.product.store.BuilderBackgroundClass"),
		            	displayField : "name",
		            	valueField : 'id',
		            	fieldLabel : i18n.getKey('builderbackgroundclass'),
		            	itemId : 'backgroundClass'
		            },{
		            	name : 'faceCode',
		            	xtype : "combo",
		            	store : Ext.create("CGP.builderbackground.store.SelectFace"),
		            	displayField : 'name',
		            	valueField : 'code',
		            	fieldLabel : i18n.getKey('applyToFace'),
		            	itemId : "faceCode"
		            },{
		            	xtype : 'textfield',
		            	name : 'excludeIds',
		            	hidden : true,
		            	value : function(){
		            		if(Ext.isEmpty(me.filterData)){
		            			return ;
		            		}else{
		            			var value = [];
		            			for(var i = 0 ; i < me.filterData.length;i++){
		            				value.push( me.filterData[i].get("id"));
		            			}
		            			return value.join(",");
		            		}
		            	}()
		            }]
				}
			})]
		}]; 
		me.callParent(arguments);
	},
	getValue : function(){
		var me = this;
		var grid = me.getComponent("background").down("grid");
		return grid.getSelectionModel().getSelection();
	}
});
