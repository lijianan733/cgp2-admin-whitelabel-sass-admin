Ext.define("CGP.customer.controller.EditController",{
	

	constructor : function(config){
		var me = this;

		me.callParent(arguments);
	},
	
	selectRoleWindow : null, 
	roleField : null,
	
	openModifyRoleWindow : function(roleField){
		var me = this;
		me.roleField = roleField;
		
		var allRoleStore = Ext.create('CGP.customer.store.AllRoleStore');
		
		me.selectRoleWindow = Ext.create('Ext.window.Window', {
    		title : i18n.getKey('setRole'),
    		modal : true,
    		closeAction: 'destroy',
            width: 590,
            height:   490,     
            minHeight : 480,
            draggable: true,
            bbar: ["->",{
			  	xtype: 'button',
			  	itemId: 'btnSave',
                iconCls: 'icon_save',
			  	text: i18n.getKey('ok'),
			  	width :80,
			  	handler : function(btn){
			  		var grid = me.selectRoleWindow.getComponent('rolesId')._grid;
			  		me.modifyRole(grid);
			  		me.selectRoleWindow.close();
			  	} 
			},{
				xtype : 'button',
				width : 80,
                iconCls: 'icon_cancel',
				text: i18n.getKey('cancel'),
				handler : function(){
					me.selectRoleWindow.close();
				}
			}],
            items: [{
    			itemId: 'rolesId',
                xtype : 'gridfieldselect',
                fieldLabel: i18n.getKey('role'),
                labelWidth : 60,
		        labelAlign: 'right',
				gridConfig :{
					height : 400,
					autoScroll : true,
					width : 470,
					renderTo : 'custEditAddRoles',
				    store: allRoleStore,
                    selModel: new Ext.selection.CheckboxModel({
                        checkOnly: true
                    }),
				    columns: [{
                        text: i18n.getKey('name'),
                        width: 210,
                        dataIndex: 'name'
         			},{
                        text: i18n.getKey('description'),
                        width :210,
                        dataIndex: 'description'
         			}],
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: allRoleStore,
                        displayInfo: true,
                        //displayMsg: 'Displaying {0} - {1} of {2}',
                        emptyMsg: i18n.getKey('noData'),
                        listeners : {
                        	change :function(){
			    				var records = me.roleField.getStore().data.items;
			    				me.setSelectRecord(records);
			    			}
                        }
                    }),
                    listeners : {
//                    	deselect : desselect,
//						select : selectClass
                    }
				}
    		}],
    		listeners : {
    			afterrender : function(){
    				var records = me.roleField.getStore().data.items;
    				me.setSelectRecord(records);
    			}
    		}
    		
    	});
    	me.selectRoleWindow.show();
	},
	modifyRole  : function(roleGrid){
		var me = this;
		var roleModels = roleGrid.getSelectionModel().getSelection();
		me.roleField.setSubmitValue(roleModels);
	},
	setSelectRecord : function(records){
		var me = this, grid = me.selectRoleWindow.getComponent('rolesId')._grid;
		var selectModel = grid.getSelectionModel();
		
		for (var i = 0; i < records.length; i++) {
			var selectClassModel = grid.store.getById(records[i].get("id"));
			if (selectClassModel != null) {
				selectModel.select(selectClassModel, true);
			}
		}
	}
});