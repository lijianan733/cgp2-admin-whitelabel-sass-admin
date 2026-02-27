/**
 * Created by admin on 2020/3/31.
 */
Ext.Loader.syncRequire(['Ext.ux.form.GridField']);
Ext.define("CGP.product.view.pricingStrategyv2.view.expressionPS.AttributeArgument", {
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
        var attributeStore = Ext.data.StoreManager.get('contextAttributeStore');
//        .filter([
//            {filterFn: function(record) { return record.get("attribute").valueType=='Number'; }}
//        ])
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
            {
                xtype: 'gridcombo',
                editable: false,
                fieldLabel: i18n.getKey('attribute'),
                displayField: 'attributeName',
                valueField: 'id',
                allowBlank: false,
                name: 'attributeId',
                store: attributeStore,
                pickerAlign: 'bl',
                matchFieldWidth: false,
                gridCfg: {
                    store: attributeStore,
                    height: 200,
                    width: 200,
                    columns: [
                        {
                            dataIndex: 'attributeName',
                            flex: 1,
                            tdCls: 'vertical-middle',
                            text: i18n.getKey('attributeName')
                        }
                    ]
                },
                onTriggerClick: function () {
                    var me = this;
                    //筛选数值型属性
                    me.gridCfg.store.filterBy(function (record) {
                        return record.get("attribute").valueType == 'Number';
                    });
                    //展开下拉列表
                    if (!me.readOnly && !me.disabled) {
                        if (me.isExpanded) {
                            me.collapse();
                        } else {
                            me.onFocus({});
                            if (me.triggerAction === 'all') {
                                me.doQuery(me.allQuery, true);
                            } else {
                                me.doQuery(me.getRawValue());
                            }
                        }
                        me.inputEl.focus();
                    }
                }
            }
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
            } else if (item.xtype == 'gridcombo') {
                var att = Ext.data.StoreManager.get('contextAttributeStore').findRecord('id', data[item.name]);
                item.setValue(att.data);
            } else {
                item.setValue(data[item.name]);
            }
        })
    },
    getValue: function () {
        var me = this;
        var items = me.items.items;
        if (Ext.isEmpty(me.argumentModel)) {
            me.argumentModel = Ext.create('CGP.product.view.pricingStrategyv2.model.ProductAttributeArgument');
        }
        Ext.Array.each(items, function (item) {
            if (item.xtype == 'gridfield') {
                me.argumentModel.set(item.name, item.getSubmitValue());
            } else if (item.xtype == 'gridcombo') {
                var attId = Object.keys(item.getValue())[0];
                me.argumentModel.set(item.name, attId);
            } else {
                me.argumentModel.set(item.name, item.getValue());
            }
        });
        return me.argumentModel.data;
    }


})
