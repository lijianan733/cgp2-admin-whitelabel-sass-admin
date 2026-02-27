/**
 * Created by shirley on 2020/9/1.
 * 计价规则组件
 */

Ext.Loader.syncRequire([
    'CGP.shippingquotationtemplatemanage.store.CountriesStore',
    'CGP.shippingquotationtemplatemanage.view.ZoneCodeSelectWindow'
])
Ext.define('CGP.shippingquotationtemplatemanage.view.AreaRuleShippingConfig', {
    extend: 'Ext.ux.form.GridField',
    alias: 'widget.arearuleshippingconfig',
    id: 'arearuleshippingconfig',
    record: null,
    listeners: {
        afterrender: function (win) {
            if (win.record) {
                var form = win.items.items[0];
                form.diySetValue(win.record.getData());
            }
        }
    },
    diySetValue: function (data) {
        var me = this;
        if (!Ext.isEmpty(data)) {
            var newData = [];
            var mapObj = {};
            //[{zoneCode:'a',countryCode:'a'},{zoneCode:'b',countryCode:'a'},{zoneCode:'c',countryCode:'a'}]=>[{zoneCode:'a,b,c',countryCode:'a'}]
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                var zoneCode = item.zoneCode || '';
                var countryCode = item.countryCode;
                mapObj[countryCode] = (Ext.isEmpty(mapObj[countryCode]) ? zoneCode : (mapObj[countryCode] + ',' + zoneCode));
            }
            for (var i in mapObj) {
                newData.push({
                    zoneCode: mapObj[i],
                    countryCode: i
                })
            }
            me.setSubmitValue(newData);
        }
    },
    getSubmitData: function () {
        var me = this, value = {};
        var areas = me.getSubmitValue();
        var newAreas = [];
        //[{zoneCode:'a,b,c',countryCode:'a'}]=>[{zoneCode:'a',countryCode:'a'},{zoneCode:'b',countryCode:'a'},{zoneCode:'c',countryCode:'a'}]
        for (var i = 0; i < areas.length; i++) {
            var item = areas[i];
            var zoneCode = item.zoneCode;
            var countryCode = item.countryCode;
            if (zoneCode) {
                var zones = zoneCode.split(',');
                zones.map(function (zone) {
                    newAreas.push({
                        zoneCode: zone,
                        countryCode: countryCode
                    })
                });
            } else {
                newAreas.push({
                    countryCode: countryCode
                })
            }
        }
        value[me.name] = newAreas;
        return value;
    },
    initComponent: function () {
        var me = this;
        me.gridConfig = {
            minHeight: 200,
            maxHeight: 300,
            autoScroll: true,
            selType: 'checkboxmodel',
            renderTo: JSGetUUID(),
            itemId: 'areas',
            store: {
                xtype: 'store',
                fields: [
                    {
                        name: 'countryCode',
                        type: 'string'
                    },
                    {
                        name: 'zoneCode',
                        type: 'string',
                        useNull: true,
                        defaultValue: null
                    }
                ],
                data: []
            },
            tbar: [
                {
                    xtype: 'button',
                    text: i18n.getKey('add') + i18n.getKey('country'),
                    iconCls: 'icon_create',
                    width: 80,
                    handler: function (view, rowIndex, colIndex, item, e, record) {
                        var me = this;
                        var store = me.ownerCt.ownerCt.store;
                        var win = Ext.create('CGP.shippingquotationtemplatemanage.view.CountriesWindow', {
                            store: store
                        });
                        win.show();
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('batch') + i18n.getKey('delete') + i18n.getKey('country'),
                    iconCls: 'icon_delete',
                    width: 110,
                    handler: function () {
                        var me = this;
                        var grid = me.ownerCt.ownerCt;
                        Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (selector) {
                            if (selector == 'yes') {
                                //获取批量删除项个数
                                var deleteNumber = grid.getSelectionModel().getSelection().length;
                                //依次删除数据项，删除操作之前进行刷新
                                while (deleteNumber > 0) {
                                    //每次删除操作之前刨床当前store中的数据为最新数据，更新store
                                    var newViewData = grid.getView().dataSource.data.items;
                                    var store = grid.getStore();
                                    store.proxy.data = newViewData;
                                    store.load();
                                    var rowIndex = grid.getSelectionModel().getSelection()[0].index;
                                    store.removeAt(rowIndex);
                                    if (store.proxy.data) {//处理本地数据
                                        store.proxy.data.splice(rowIndex, 1);
                                    }
                                    deleteNumber--;
                                }
                                grid.getStore().load();
                            }
                        });
                    }
                }],
            columns: [
                {
                    xtype: 'actioncolumn',
                    width: 60,
                    itemId: 'actioncolumn',
                    sortable: false,
                    resizable: false,
                    menuDisabled: true,
                    tdCls: 'vertical-middle',
                    items: [{
                        iconCls: 'icon_edit icon_margin',
                        itemId: 'actionedit',
                        tooltip: i18n.getKey('edit'),
                        handler: function (view, rowIndex, colIndex, item, e, record) {
                            var me = this;
                            var store = me.ownerCt.ownerCt.store;
                            var win = Ext.create('CGP.shippingquotationtemplatemanage.view.ZoneCodeSelectWindow', {
                                record: record,
                                rowIndex: rowIndex,
                                store: store
                            });
                            win.show();
                        }
                    }, {
                        iconCls: 'icon_remove icon_margin',
                        itemId: 'actiondelete',
                        tooltip: i18n.getKey('delete'),
                        handler: function (view, rowIndex, colIndex, item, e, record) {
                            var store = view.getStore();
                            store.removeAt(rowIndex);
                            if (store.proxy.data) {//处理本地数据
                                store.proxy.data.splice(rowIndex, 1);
                            }
                        }
                    }]
                },
                {
                    text: i18n.getKey('country'),
                    xtype: 'gridcolumn',
                    itemId: 'countryCode',
                    dataIndex: 'countryCode',
                    flex: 1
                }, {
                    text: i18n.getKey('zone'),
                    xtype: 'gridcolumn',
                    itemId: 'zoneCode',
                    dataIndex: 'zoneCode',
                    flex: 1
                }]
        };
        me.callParent();
    }
})
