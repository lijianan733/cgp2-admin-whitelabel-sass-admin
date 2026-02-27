/**
 * Create by shirley on 2021/9/3
 * 计费规则--地区编辑组件
 * */
Ext.Loader.syncRequire([
    'CGP.shippingquotationtemplatemanage.view.CountryZoneSelectComponent',
    'CGP.shippingquotationtemplatemanage.store.ZonesStore'
]);
Ext.define('CGP.shippingquotationtemplatemanage.view.ZoneCodeSelectWindow', {
    extend: 'Ext.window.Window',
    layout: 'fit',
    createOrEdit: 'create',
    record: null,
    selectCountries: null,
    rowIndex: null,
    store: null,
    _panel: null,
    modal: true,
    alias: 'widget.zonecodeselectwindow',
    listeners: {
        afterrender: function (win) {
            if (win.record) {
                var form = win.items.items[0];
                var tempData = [];
                tempData.push(win.record.getData());
                form.setValue(tempData);
            }
            if (win.selectCountries) {
                var form = win.items.items[0];
                form.setValue(win.selectCountries);
            }
        }
    },
    initComponent: function () {
        var me = this;
        if (me.record) {
            me.createOrEdit = 'edit';
        }
        me.title = i18n.getKey(me.createOrEdit) + i18n.getKey('zone');
        window.deleteItem = function (itemId) {
            var field = Ext.getCmp(itemId);
            field.ownerCt.remove(field);
        };
        me.items = [
            {
                xtype: 'errorstrickform',
                itemId: 'form',
                border: false,
                minHeight: 50,
                maxHeight: 400,
                autoScroll: true,
                defaults: {
                    margin: '5 10 5 10',
                    allowBlank: false,
                    width: 500
                },
                setValue: function (data) {
                    var me = this;
                    var win = me.ownerCt;
                    if (!Ext.isEmpty(data)) {
                        var newItemArray = [];
                        data.forEach(function (itemData) {
                            var newItem = {
                                title: itemData.countryCode,
                                xtype: 'countryzoneselectcomponent',
                                value: itemData.zoneCode,
                                legendItemConfig: {
                                    deleteBtn: {
                                        hidden: win.createOrEdit == 'edit',
                                        disabled: false
                                    }
                                },
                            };
                            newItemArray.push(newItem);
                        });
                        newItemArray[0].collapsed = false;
                        me.add(newItemArray);
                    }
                },
                items: []
            }
        ];
        me.bbar = {
            items: [
                '->',
                {
                    xtype: 'button',
                    itemId: 'previousBtn',
                    iconCls: 'icon_previous_step',
                    text: i18n.getKey('lastStep'),
                    hidden: function () {
                        if (!Ext.isEmpty(me.record)) {
                            return true;
                        }
                    }(),
                    handler: function (btn) {
                        me.close();
                    },
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('confirm'),
                    iconCls: 'icon_save',
                    handler: function (btn) {
                        var me = this;
                        var win = me.ownerCt.ownerCt;
                        var form = me.ownerCt.ownerCt.items.items[0];
                        if (form.isValid()) {
                            var countriesObj = form.items.items;
                            var countriesArray = [];
                            //重新组合countriesObj数据
                            countriesObj.forEach(function (countryObj) {
                                var zonesObj = countryObj.items.items[0];
                                var zonesArray = zonesObj.diyGetValue();
                                var areaData = {
                                    countryCode: countryObj.title,
                                    zoneCode: Ext.isEmpty(zonesArray) ? null : zonesArray.join(',')
                                };
                                countriesArray.push(areaData);
                            })

                            var store = win.store;
                            if (win.record) {
                                var newData = countriesArray[0];
                                if (store.proxy.data[win.rowIndex]) {//处理本地数据
                                    store.proxy.data[win.rowIndex] = newData;
                                }
                            }
                            if (win.selectCountries) {
                                countriesArray.forEach(function (newData) {
                                    if (store.proxy.data) {//处理本地数据
                                        store.proxy.data.push(newData);
                                    }
                                });
                                win._panel.close();
                            }
                            store.load();
                            win.close();
                        }
                    },
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function (btn) {
                        me.close();
                    }
                }
            ]
        };
        me.callParent();
    }
})