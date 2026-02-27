Ext.define("CGP.product.view.embellishment.SelectEmbellishment",{
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

		
		me.store = Ext.create("CGP.product.store.BuilderEmbellishment",{
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
		
		var embellishmentClassStore = Ext.create("CGP.product.store.BuilderEmbellishmentClass",{
			listeners : {
				load : function(store){
					var grid = me.getComponent("background").down("grid");
					grid.getView().refresh();
				}
			}
		});
		
		me.title = i18n.getKey('selectEmbellishment');
		me.items = [{
			xtype : 'fieldcontainer',
			fieldLabel : i18n.getKey('embellishment'),
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
		                sortable: true,
		                width : 50
		   			},  {
		                dataIndex: 'name',
		                text: i18n.getKey('name'),
		                sortable: false,
		                itemId: 'name',
		                tdCls: 'vertical-middle'
		            }, {
		                dataIndex: 'format',
		                text: i18n.getKey('format'),
		                sortable: false,
		                itemId: 'format',
		                tdCls: 'vertical-middle',
		                width : 50
		            }, {
		                dataIndex: 'width',
		                text: i18n.getKey('width'),
		                sortable: false,
		                itemId: 'width',
		                width : 70,
		                tdCls: 'vertical-middle'
		            }, {
		                dataIndex: 'height',
		                text: i18n.getKey('height'),
		                sortable: false,
		                itemId: 'height',
		                width : 70,
		                tdCls: 'vertical-middle'
		            }, {
		                dataIndex: 'originalFileName',
		                text: i18n.getKey('originalFileName'),
		                sortable: false,
		                itemId: 'originalFileName',
		                tdCls: 'vertical-middle',
		                width : 160
		            },{
		   				text : i18n.getKey('builderembellishmentclass'),
		   				dataIndex : 'bbgClasses',
		   				width : 270,
		   				renderer : function(value, metadata, record){
		   					if(Ext.isEmpty(embellishmentClassStore.data.items)){
		   						return "";
		   					}else{
		   						var result = "";
		   						for(var i = 0; i < value.length; i++){
		   							var record = embellishmentClassStore.getById(value[i]);
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
					height : 150,
					defaults : {
						width : 280
					},
					items : [{
		                name: 'id',
		                xtype: 'numberfield',
		                hideTrigger: true,
		                fieldLabel: i18n.getKey('id'),
		                itemId: 'id'
		            },{
		                name: 'name',
		                itemId: 'nameSearchField',
		                fieldLabel: i18n.getKey('name'),
		                xtype: 'textfield'
		            }, {
		                name: 'format',
		                itemId: 'formatSearchField',
		                fieldLabel: i18n.getKey('format'),
		                xtype: 'textfield'
		            }, {
		                name: 'width',
		                itemId: 'widthSearchField',
		                fieldLabel: i18n.getKey('width'),
		                xtype: 'numberfield'
		            }, {
		                name: 'height',
		                itemId: 'heightSearchField',
		                fieldLabel: i18n.getKey('height'),
		                xtype: 'numberfield'
		            }, {
		                name: 'originalFileName',
		                itemId: 'originalFileNameSearchField',
		                fieldLabel: i18n.getKey('originalFileName'),
		                xtype: 'textfield'
		            }, {
		                name: 'bbgClass',
		                id: 'bbgClassesSearchField',
		                itemId: 'bbgClass',
		                fieldLabel: i18n.getKey('embellishmentclass'),
		                xtype: 'gridcombo',
		                multiSelect: false,
		                displayField: 'name',
		                valueField: 'id',
		                labelAlign: 'right',
		                store: embellishmentClassStore,
		                queryMode: 'remote',
		                matchFieldWidth: false,
		                pickerAlign: 'bl',
		                gridCfg: {
		                    store: embellishmentClassStore,
		                    height: 200,
		                    width: 400,
		                    columns: [{
		                        text: i18n.getKey('id'),
		                        width: 40,
		                        dataIndex: 'id'
		     				}, {
		                        text: i18n.getKey('name'),
		                        width: 120,
		                        dataIndex: 'name'
		     				}, {
		                        text: i18n.getKey('description'),
		                        width: 200,
		                        dataIndex: 'description'
		     				}],
		                    bbar: Ext.create('Ext.PagingToolbar', {
		                        store: embellishmentClassStore,
		                        displayInfo: true
		                    })
		                }
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
