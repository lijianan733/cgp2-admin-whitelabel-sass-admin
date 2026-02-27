Ext.define('CGP.orderlineitem.view.status.view.shipment.ShipmentBoxGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.shipmentboxgrid',
    requires: [
        'CGP.orderlineitem.view.status.model.ShipmentBox',
        'CGP.orderlineitem.view.status.store.ShipmentBox'
    ],



    dataKeyName: 'internalId',


    initComponent: function () {

         var me = this,
            dataKey = this.dataKeyName,
            record = this.record;



        me.data = {};
        me.totalQty = record.get('needPackingQty');
        data = me.data;
        me.store = Ext.create('CGP.orderlineitem.view.status.store.ShipmentBox', {
            data: [{
                productQty: me.totalQty,
                boxQty: 1,
                boxLength: 0,
                boxWidth: 0,
                boxHeight: 0,
                boxSizeUnit: 'CM',
                productWeight: 0,
                totalWeight: 0
        }]
        });
        //init data
        data[me.store.getAt(0)[dataKey]] = me.store.getAt(0).data;

        me.addEvents(['productqtychange']);
        me.columns = {
            defaults: {
                sortable: false,
                menuDisabled: true
            },
            items: [{
                    text: '<a href="#">' + i18n.getKey('add') + '</a>',
                    listeners: {
                        headerclick: function () {
                            if (!me.model) {
                                me.model = Ext.ModelManager.getModel('CGP.orderlineitem.view.status.model.ShipmentBox');
                            }
                            if (me.getPackageQty() == me.totalQty) {
                                Ext.Msg.alert(i18n.getKey('prompt'), '所有产品都已装箱！');
                                return;
                            }
                            var record = me.model.create({
                                productQty: me.totalQty - me.getPackageQty(),
                                boxQty: 1,
                                boxSizeUnit: 'CM'
                            });
                            me.getStore().add(record)
                            data[record[dataKey]] = record.data;
                            me.fireEvent('productqtychange', me, me.getPackageQty());
                        }
                    },
                    xtype: 'actioncolumn',
                    menuDisabled: true,
                    sortable: false,
                    width: 50,
                    items: [{
                        iconCls: 'icon_remove icon_margin',
                        itemId: 'actiondelete',
                        tooltip: i18n.getKey('destroy'),
                        handler: function (view, rowIndex, colIndex, item, e, record) {

                            var store = me.getStore();

                            if (store.getCount() == 1) {
                                Ext.Msg.alert(i18n.getKey('prompt'), '最少保留一条装箱信息！');
                                return;
                            }
                            delete data[record[dataKey]];
                            store.remove(record);
                            me.fireEvent('productqtychange', me, me.getPackageQty());
                        },
                        isDisabled: function (view, rowIndex, colIndex, item, record) {
                            return !Ext.isEmpty(record.get('storageId'));
                        }
                }]
            }, {
                    dataIndex: 'productQty',
                    xtype: 'componentcolumn',
                    width: 80,
                    text: i18n.getKey('productQty'),
                    renderer: function (v, m, r) {
                        return {
                            name: 'productQty',
                            xtype: 'numberfield',
                            allowExponential: false,
                            allowDecimals: false,
                            allowBlank: false,
                            value: v,
                            hideTrigger: true,
                            listeners: {
                                blur: function (field) {
                                    data[r[dataKey]][field.name] = field.getValue();
                                    me.fireEvent('productqtychange', me, me.getPackageQty());
                                }
                            }
                        }
                    }
        }, {
                    dataIndex: 'boxQty',
                    xtype: 'componentcolumn',
                    text: i18n.getKey('boxQty'),
                    width: 60,
                    renderer: function (v, m, r) {
                        return {
                            name: 'boxQty',
                            xtype: 'numberfield',
                            allowExponential: false,
                            allowDecimals: false,
                            allowBlank: false,
                            value: v,
                            hideTrigger: true,
                            listeners: {
                                blur: function (me) {
                                    data[r[dataKey]][me.name] = me.getValue();
                                }
                            }
                        }
                    }
        },
                {
                    text: i18n.getKey('boxSize'),
                    xtype: 'componentcolumn',
                    width: 260,
                    renderer: function (v, m, r) {
                        return {
                            xtype: 'fieldcontainer',
                            layout: 'column',
                            fieldDefaults: {
                                labelSeparator: ''
                            },
                            items: [{
                                xtype: 'numberfield',
                                allowExponential: false,
                                allowDecimals: false,
                                name: 'boxLength',
                                hideTrigger: true,
                                value: r.get('boxLength'),
                                width: 40,
                                listeners: {
                                    blur: function (me) {
                                        data[r[dataKey]][me.name] = me.getValue();
                                    }
                                }
                            }, {
                                xtype: 'displayfield',
                                value: 'X',
                                width: 15
                        }, {
                                xtype: 'numberfield',
                                allowExponential: false,
                                allowDecimals: false,
                                name: 'boxWidth',
                                hideTrigger: true,
                                value: r.get('boxWidth'),
                                width: 40,
                                listeners: {
                                    blur: function (me) {
                                        data[r[dataKey]][me.name] = me.getValue();
                                    }
                                }
                            }, {
                                xtype: 'displayfield',
                                value: 'X',
                                width: 15
                        }, {
                                xtype: 'numberfield',
                                allowExponential: false,
                                allowDecimals: false,
                                name: 'boxHeight',
                                hideTrigger: true,
                                value: r.get('boxHeight'),
                                width: 40,
                                listeners: {
                                    blur: function (me) {
                                        data[r[dataKey]][me.name] = me.getValue();
                                    }
                                }
                            }, {
                                xtype: 'combobox',
                                store: Ext.create('CGP.orderlineitem.view.status.store.BoxSizeUnit'),
                                editable: false,
                                displayField: 'title',
                                valueField: 'vlaue',
                                name: 'boxSizeUnit',
                                value: r.get('boxSizeUnit') || 'CM',
                                width: 80,
                                listeners: {
                                    select: function (me, records) {
                                        var record = records[0];
                                        data[r[dataKey]][me.name] = record.get('value');
                                    }
                                }
                            }]
                        }
                    }
            },
                {
                    dataIndex: 'totalWeight',
                    xtype: 'componentcolumn',
                    width: 80,
                    text: i18n.getKey('weight'),
                    renderer: function (v, m, r) {
                        return {
                            xtype: 'container',
                            layout: 'column',
                            items: [{
                                name: 'totalWeight',
                                xtype: 'numberfield',
                                allowExponential: false,
                                allowBlank: false,
                                width: 45,
                                value: v,
                                hideTrigger: true,
                                listeners: {
                                    blur: function (me) {
                                        data[r[dataKey]][me.name] = me.getValue();
                                    }
                                }
                        }, {
                                xtype: 'displayfield',
                                value: 'G',
                                width: 10
                        }]
                        }
                    }
        }, {
                    dataIndex: 'productWeight',
                    xtype: 'componentcolumn',
                    width: 80,
                    text: i18n.getKey('suttle'),
                    renderer: function (v, m, r) {
                        return {
                            xtype: 'container',
                            layout: 'column',
                            items: [{
                                name: 'productWeight',
                                xtype: 'numberfield',
                                allowExponential: false,
                                allowBlank: false,
                                value: v,
                                width: 45,
                                hideTrigger: true,
                                listeners: {
                                    blur: function (me) {
                                        data[r[dataKey]][me.name] = me.getValue();
                                    }
                                }
                        }, {
                                xtype: 'displayfield',
                                value: 'G',
                                width: 10
                        }]
                        }
                    }
        }, {
                    dataIndex: 'packageType',
                    xtype: 'componentcolumn',
                    width: 100,
                    text: i18n.getKey('packageType'),
                    renderer: function (v, m, r) {
                        return {
                            xtype: 'textfield',
                            value: v,
                            name: 'packageType',
                            listeners: {
                                blur: function (me) {
                                    data[r[dataKey]][me.name] = me.getValue();
                                }
                            }
                        }
                    }
        }]
        };

        me.callParent(arguments);
    },

    getValue: function () {
        var me = this;
        var data = [];
        Ext.Object.each(me.data, function (k, v) {
            data.push(v);
        })
        return data;
    },

    getPackageQty: function () {
        var me = this,
            i = 0;
        var packageQty = 0;
        Ext.Object.each(me.data, function (k, v) {
            packageQty += v['productQty'];
        })
        return packageQty;
    },
    isValid: function () {
        var me = this;
        if (me.getPackageQty() !== me.record.get('totalQty')) {
            Ext.Msg.alert(i18n.getKey('prompt'), '装箱产品数量需要等于产品数量！');
            return false;
        }
        return true;
    }
})