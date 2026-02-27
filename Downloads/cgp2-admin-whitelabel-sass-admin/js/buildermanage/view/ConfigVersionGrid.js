Ext.Loader.syncRequire(["CGP.buildermanage.model.ConfigVersionModel"]);
Ext.define("CGP.buildermanage.view.ConfigVersionGrid", {
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
        var controller = Ext.create('CGP.buildermanage.controller.Controller');
        if (me.editOrNew == 'new') {
            me.store = Ext.create('Ext.data.Store', {
                model: 'CGP.buildermanage.model.ConfigVersionModel',
                proxy: 'memory',
                data: []
            });
        } else {
            me.store = Ext.create('CGP.buildermanage.store.ConfigVersionStore', {
                params: {
                    filter: '[{"name":"builder._id","value":' + me.configModelId + ',"type":"string"}]'
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
                    controller.openConfigVersionWin(record, 'edit', me.editOrNew, me.store, me.configModelId,lastVersionId);
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
        },
            {
                text: i18n.getKey('builderUrl'),
                dataIndex: 'builderUrl',
                itemId: 'builderUrl',
                width: 300,
                renderer: function (value, mateData, record) {
                    return '<div style="white-space:normal;word-wrap:break-word; overflow:hidden;">' + value + '</div>'
                }
            },
            {
                text: i18n.getKey('builder') + i18n.getKey('version'),
                dataIndex: 'publishVersion',
                itemId: 'version',
            },
            {
                text: i18n.getKey('userPreviewUrl'),
                dataIndex: 'userPreviewUrl',
                width: 250,
                itemId: 'userPreviewUrl',
                renderer: function (value, mateData, record) {
                    return '<div style="white-space:normal;word-wrap:break-word; overflow:hidden;">' + value + '</div>'
                }
            },
            {
                text: i18n.getKey('manufacturePreviewUrl'),
                dataIndex: 'manufacturePreviewUrl',
                width: 250,
                itemId: 'manufacturePreviewUrl',
                renderer: function (value, mateData, record) {
                    return '<div style="white-space:normal;word-wrap:break-word; overflow:hidden;">' + value + '</div>'
                }
            },
            {
                text: i18n.getKey('platform'),
                dataIndex: 'platform',
                itemId: 'platform',
            },
            {
                text: i18n.getKey('language'),
                dataIndex: 'supportLanguage',
                xtype: 'arraycolumn',
                flex: 1,
                minWidth: 100,
                itemId: 'supportLanguage',
                renderer: function (value, metadata, record) {
                    return value.name

                }
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
                    controller.openConfigVersionWin(null, 'new', me.editOrNew, me.store, me.configModelId,lastVersionId);
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
    lastVersion: function (){
        var me = this;
        var lastVersion = me.getValue().pop();
        var lastVersionId = 0;
        if(Ext.isEmpty(lastVersion)){
            return 0;
        }else{
            lastVersionId = lastVersion.publishVersion;
        }
        return lastVersionId;
    }
});