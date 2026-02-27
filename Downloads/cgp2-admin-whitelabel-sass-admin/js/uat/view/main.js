Ext.onReady(function(){


	
	var urlParams = Ext.Object.fromQueryString(location.search);
	
	var mainController = Ext.create("CGP.uat.controller.MainController");
	
	var mainPage = Ext.create("Ext.ux.ui.GridPage",{
		i18nblock : i18n.getKey('uat'),
		block : 'uat',
		editPage : 'edit.html',
		tbarCfg : {
//			disabledButtons : ["delete"],
			hiddenButtons: ["delete"],
			btnCreate :{
				handler: function () {
					var modelfun = Ext.ModelManager.getModel("CGP.uat.model.UAT");
					model = modelfun.create();
					model.set("uatLogs",null);
					model.set("type",urlParams.type);
					webModel = Ext.getCmp("websiteSearchField").getStore().getById(Number(urlParams.website));
					model.set("website",webModel.data);
                    mainController.openCreateWindow(model, mainPage);
                }
			}
		},
		gridCfg : {
			store : Ext.create("CGP.uat.store.UATStore"),
			frame : true,
			deleteAction : false,
			editAction : false,
			columns : [{
				sortable : false,
				text : i18n.getKey('operator'),
				xtype : 'componentcolumn', 
				itemId : "operation",
				width : 100,
				renderer : function(value, metadata, record){
					return Ext.create("Ext.toolbar.Toolbar",{
						layout: 'column',
						'default': {
		                    width: 100
		                },
						style : 'padding : 0',
						items : [{
							width : "100%",
							text : i18n.getKey('options'),
							flex : 1,
							menu : {
								xtype : 'menu',
								items : [{
									text : i18n.getKey('edit'),
									disabledCls : 'menu-item-display-none',
									disabled : record.get("status") != "PENDING",
									handler : function(){
										mainController.openCreateWindow(record,mainPage);
									}
								},{
									text : i18n.getKey('approval'),
									disabledCls : 'menu-item-display-none',
									disabled : record.get("status") != "PENDING",
									handler : function(){
										mainController.openConfirmedWindow(record,mainPage);
									}
								},{
									text : i18n.getKey('checkLogs'),
									disabledCls : 'menu-item-display-none',
									disabled : record.get("status") == "PENDING",
									handler : function(){
										mainController.OpenLogsWindow(record);
									}
								}]
							}
						}] 
					});
				}
			},{
				text : i18n.getKey('id'),
				itemId : 'id',
				dataIndex : 'id'
			},{
				text : i18n.getKey('name'),
				itemId : 'name',
				dataIndex : 'name'
			},{
				text : i18n.getKey('status'),
				itemId : 'status',
				dataIndex : 'status',
				renderer: function(value,metadata){
					if(value == "REJECTED"){
						metadata.style = 'color : red';
					}else if(value == "CONFIRMED"){
						metadata.style = 'color : green';
					}else if(value == "CANCELLED"){
						metadata.style = 'color : gray';
					}
					return i18n.getKey(value);
				}
			},{
				text : i18n.getKey('approver'),
				width :130,
				itemId : 'confirmedBy', 
				dataIndex : 'confirmedBy'
			},{
				text : i18n.getKey('confirmedDate'),
				itemId : 'confirmedDate',
				dataIndex : 'confirmedDate',
				align: 'center',
				renderer: function(value, metadata){
					if(value == null){
						return "";
					}
					value = Ext.Date.format(value,"Y/m/d H:i");
					metadata.style = 'color : gray';
					metadata.tdAttr = "data-qtip = '"+value+"'";
					return  '<div style="white-space:normal;">' + value + '</div>'
				}
			},{
				text : i18n.getKey('description'),
				itemId : 'description',
				width : 200,
				dataIndex : 'description',
				renderer: function(value,metadata){
					metadata.style="white-space:normal;";
					metadata.tdAttr = "data-qtip='<div>"+value+"</div>'";
					if(value != null && value.length > 50){
						value = value.substring(0,50) + "...";
					}
					return value;
				}
			},{
				text : i18n.getKey('type'),
				itemId : 'type',
				dataIndex : 'type',
				renderer : function(value,metadata){
					return  i18n.getKey(value);
				}
			},{
				text : i18n.getKey('website'),
				itemId : 'website',
				width : 180,
				dataIndex : 'website',
				renderer : function(value){
					return value["name"]
				}
			}]
		},
		filterCfg : {
			height : 130,
            items: [{
                id: 'idSearchField',
                name: 'id',
                xtype: 'numberfield',
                hideTrigger: true,
                fieldLabel: i18n.getKey('id'),
                itemId: 'id'
     		}, {
                id: 'nameSearchField',
                name: 'name',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                itemId: 'name'
     		},{
     			id: 'statuSearchField',
     			name : 'status',
     			xtype : 'combo',
     			store : Ext.create("Ext.data.Store",{
     				fields :["value","display"],
     				data : [{
     					value : null, display : i18n.getKey('allStatus')},{
     					value : 'REJECTED',display: i18n.getKey('REJECTED')},{
     					value : "CONFIRMED",display : i18n.getKey('CONFIRMED')},{
     					value : 'CANCELLED',display : i18n.getKey('CANCELLED')},{
     					value : 'PENDING' ,display : i18n.getKey('PENDING')}]
     			}),
     			valueField : 'value',
     			displayField : 'display',
     			fieldLabel : i18n.getKey('status'),
     			itemId : 'status',
     			listeners : {
     				afterrender : function(combo){
     					combo.select(combo.getStore().getAt(0));
     				}
     			}
     		},{
     			id : 'approverSearchField',
     			name : 'confirmedBy',
     			xtype : 'textfield',
     			fieldLabel : i18n.getKey('approver'),
     			itemId : 'confirmedBy'
     		},{
     			id : 'typeSearchField',
     			name : 'type',
     			hidden : true,
     			xtype : "textfield",
     			fieldLabel : 'type',
     			itemId : 'type',
     			value : urlParams.type //getQueryString("type")
     		},{
     			id : 'websiteSearchField',
     			name : 'website.id',
     			xtype : 'combo',
     			hidden : true,
     			fieldLabel : 'website',
     			itemId : 'website',
     			queryMode: 'remote',
			    displayField: 'name',
			    valueField: 'id',
     			store : Ext.create("CGP.uat.store.WebsiteStore"),
     			value: Number(urlParams.website)
     		}]
		}
	});
	
});