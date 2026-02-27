/*
* Created by nan on 2025/05/1
*/
Ext.Loader.syncRequire([
    'CGP.product_price_component.model.ProductPriceComponentModel'
]);
Ext.onReady(function () {
    var editPage = Ext.create('Ext.ux.ui.EditPage', {
        block: 'product_price_component',
        gridPage: 'main.html',
        formCfg: {
            layout: 'vbox',
            model: 'CGP.product_price_component.model.ProductPriceComponentModel',
            items: [
                {
                    xtype: 'hiddenfield',
                    name: '_id',
                    fieldLabel: i18n.getKey('_id'),
                    itemId: '_id',
                },
                {
                    xtype: 'hiddenfield',
                    fieldLabel: i18n.getKey('clazz'),
                    name: 'clazz',
                    itemId: 'clazz',
                    value: "com.qpp.cgp.domain.product.price.ProductPriceComponent"

                },
                {
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('description'),
                    name: 'description',
                    allowBlank: false,
                    itemId: 'description',
                },
                {
                    xtype: 'gridfieldwithcrudv2',
                    name: 'priceComponents',
                    itemId: 'priceComponents',
                    allowBlank: false,
                    fieldLabel: i18n.getKey('价格组成'),
                    width: 1000,
                    identityField: 'code',
                    getTotalPercentage: function () {
                        var me = this;
                        var store = me.getGrid().getStore();
                        var total = 0;
                        store.each(function (item) {
                            total += item.get('percentage');
                        });
                        return total;
                    },
                    validate: function () {
                        var me = this;
                        var isValid = true;
                        me.errors = '';
                        if (me.getStore().getCount() == 0) {
                            isValid = false;
                            me.errors = '不允许为空';
                            me.setActiveError(me.errors);
                            me.renderActiveError();
                        } else {
                            var total = me.getTotalPercentage();
                            if (total !== 100) {
                                isValid = false;
                                me.errors = '各项比例之和必须为100%';
                                me.setActiveError(me.errors);
                                me.renderActiveError();
                            }
                        }
                        return isValid;
                    },
                    getErrors: function () {
                        return this.errors;
                    },
                    gridConfig: {
                        tbar: {
                            msgDisplay: {
                                value: '行号处上下拖拽调整执行顺序'
                            }
                        },
                        viewConfig: {
                            listeners: {
                                drop: function (node, Object, overModel, dropPosition, eOpts) {
                                    var view = this;
                                    JSSetLoading(true, '处理中...');
                                    view.ownerCt.suspendLayouts();//挂起布局
                                    view.store.suspendEvents(true);//挂起事件粗触发，false表示丢弃事件，true表示阻塞事件队列*/
                                    var data = this.store.data.items;
                                    for (var i = 0; i < data.length; i++) {
                                        data[i].index = i;
                                        if (data[i].get('sortOrder') == i) {

                                        } else {
                                            data[i].set('sortOrder', i);
                                        }
                                    }
                                    this.store.sync({
                                        callback: function () {
                                            view.store.resumeEvents();//恢复事件触发
                                            view.ownerCt.resumeLayouts();
                                            JSSetLoading(false);
                                        }
                                    });//同步数据
                                }
                            },
                            enableTextSelection: true,
                            plugins: {
                                ptype: 'gridviewdragdrop',
                                dragText: 'Drag and drop to reorganize',
                            }
                        },

                        features: [{
                            ftype: 'summary'
                        }],
                        store: {
                            fields: [
                                {
                                    name: 'code',
                                    type: 'string'
                                },
                                {
                                    name: 'name',
                                    type: 'string'
                                },
                                {
                                    name: 'percentage',
                                    type: 'number'
                                },
                                {
                                    name: 'sortOrder',
                                    type: 'number'
                                },
                                {
                                    name: 'title',
                                    type: 'string'
                                },
                            ],
                            proxy: {
                                type: 'memory'
                            },
                            data: []
                        },
                        autoScroll: true,
                        columns: [
                            {
                                xtype: 'rownumberer'
                            },
                            {
                                xtype: 'auto_bread_word_column',
                                dataIndex: 'code',
                                flex: 1,
                                text: i18n.getKey('code')
                            },
                            {
                                xtype: 'auto_bread_word_column',
                                dataIndex: 'name',
                                flex: 1,
                                text: i18n.getKey('name')
                            },
                            {
                                xtype: 'auto_bread_word_column',
                                text: i18n.getKey('title'),
                                dataIndex: 'title',
                                flex: 1,
                            },
                            {
                                dataIndex: 'percentage',
                                text: i18n.getKey('比例'),
                                renderer: function (value) {
                                    return value + '%'
                                },
                                summaryType: 'sum',
                                summaryRenderer: function (value, summaryData, dataIndex) {
                                    return '总计：' + Ext.String.format('{0}{1}', value, '%');
                                }
                            },
                        ]
                    },
                    winConfig: {
                        layout: 'fit',
                        formConfig: {
                            layout: {
                                type: 'vbox'
                            },
                            useForEach: true,
                            isValidForItems: true,
                            defaults: {
                                allowBlank: false,
                                width: 450
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    itemId: 'code',
                                    name: 'code',
                                    fieldLabel: i18n.getKey('code')
                                },
                                {
                                    xtype: 'textfield',
                                    itemId: 'name',
                                    name: 'name',
                                    fieldLabel: i18n.getKey('name')
                                },
                                //两位小数,
                                {
                                    xtype: 'numberfield',
                                    fieldLabel: i18n.getKey('占产品价格比例') + '(%)',
                                    name: 'percentage',
                                    itemId: 'percentage',
                                    allowDecimals: true,
                                    decimalPrecision: 2,
                                    minValue: 0,
                                    maxValue: 100,
                                    listeners: {
                                        change: function (value) {
                                            var me = this;
                                            var win = this.ownerCt.ownerCt;
                                            var gridField = win.outGrid.gridField;
                                            var totalPercentage = gridField.getTotalPercentage();

                                            var max = 100;
                                            if (win.record) {
                                                max = 100 - totalPercentage + win.record.get('percentage');
                                            } else {
                                                max = 100 - totalPercentage;
                                            }
                                            me.setMaxValue(max);
                                            me.isValid();
                                        }
                                    }
                                },
                                {
                                    xtype: 'textfield',
                                    itemId: 'title',
                                    name: 'title',
                                    fieldLabel: i18n.getKey('title')
                                },
                                {
                                    xtype: 'hiddenfield',
                                    name: 'sortOrder',
                                    itemId:'sortOrder'
                                }
                            ]
                        }
                    },
                }
            ]
        }
    });
});