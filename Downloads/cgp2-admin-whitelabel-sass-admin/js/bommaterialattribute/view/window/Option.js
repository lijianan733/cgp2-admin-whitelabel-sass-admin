Ext.define("CGP.bommaterialattribute.view.window.Option",{
	extend : 'Ext.window.Window',
	mixins : ["Ext.ux.util.ResourceInit"],
	requires : ["CGP.bommaterialattribute.store.AttributesOptions"],
	
	grid : null,//window中的主体一个 GridPanel（作用显示选项）
	controller : null,//MainController(为了调controller中的方法)
	store : null, //选项store
	attributeId : null,//对应属性的Id
	gridPageValueType:null,
    recordww:null,
    modal: true,
    closeAction: 'hidden',
    width: 500, //document.body.clientWidth / 2,
    height: 370, //document.body.clientHeight / 1.5,
    layout: 'border',
    draggable: false,

    
    
    initComponent : function(){
    	var me = this;
    	me.store = Ext.create("CGP.bommaterialattribute.store.AttributesOptions",{
    		id : me.attributeId
    	});
    	me.callParent(arguments);
    	me.on("beforeclose",function(cmp){
    		if(me.controller.addOptionWindow != null){
    			me.controller.addOptionWindow.close();
    		}
    	});

    	me.grid = Ext.create("Ext.grid.Panel",{
                store: me.store,
                region: 'center',
                columns: [{
                        xtype: 'actioncolumn',
                        //itemId: 'actioncolumn',
                        width: 60,
                        items: [{
                        	iconCls : 'icon_edit',
                        	itemId : 'actionedit',
                        	tooltip : 'Edit',
                        	handler : function(view, rowIndex, colIndex, item, e, record){
                        		me.controller.openAddOptionWindow(record,gridPageValueType);
                        	}
                        },{
                            iconCls: 'icon_remove',
                            itemId: 'actionremove',
                            tooltip : 'Remove',
                            handler: function(view, rowIndex, colIndex, item, e, record, row){
                            	Ext.MessageBox.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'),function(option){
                            		if(option == "yes"){
                            			view.getStore().remove(record);
                            		}
                            	});
                            }
                        }]
	            },{
                        dataIndex: 'name',
                        width : 140,
                        text: i18n.getKey('name'),
                        editor: {
                            allowBlank: false
                        }
                },{
                        dataIndex: 'value',
                        width : 140,
                        text: i18n.getKey('value'),
                        editor: {
                            allowBlank: false
                        }
                },{
                        dataIndex: 'sortOrder',
                        text: i18n.getKey('sortOrder'),
                        editor: {
                            allowBlank: false
                        }
                }],
                tbar: [{
                    text: i18n.getKey('addOption'),
                    handler: function(button){
                    	me.controller.openAddOptionWindow(null,gridPageValueType);
                    }
                }]
            });
         me.add(me.grid);
    },
    
    refresh : function(attributeId){
    	var me = this;
    	var newUrl = Ext.clone(me.store.url);
    	me.store.proxy.url = Ext.String.format(newUrl, attributeId);
        me.store.load();
    }
});