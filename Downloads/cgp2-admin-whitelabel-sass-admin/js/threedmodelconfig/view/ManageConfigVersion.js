Ext.define("CGP.threedmodelconfig.view.ManageConfigVersion", {
    extend: 'Ext.window.Window',
    mixins: ["Ext.ux.util.ResourceInit"],
    requires: ["CGP.attribute.store.AttributeOption"],

    grid: null,//window中的主体一个 GridPanel（作用显示选项）
    controller: null,//MainController(为了调controller中的方法)
    store: null, //选项store
    attributeId: null,//对应属性的Id


    modal: true,
    closeAction: 'hidden',
    width: 850, //document.body.clientWidth / 2,
    height: 370, //document.body.clientHeight / 1.5,
    layout: 'border',


    initComponent: function () {
        var me = this;
        me.store = Ext.create("CGP.threedmodelconfig.store.ConfigVersionStore", {
            id: me.recordId
        });
        me.callParent(arguments);
        me.on("beforeclose", function (cmp) {
            if (me.controller.addOptionWindow != null) {
                me.controller.addOptionWindow.close();
            }
        });

        me.grid = Ext.create("Ext.grid.Panel", {
            store: me.store,
            region: 'center',
            viewConfig: {
                enableTextSelection: true
            },
            columns: [
                {
                    xtype: 'actioncolumn',
                    //itemId: 'actioncolumn',
                    width: 60,
                    items: [
                        {
                            iconCls: 'icon_edit',
                            itemId: 'actionedit',
                            tooltip: 'Edit',
                            handler: function (view, rowIndex, colIndex, item, e, record) {
                                me.controller.openAddOptionWindow(record,me.valueType);
                            }
                        },
                        {
                            iconCls: 'icon_remove',
                            itemId: 'actionremove',
                            tooltip: 'Remove',
                            handler: function (view, rowIndex, colIndex, item, e, record, row) {
                                Ext.MessageBox.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (option) {
                                    if (option == "yes") {
                                        var store = view.getStore();
                                        //store.suspendAutoSync();
                                        store.remove(record);
                                        //store.resumeAutoSync();
                                        //store.loadData([],false);
                                        store.removed = [];
                                    }
                                });
                            }
                        }
                    ]
                },
                {
                    dataIndex: '_id',
                    width: 100,
                    text: i18n.getKey('id'),
                    editor: {
                        allowBlank: false
                    }
                },
                {
                    dataIndex: 'status',
                    width: 140,
                    text: i18n.getKey('status'),
                    renderer: function(value, metadata){
                        metadata.tdAttr = 'data-qtip ="'+ value +'"';
                        return value;
                    }
                },{
                    dataIndex: 'version',
                    width: 140,
                    text: i18n.getKey('version'),
                    renderer: function(value, metadata){
                        metadata.tdAttr = 'data-qtip ="'+ value +'"';
                        return value;
                    }
                },{
                    dataIndex: 'engine',
                    width: 140,
                    text: i18n.getKey('engine'),
                    renderer: function(value, metadata){
                        metadata.tdAttr = 'data-qtip ="'+ value +'"';
                        return value;
                    }
                },
                {
                    dataIndex: 'structVersion',
                    text: i18n.getKey('structVersion'),
                    editor: {
                        allowBlank: false
                    }
                },
                {
                    dataIndex: 'modelFileName',
                    width: 140,
                    text: i18n.getKey('modelFileName'),
                    editor: {
                        allowBlank: true
                    },
                    renderer: function (value, metadata) {
                        metadata.tdAttr = "data-qtip='" + value + "'";
                        return value;
                    }
                }
            ],
            tbar: [
                {
                    text: i18n.getKey('addOption'),
                    iconCls: 'icon_create',
                    handler: function (button) {
                        me.controller.openAddOptionWindow(null,me.valueType);
                    }
                }
            ]
        });
        me.add(me.grid);
    },

    refresh: function (attributeId) {
        var me = this;
        var newUrl = Ext.clone(me.store.url);
        me.store.proxy.url = Ext.String.format(newUrl, attributeId);
        me.store.load();
    }
});