Ext.define("CGP.buildermanage.view.ManageConfigVersion", {
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
        me.store = Ext.create('CGP.buildermanage.store.ConfigVersionStore', {
            params: {
                filter: '[{"name":"builder._id","value":' + me.configModelId + ',"type":"string"}]'
            }
        });
        var controller = Ext.create('CGP.buildermanage.controller.Controller');
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
                            controller.openConfigVersionWin(record, 'edit', 'edit', me.store, me.configModelId,lastVersionId);
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
                }
            ],
            tbar: [
                {
                    xtype: 'button',
                    itemId: 'button',
                    iconCls: 'icon_add',
                    text: i18n.getKey('add'),
                    handler: function () {
                        var lastVersionId = me.lastVersion();
                        controller.openConfigVersionWin(null, 'new', 'edit', me.store, me.configModelId,lastVersionId);
                    }
                }
            ]
        });
        me.add(me.grid);
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

    refresh: function (attributeId) {
        var me = this;
        var newUrl = Ext.clone(me.store.url);
        me.store.proxy.url = Ext.String.format(newUrl, attributeId);
        me.store.load();
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