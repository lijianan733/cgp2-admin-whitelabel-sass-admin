Ext.define("CGP.attribute.view.window.Option", {
    extend: 'Ext.window.Window',
    mixins: ["Ext.ux.util.ResourceInit"],
    requires: ["CGP.attribute.store.AttributeOption"],

    grid: null,//window中的主体一个 GridPanel（作用显示选项）
    controller: null,//MainController(为了调controller中的方法)
    store: null, //选项store
    attributeId: null,//对应属性的Id


    modal: true,
    //closeAction: 'hidden',
    width: 850, //document.body.clientWidth / 2,
    height: 370, //document.body.clientHeight / 1.5,
    layout: 'border',


    initComponent: function () {
        var me = this;
        me.store = Ext.create("CGP.attribute.store.AttributeOption", {
            remoteSort: false,
            id: me.attributeId,
            listeners: {
                load: function (store, records) {
                    store.sort('sortOrder', 'ASC');
                }
            }
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
                enableTextSelection: true,
                listeners: {
                    drop: function (node, Object, overModel, dropPosition, eOpts) {
                        var view = this;
                        view.ownerCt.mask('处理中..');
                        this.store.suspendAutoSync();//挂起数据同步
                        view.ownerCt.suspendLayouts();//挂起布局
                        view.store.suspendEvents(true);//挂起事件粗触发，false表示丢弃事件，true表示阻塞事件队列*/
                        var data = this.store.data.items;
                        for (var i = 0; i < data.length; i++) {
                            data[i].index = i;
                            data[i].set('sortOrder', i);
                        }
                        this.store.sync({
                            callback: function () {
                                view.ownerCt.unmask();
                                view.store.resumeEvents();//恢复事件触发
                                view.ownerCt.resumeLayouts();
                            }
                        });//同步数据

                    }
                },
                plugins: {
                    ptype: 'gridviewdragdrop',
                    dragText: 'Drag and drop to reorganize',
                }
            },
            columns: [
                {
                    xtype: 'rownumberer',
                    autoSizeColumn: false,
                    itemId: 'rownumberer',
                    width: 45,
                    resizable: true,
                    menuDisabled: true,
                    tdCls: 'vertical-middle'
                },
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
                                me.controller.openAddOptionWindow(record, me.valueType);
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
                                        /*store.sync({
                                            success: function(batch) {
                                                console.log('The User Details was sync');
                                                store.load();
                                            }
                                        });*/
                                    }
                                });
                            }
                        }
                    ]
                },
                {
                    dataIndex: 'id',
                    width: 100,
                    text: i18n.getKey('id'),
                    editor: {
                        allowBlank: false
                    }
                },
                {
                    dataIndex: 'name',
                    width: 140,
                    text: i18n.getKey('name'),
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip ="' + value + '"';
                        return value;
                    }
                }, {
                    dataIndex: 'displayValue',
                    width: 140,
                    text: i18n.getKey('displayValue'),
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip ="' + value + '"';
                        return value;
                    }
                }, 
                {
                    dataIndex: 'value',
                    width: 140,
                    text: i18n.getKey('value'),
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip ="' + value + '"';
                        return value;
                    }
                },
                /*{
                    dataIndex: 'sortOrder',
                    text: i18n.getKey('sortOrder'),
                    sortable: true,
                    editor: {
                        allowBlank: false
                    }
                },*/
                {
                    dataIndex: 'imageUrl',
                    width: 140,
                    text: i18n.getKey('imageUrl'),
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
                        me.controller.openAddOptionWindow(null, me.valueType);
                    }
                },
                {
                    xtype: 'displayfield',
                    value: '选中行号拖拽调整选项顺序',
                    fieldStyle: {
                        color: 'red'
                    },
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
