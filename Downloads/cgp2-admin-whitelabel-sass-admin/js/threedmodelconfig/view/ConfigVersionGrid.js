Ext.Loader.syncRequire(["CGP.threedmodelconfig.model.ConfigVersionModel"]);
Ext.define("CGP.threedmodelconfig.view.ConfigVersionGrid", {
    extend: 'Ext.grid.Panel',


    record: null, //backgroundrecord


    style: {
        marginLeft: '10px'
    },
    width: 850,
    //bodyStyle: 'border-top:0;border-color:white;',
    minHeight: 450,
    header: false,
    initComponent: function () {
        var me = this;
        var status = {'0': '删除', '1': '草稿', '2': '测试', '3': '上线'};
        var controller = Ext.create('CGP.threedmodelconfig.controller.Controller');
        if (me.editOrNew == 'new') {
            me.store = Ext.create('Ext.data.Store', {
                model: 'CGP.threedmodelconfig.model.ConfigVersionModel',
                proxy: 'memory',
                data: []
            });
        } else {
            me.store = Ext.create('CGP.threedmodelconfig.store.ConfigVersionStore', {
                params: {
                    filter: '[{"name":"model._id","value":' + me.configModelId + ',"type":"string"}]'
                }
            });
        }
        me.columns = [{
            xtype: 'actioncolumn',
            itemId: 'actioncolumn',
            width: 60,
            sortable: false,
            resizable: false,
            menuDisabled: true,
            items: [{
                iconCls: 'icon_edit icon_margin',
                itemId: 'actionedit',
                tooltip: 'Edit',
                handler: function handler(view, rowIndex, colIndex) {
                    var store = view.getStore();
                    var record = store.getAt(rowIndex);
                    var lastVersionId = me.lastVersion();
                    controller.openConfigVersionWin(record, 'edit', me.editOrNew, me.store, me.configModelId, lastVersionId);
                }
            }, {
                iconCls: 'icon_remove icon_margin',
                itemId: 'actionremove',
                tooltip: 'Remove',
                handler: function handler(view, rowIndex, colIndex) {
                    var store = view.getStore();
                    Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('确定删除？'), function (select) {
                        if (select == 'yes') {
                            /*if (store.getCount() == 1) {
                                Ext.Msg.alert(i18n.getKey('prompt'), 'builderLocations的数量最少为1！');
                            } else {*/
                            store.removeAt(rowIndex);
                            //}
                        }
                    });
                }
            }]
        }, {
            text: i18n.getKey('status'),
            dataIndex: 'status',
            itemId: 'status',
            renderer: function (value, metaData, record) {
                return status[value];
            }
        }, {
            dataIndex: 'engine',
            menuDisabled: true,
            tdCls: 'columns_td_vcenter',
            text: i18n.getKey('engine')
        }, {
            dataIndex: 'version',
            menuDisabled: true,
            text: i18n.getKey('version'),
            tdCls: 'columns_td_vcenter',
            renderer: function (value, metadata, record) {
                return i18n.getKey(value);
            }
        }, {
            dataIndex: 'structVersion',
            menuDisabled: true,
            tdCls: 'columns_td_vcenter',
            flex: 1,
            text: i18n.getKey('structVersion')
        }];
        me.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            //style: 'background-color:silver;',
            color: 'black',
            bodyStyle: 'border-color:white;',
            border: '1 0 0 0',
            items: [{
                xtype: 'displayfield',
                fieldLabel: false,
                value: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('version') + i18n.getKey('config') + '</font>'
            }, {
                xtype: 'button',
                itemId: 'button',
                iconCls: 'icon_add',
                text: i18n.getKey('add'),
                handler: function () {
                    var lastVersionId = me.lastVersion();
                    controller.openConfigVersionWin(null, 'new', me.editOrNew, me.store, me.configModelId, lastVersionId);
                }
            }, {
                xtype: 'button',
                itemId: 'copyconfig',
                text: i18n.getKey('copy') + i18n.getKey('config'),
                iconCls: 'icon_copy',
                handler: function () {
                    controller.copyThreeDConfigVersion(me);
                }
            }]

        }];
        me.callParent(arguments);
    },
    getValue: function () {
        var me = this;
        var dataArray = [];
        me.store.data.items.forEach(function (item) {
            var data = item.data;
            dataArray.push(data);
        });
        return dataArray;
    },
    lastVersion: function () {
        var me = this;
        var lastVersion = me.getValue().pop();
        var lastVersionId = 0;
        if (Ext.isEmpty(lastVersion)) {
            return 0;
        } else {
            lastVersionId = lastVersion.version;
        }
        return lastVersionId;
    }
});