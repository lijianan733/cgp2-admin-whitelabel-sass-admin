/**
 * Created by admin on 2020/3/31.
 */
Ext.Loader.syncRequire(['Ext.ux.form.GridField']);
Ext.define("CGP.product.view.pricingStrategyv2.view.expressionPS.QtyArgument", {
    extend: 'Ext.ux.form.ErrorStrickForm',
    bodyPadding: 5,
    fieldDefaults: {
        labelAlign: 'right',
        width: 380,
        labelWidth: 100,
        msgTarget: 'side'
    },
    autoScroll: true,
    scroll: 'vertical',

    argumentModel: null,
    argGrid: null,
    initComponent: function () {
        var me = this;
        var controller = Ext.create("CGP.product.view.pricingStrategyv2.controller.PricingStrategy");
        var priceRange = Ext.create("CGP.product.view.pricingStrategyv2.view.PricingTable", {
            store: Ext.create("CGP.product.view.pricingStrategyv2.store.LocalPricingTable"),
            fieldLabel: i18n.getKey('price') + i18n.getKey('range') + i18n.getKey('table'),
            itemId: 'priceRange',
            name: 'table',
            gridContainer: 'priceRangeContainer',
            width: 600
        });
        me.tbar = Ext.create('Ext.ux.toolbar.Edit', {
            btnCreate: {
                hidden: true,
                handler: function () {

                }
            },
            btnCopy: {
                hidden: true
            },
            btnReset: {
                disabled: true
            },
            btnSave: {
                disabled: me.readOnly,
                handler: function (view) {
                    var form = view.ownerCt.ownerCt;
                    if (form.getForm().isValid()) {
                        var argumentData = me.getValue();
                        form.ownerCt.remove('argumentEdit');
                        //form.ownerCt.setActiveTab('pricingStrategy');
                        if (argumentData._id == 0) {
                            argumentData._id = JSGetCommonKey();
                            me.argGrid.gridConfig.store.add(argumentData);
                        }
                    }
                }
            },
            btnGrid: {
                disabled: true
            },
            btnConfig: {
                disabled: true,
                handler: function () {
                }
            },
            btnHelp: {
                handler: function () {
                }
            }
        });
        me.items = [
            {
                xtype: 'textfield',
                name: 'description',
                fieldLabel: i18n.getKey('description'),
                itemId: 'description',
                allowBlank: false
            },
            {
                xtype: 'textfield',
                name: 'key',
                fieldLabel: i18n.getKey('key'),
                itemId: 'key',
                allowBlank: false
            },
            priceRange
        ];

        me.callParent(arguments);

    },
    listeners: {
        afterrender: function (comp) {
            if (!Ext.isEmpty(comp.argumentModel)) {
                comp.refreshData(comp.argumentModel.data);
            }
        }
    },

    refreshData: function (data) {
        var me = this;
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            if (item.xtype == 'gridfield') {
                item.setSubmitValue(data[item.name])
            } else {
                item.setValue(data[item.name]);
            }

        })
    },
    getValue: function () {
        var me = this;
        var items = me.items.items;
        if (Ext.isEmpty(me.argumentModel)) {
            me.argumentModel = Ext.create('CGP.product.view.pricingStrategyv2.model.QtyTableArgument');
        }
        Ext.Array.each(items, function (item) {
            if (item.xtype == 'gridfield') {
                var gridData = item.getSubmitValue();
                for (var i = 0; i < gridData.length; i++) {
                    gridData[i].index = i;
                }
                me.argumentModel.set(item.name, gridData);
            } else {
                me.argumentModel.set(item.name, item.getValue());
            }
        });
        return me.argumentModel.data;
    }
})
