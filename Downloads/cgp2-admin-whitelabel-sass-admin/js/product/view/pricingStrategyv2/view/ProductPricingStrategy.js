Ext.define('CGP.product.view.pricingStrategyv2.view.ProductPricingStrategy', {
    extend: 'Ext.ux.form.GridField',
    itemId: 'productStrategyGrid',
    isLock: false,
    fieldStyle: {
        //displayField默认会往下移4px
        marginTop: '-4px'
    },
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.product.view.pricingStrategyv2.controller.PricingStrategy');
        me.store = Ext.create("CGP.product.view.pricingStrategyv2.store.LocalPricingStrategy");
        me.store.sort([
            {
                property: 'index',
                direction: 'ASC'
            }]);
        me.gridConfig = {
            editAction: false,
            deleteAction: false,
            multiSelect: false,
            pagingBar: false,
            store: me.store,
            width: '100%',
            defaults: {
                minWidth: 180
            },
            tbar: [
                {
                    xtype: 'button',
                    text: i18n.getKey('create') + i18n.getKey('strategy'),
                    iconCls: 'icon_create',
                    disabled: me.isLock,
                    handler: function () {
                        controller.strategyTypeWindow(me.tabPanel, null, me.productId);
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('refresh'),
                    iconCls: 'icon_refresh',
                    handler: function (btn) {
                        var productPricingConfigStore = Ext.data.StoreManager.lookup('productPricingConfigStore');
                        productPricingConfigStore.load();
                    }
                }

            ],
            columns: [
                {
                    text: i18n.getKey('seqNo'),
                    xtype: 'rownumberer',
                    width: 50,
                    align: 'center',
                    //hidden:true,
                    sortable: false
                },
                {
                    xtype: 'actioncolumn',
                    itemId: 'actioncolumn',
                    text: i18n.getKey('operation'),
                    dataIndex: '_id',
                    width: 60,
                    sortable: false,
                    resizable: false,
                    menuDisabled: true,
                    items: [

                        {
                            itemId: 'actionedit',
                            iconCls: me.isLock ? 'icon_query' : 'icon_edit icon_margin',
                            tooltip: me.isLock ? i18n.getKey('check') : 'Edit',
                            handler: function (view, rowIndex, colIndex) {
                                var store = view.getStore();
                                var record = store.getAt(rowIndex);
                                controller.openStrategyWindow(me.tabPanel, record.getId(), me.productId);
                            }
                        },
                        {
                            iconCls: 'icon_remove icon_margin',
                            itemId: 'actionremove',
                            tooltip: 'Remove',
                            disabled: me.isLock,
                            handler: function (view, rowIndex, colIndex) {
                                Ext.Msg.confirm(i18n.getKey('info'), i18n.getKey('deleteConfirm'), function (select) {
                                    if (select == 'yes') {
                                        var store = view.getStore();
                                        store.removeAt(rowIndex);
                                        if (store.count() == 0) {
                                            //为0时删除整个计价配置
                                            var recordId = me.ownerCt.productPricingConfig.getId();
                                            if (recordId) {
                                                var url = CGP.product.view.pricingStrategyv2.config.Config[me.ownerCt.clazz].url + '/' + recordId;
                                                controller.delete(url, me.ownerCt);
                                            }
                                            return false;
                                        } else {
                                            var configModel = me.ownerCt.productPricingConfig;
                                            configModel.set('strategies', me.getSubmitValue());
                                            controller.saveConfig(configModel.data, me, true, me.pricingConfigUrl);
                                        }
                                    }
                                });
                            }
                        }
                    ]
                },
                {
                    text: i18n.getKey('id'),
                    sortable: false,
                    dataIndex: '_id'
                },
                {
                    text: i18n.getKey('strategy') + i18n.getKey('type'),
                    dataIndex: 'strategyType',
                    sortable: false,
                    width: 120,
                    renderer: function (value, mateData, record) {
                        var type = value || record.raw.setting.clazz;
                        var result = '';
                        switch (type) {
                            case "com.qpp.cgp.domain.pricing.configuration.SimpleQtyTablePricingSetting":
                                result = i18n.getKey('simple') + i18n.getKey('strategy');
                                break;
                            case "com.qpp.cgp.domain.pricing.configuration.AdditionQtyTablePricingSetting":
                                result = i18n.getKey('addition') + i18n.getKey('strategy');
                                break;
                            case "com.qpp.cgp.domain.pricing.configuration.MathExpressionPricingSetting":
                                result = i18n.getKey('expression') + i18n.getKey('strategy');
                                break;
                        }
                        return result;
                    }
                },
                {
                    text: i18n.getKey('currency'),
                    sortable: false,
                    dataIndex: 'currency',
                    width: 80,
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip ="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('description'),
                    sortable: false,
                    dataIndex: 'description',
                    width: 250,
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip ="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('default') + i18n.getKey('strategy'),
                    sortable: false,
                    itemId: 'isDefault',
                    dataIndex: 'isDefault',
                    width: 150,
                    minWidth: 105,
                    tdCls: 'vertical-middle',
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record) {
                        if (value) {
                            return "<div class = 'address-relativeCls'><span>" + i18n.getKey('default') + i18n.getKey('strategy') + "</span></div>"
                        } else {
                            return {
                                xtype: 'button',
                                text: i18n.getKey('set') + i18n.getKey('default') + i18n.getKey('strategy'),
                                disabled: me.isLock,
                                handler: function (button) {
                                    controller.setDefaultStrategy(record.get('_id'), me, me.pricingConfigUrl);
                                }
                            };
                        }

                    }
                },
                {
                    xtype: 'componentcolumn',
                    text: i18n.getKey('executeCondition'),
                    dataIndex: 'filterSetting',
                    flex: 1,
                    renderer: function (value, metadata, record, rowIndex) {
                        var conditionText = i18n.getKey('add');
                        if (value) {
                            conditionText = i18n.getKey('compile');
                        }
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#" id="condition_' + rowIndex + '" style="color: blue">' + conditionText + '</a>',
                            listeners: {
                                render: function (display) {
                                    var clickElement = document.getElementById("condition_" + rowIndex);
                                    clickElement.addEventListener('click', function () {
                                        controller.conditionWind(me.productId, record.data, me.ownerCt, record.data._id, me.pricingConfigUrl);
                                    }, false);

                                }
                            }
                        }

                    }
                }
            ]
        };
        me.callParent(arguments);
    },
    refreshData: function (data) {
        var me = this;
        me.setLoading(true);
        me.updateLayout();
        setTimeout(function () {
            me.setSubmitValue(data);
            me.setLoading(false);
        }, 100);
        //store.loadData(data);
    }

});
