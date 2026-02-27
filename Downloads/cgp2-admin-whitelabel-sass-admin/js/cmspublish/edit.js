Ext.syncRequire(['CGP.cmspublish.model.CmsPublishModel','CGP.cmspublish.model.CmsPublishTask']);
Ext.onReady(function () {





    var controller = Ext.create("CGP.cmspublish.controller.EditController");

    var optionGrid = {
        selModel: new Ext.selection.RowModel({
            mode: 'MULTI'
        }),
        store: Ext.create("CGP.cmspublish.store.LocalCmsPublishTask"),
        height: 200,
        width: 510,

        columns: [{
            xtype: 'actioncolumn',
            itemId: 'actioncolumn',
            width : 60,
            sortable: false,
            resizable: false,
            menuDisabled: true,
            items: [{
                iconCls : 'icon_edit icon_margin',
                itemId : 'actionedit',
                tooltip : 'Edit',
                handler : function(view, rowIndex, colIndex){
                    var store = view.getStore();
                    var record = store.getAt(rowIndex);
                    controller.openOptionWindow(page,record);
                }
            },{
                iconCls: 'icon_remove icon_margin',
                itemId: 'actionremove',
                tooltip: 'Remove',
                handler: function (view, rowIndex, colIndex) {
                    var store = view.getStore();
                    store.removeAt(rowIndex);
                }
            }]
        },{
            text: i18n.getKey('command'),               dataIndex: 'type',
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
           },{
            text: i18n.getKey('command'),
           sortable : false,
            dataIndex: 'command',
            editor: {
                allowBlank: false
            }
        }, {
            text: i18n.getKey('type'),
            sortable : false,
            dataIndex: 'type',
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


        },{
            text: i18n.getKey('sortOrder'),
            dataIndex: 'sortOrder',
            sortable : true,
            editor: {
                xtype: 'numberfield'
            }
        }, {
            text: i18n.getKey('description'),
            sortable : false,
            dataIndex: 'description',
            editor: {
                allowBlank: false
            },
            renderer: function(value, metadata){
                metadata.tdAttr = 'data-qtip ="'+ value +'"';
                return value;
            }
        }],
        tbar: [{
            text: i18n.getKey('addPublishTask'),
            handler: function () {
                controller.openOptionWindow( page,null );
            }
        }]

    }

    var page = Ext.widget({
        block: 'cmspublish',
        xtype: 'uxeditpage',
        gridPage: 'main.html',
        formCfg: {
            layout: {
                layout: 'table',
                columns: 1,
                tdAttrs: {
                    style: {
                        'padding-right': '120px'
                    }
                }
            },
            model: 'CGP.cmspublish.model.CmsPublishModel',
            items: [{
                name: 'name',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                itemId: 'name',
                allowBlank: false
            }, {
                name: 'description',
                xtype: 'textarea',
                fieldLabel: i18n.getKey('description'),
                itemId: 'description',
                allowBlank: false
            }, {
                name: 'tasks',
                xtype: 'gridfield',
                gridConfig: optionGrid,
                fieldLabel: i18n.getKey('publishTasks'),
                itemId: 'tasks',
                id: 'tasks'
            }]
        }
    });
});