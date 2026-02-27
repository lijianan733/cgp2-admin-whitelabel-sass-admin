Ext.Loader.syncRequire([
    'CGP.common.condition.view.ConditionFieldContainer'
])
Ext.onReady(function () {


    var controller = Ext.create('CGP.product.view.shippingstrategy.byqty.controller.Controller');
    var productId = JSGetQueryString('productId');
    var contentData = controller.buildContentData(productId);
    var store = Ext.create('CGP.product.view.shippingstrategy.byqty.store.ConfigStore');
    var productType = JSGetQueryString('productType');
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('qtyCharge') + i18n.getKey('strategy'),
        block: 'qtyChargeStrategy',
        tbarCfg: {
            btnCreate: {
                handler: function () {
                    Ext.create('CGP.product.view.shippingstrategy.byqty.edit', {
                        productId: productId,
                        productType: productType,
                        store: store,
                        editOrNew: 'new'
                    })
                }
            }
        },
        gridCfg: {
            //store.js
            store: store,
            frame: false,
            editActionHandler: function (grid, rowIndex, colIndex) {
                var record = grid.getStore().getAt(rowIndex);
                var recordId = record.getId();
                Ext.create('CGP.product.view.shippingstrategy.byqty.edit', {
                    productId: productId,
                    productType: productType,
                    configId: recordId,
                    store: store,
                    editOrNew: 'edit'
                })
            },
            columnDefaults: {
                tdCls: 'vertical-middle',
                autoSizeColumn: true
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    width: 100,
                    dataIndex: '_id',
                    itemId: 'id',
                    sortable: true
                },
                {
                    text: i18n.getKey('status'),
                    dataIndex: 'defaultConfig',
                    width: 165,
                    itemId: 'defaultConfig',
                    sortable: true,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record) {
                        var productId = JSGetQueryString('productId');
                        var productAreaShippingConfigId = record.getId();
                        var store = record.store;
                        if (value) {
                            return '<font color="green" >默认配置</font>'
                        } else {
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#" style="color: blue")>设为默认</a>',
                                listeners: {
                                    render: function (display) {
                                        var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                        var ela = Ext.fly(a); //获取到a元素的element封装对象
                                        ela.on("click", function () {
                                            var url = adminPath + 'api/productAreaShippingConfigs/defaultConfig' +
                                                '?productId=' + productId +
                                                '&productAreaShippingConfigId=' + productAreaShippingConfigId;
                                            JSAjaxRequest(url, 'PUT', false, null, null, function (require, success, response) {
                                                if (success) {
                                                    store.load();
                                                }
                                            })
                                        });
                                    }
                                }
                            };
                        }
                    }

                },
                {
                    text: i18n.getKey('executeCondition'),
                    dataIndex: 'attributePredicateDto',
                    xtype: 'componentcolumn',
                    flex: 1,
                    itemId: 'attributePredicateDto',
                    renderer: function (value, metadata) {
                        if (Ext.isEmpty(value)) {
                            return '无条件执行';
                        } else {
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#" style="color: blue">查看执行条件</a>',
                                listeners: {
                                    render: function (display) {
                                        var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                        var ela = Ext.fly(a); //获取到a元素的element封装对象
                                        ela.on("click", function () {
                                            var win = Ext.create('Ext.window.Window', {
                                                layout: 'fit',
                                                height: 350,
                                                width: 800,
                                                modal: true,
                                                constrain: true,
                                                title: i18n.getKey('check') + i18n.getKey('condition'),
                                                items: [{
                                                    xtype: 'conditionfieldcontainer',
                                                    maxHeight: 350,
                                                    minHeight: 80,
                                                    readOnly: true,
                                                    fieldLabel: null,
                                                    allowElse: false,
                                                    rawData: value,
                                                    margin: '0 5 0 5',
                                                }]
                                            })
                                            win.show();
                                        });
                                    }
                                }
                            };
                        }
                    }
                },
                {
                    text: i18n.getKey('shippingCost') + i18n.getKey('config'),
                    dataIndex: 'areaShippingConfigGroup',
                    xtype: 'componentcolumn',
                    flex: 1,
                    itemId: 'areaShippingConfigGroup',
                    renderer: function (value, metadata) {
                        if (!Ext.isEmpty(value)) {
                            metadata.tdAttr = 'data-qtip="' + i18n.getKey('check') + i18n.getKey('shippingCost') + i18n.getKey('config') + '"';
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#" style="color: blue" >' + value['_id'] + '</a>',
                                listeners: {
                                    render: function (display) {
                                        var a = display.el.dom.getElementsByTagName('a')[0];//获取到该html元素下的a元素
                                        var ela = Ext.fly(a);
                                        ela.on("click", function () {
                                            JSOpen({
                                                id: 'shippingquotationtemplatemanagepage',
                                                url: path + 'partials/shippingquotationtemplatemanage/main.html?_id=' + value['_id'],
                                                title: i18n.getKey('shippingQuotationTemplate'),
                                                refresh: true
                                            })
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        },
        filterCfg: {
            items: [
                {
                    name: '_id',
                    xtype: 'textfield',
                    hideTrigger: true,
                    autoStripChars: true,
                    allowExponential: false,
                    allowDecimals: false,
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id'
                },
                {
                    name: 'productId',
                    xtype: 'numberfield',
                    hidden: true,
                    value: productId,
                    fieldLabel: i18n.getKey('productId'),
                    itemId: 'productId'
                },
                {
                    xtype: 'combo',
                    itemId: 'defaultConfig',
                    name: 'defaultConfig',
                    fieldLabel: i18n.getKey('status'),
                    editable: false,
                    displayField: 'display',
                    valueField: 'value',
                    store: {
                        fields: ['value', 'display'],
                        data: [{
                            display: '默认配置',
                            value: true
                        }, {
                            display: '非默认配置',
                            value: false
                        }]
                    },
                }
            ]
        }
    });
});
