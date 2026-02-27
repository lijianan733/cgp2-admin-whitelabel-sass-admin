Ext.define("CGP.cmspublish.view.PublishTask",{
    extend : 'Ext.window.Window',
    mixins : ["Ext.ux.util.ResourceInit"],
    requires : ["CGP.cmspublish.store.CmsPublishTask"],

    grid : null,//window中的主体一个 GridPanel（作用显示选项）
    controller : null,//MainController(为了调controller中的方法)
    store : null, //选项store
    cmspublishId : null,//对应属性的Id



    modal: true,
    closeAction: 'hidden',
    width: 600, //document.body.clientWidth / 2,
    height: 370, //document.body.clientHeight / 1.5,
    layout: 'border',



    initComponent : function(){
        var me = this;

        me.store = Ext.create("CGP.cmspublish.store.CmsPublishTask",{
            id : me.cmspublishId
        });
        me.callParent(arguments);
        me.on("beforeclose",function(cmp){
            if(me.controller.addcmspublishWindow != null){
                me.controller.addcmspublishWindow.close();
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
                        me.controller.openAddOptionWindow(record);
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
                dataIndex: 'type',
                width : 140,
                text: i18n.getKey('type'),
                editor: {
                    allowBlank: false
                },
                renderer:function(value){
			                  	if(value=='SET_VARIABLE'){
			                  		return i18n.getKey('SET_VARIABLE');
			                  	   }
			                  	if(value=='GENERATE_TEMPLATES'){
			                  		return i18n.getKey('GENERATE_TEMPLATES');
			                  	}
			                  	else {
			                        return i18n.getKey('SHELL_CMD');
			                    }
			                 }
            }, {
                dataIndex: 'command',
                width : 140,
                text: i18n.getKey('taskCommand'),
                editor: {
                    allowBlank: false
                }
            }, {
                dataIndex: 'sortOrder',
                text: i18n.getKey('sortOrder'),
                editor: {
                    allowBlank: false
                }
            }, {
                dataIndex: 'description',
                width : 140,
                text: i18n.getKey('description'),
                editor: {
                    allowBlank: true
                },
                renderer : function(value,metadata){
                    metadata.tdAttr = "data-qtip='"+value+"'";
                    return value;
                }
            }],
            tbar: [{
                text: i18n.getKey('addPublishTask'),
                handler: function(button){
                    me.controller.openAddOptionWindow(null);
                }
            }]
        });
        me.add(me.grid);
    },

    refresh : function(cmspublishId){
        var me = this;
        var newUrl = Ext.clone(me.store.url);
        me.store.proxy.url = Ext.String.format(newUrl, cmspublishId);
        me.store.load();
    }
});