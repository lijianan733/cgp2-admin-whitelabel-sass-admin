/**
 * Created by nan on 2020/5/25.
 */
Ext.onReady(function () {
    var recordId = JSGetQueryString('recordId');
    var store = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3test.store.ProductMaterialMappingV3HistoryStore', {
        params: {
            filter: Ext.JSON.encode(
                [
                    {"name": "_id", "value": recordId + '', "type": "string"}
                ]
            )
        }
    });
    var record = {};
    var page = Ext.create('Ext.container.Viewport', {layout: 'fit'});
    store.on('load', function () {
        record = store.getAt(0);
        var form = Ext.create('Ext.form.Panel', {
            autoScroll: true,
            frame: false,
            border: false,
            padding: '10 0 10 10',
            layout: 'anchor',
            items: [
                {
                    xtype: 'toolbar',
                    color: 'black',
                    bodyStyle: 'border-color:white;',
                    border: '0 0 0 0',
                    items: [
                        {
                            xtype: 'displayfield',
                            fieldLabel: false,
                            value: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('baseInfo') + '</font>'
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    collapsible: false,
                    border: '1 0 0 0 ',
                    defaultType: 'displayfield',
                    layout: 'anchor',
                    defaults: {
                        labelAlign: 'left',
                        labelWidth: 150,
                        margin: '0 0 3 6',
                        width: 600,
                        xtype: 'displayfield',
                    },
                    items: [
                        {
                            itemId: '_id',
                            fieldLabel: i18n.getKey('id'),
                            value: record.getId()
                        },
                        {
                            itemId: 'operator',
                            fieldLabel: i18n.getKey('测试人员'),
                            value: '姓名：' + record.get('operator').lastName + record.get('operator').firstName + '<br>邮箱：' + record.get('operator').email + ''
                        },
                        {
                            itemId: 'operationTime',
                            fieldLabel: i18n.getKey('测试时间'),
                            value: function () {
                                var value = record.get('operationTime');
                                value = Ext.Date.format(value, 'Y/m/d H:i');
                                return value;
                            }()
                        },
                        {
                            itemId: 'status',
                            fieldLabel: i18n.getKey('status'),
                            value: record.get('runResult') ? '<font color="green">成功</font>' : '<font color="red">失败</font>'
                        },
                        {
                            xtype: 'displayfield',
                            hidden: !record.get('runResult'),
                            fieldLabel: i18n.getKey('生成的物料'),
                            value: '<a href="#" title="查看物料" )>' + record.get('material')?._id + '</a>',
                            listeners: {
                                render: function (display) {
                                    var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                    var ela = Ext.fly(a); //获取到a元素的element封装对象
                                    ela.on("click", function () {
                                        JSOpen({
                                            id: 'material' + '_edit',
                                            url: path + "partials/material/edit.html?materialId=" + record.get('material')._id + '&isLeaf=' + false + '&parentId= &isOnly=true',
                                            title: i18n.getKey('materialInfo') + '(' + i18n.getKey('id') + ':' + record.get('material')._id + ')',
                                            refresh: true
                                        });
                                    });
                                }
                            }
                        },
                        {
                            itemId: '期望',
                            fieldLabel: i18n.getKey('期望'),
                            value: function () {
                                var executeExpect = record.get('executeExpect');
                                if (executeExpect == 'Uncertain') {
                                    return '待确定';
                                } else if (executeExpect == 'Conformity') {
                                    return '符合期望';
                                } else {
                                    return '不符合期望';
                                }
                            }()
                        }
                    ]
                },
                {
                    xtype: 'toolbar',
                    color: 'black',
                    bodyStyle: 'border-color:white;',
                    border: '0 0 0 0',
                    items: [

                        {
                            xtype: 'displayfield',
                            fieldLabel: false,
                            value: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('测试数据') + '</font>'
                        },
                        {
                            xtype: 'displayfield',
                            value: "<a href='#'>" + i18n.getKey('check') + i18n.getKey('JSON数据') + "</font>",
                            testData: record.get('productAttributes'),
                            itemId: 'checkTestData',
                            listeners: {
                                render: function (display) {
                                    display.getEl().on("click", function () {
                                        JSShowJsonData(display.testData, '测试数据');

                                    })
                                }
                            }
                        },
                    ]
                },
                {
                    xtype: 'fieldset',
                    collapsible: true,
                    border: '1 0 0 0 ',
                    defaultType: 'displayfield',
                    layout: 'anchor',
                    itemId: 'testData',
                    defaults: {
                        labelAlign: 'left',
                        labelWidth: 150,
                        margin: '0 0 3 6',
                        width: 500
                    },
                    items: []
                },
                {
                    xtype: 'toolbar',
                    color: 'black',
                    hidden: record.get('runResult'),
                    bodyStyle: 'border-color:white;',
                    border: '0 0 0 0',
                    items: [
                        {
                            xtype: 'displayfield',
                            fieldLabel: false,
                            value: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('错误信息') + '</font>'
                        },
                    ]
                },
                {
                    xtype: 'fieldset',
                    collapsible: true,
                    border: '1 0 0 0 ',
                    defaultType: 'displayfield',
                    layout: 'anchor',
                    hidden: record.get('runResult'),
                    defaults: {
                        labelAlign: 'left',
                        labelWidth: 150,
                        margin: '0 0 3 6'
                    },
                    items: [
                        Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3test.view.ErrorInfoFrom', {
                            data: record.getData(),
                            border: false,
                            defaults: {
                                padding: '5 25 5 0',
                                width: 350,
                                labelWidth: 150,
                                readOnly: true
                            },
                        })
                    ]
                }
            ]
        });
        page.add([form]);
        Ext.create('CGP.product.view.managerskuattribute.store.SkuAttributeGridStore', {
            storeId: 'skuAttributeStore',
            autoLoad: true,
            aimUrlId: JSGetQueryString('productId'),
            listeners: {
                load: function (store, records) {
                    var productAttributes = record.get('productAttributes');
                    var data = {};
                    for (var i = 0; i < productAttributes.length; i++) {
                        data[productAttributes[i].id] = productAttributes[i].value;
                    }
                    var testDataField = form.getComponent('testData');
                    var formItems = [];
                    for (var i = 0; i < store.getCount(); i++) {
                        var skuAttribute = store.getAt(i).getData();
                        var field = Qpp.CGP.util.createFieldByAttributeV2(skuAttribute.attribute, {
                            msgTarget: 'side',
                            padding: '10 10 5 10',
                            validateOnChange: false,
                            allowBlank: true
                        });
                        formItems.push(field);
                    }
                    testDataField.add(formItems)
                    testDataField.items.items.forEach(function (item) {
                        if (item.disabled == false) {
                            if (item.xtype == 'datetimefield') {
                                item.setValue(new Date(data[item.getName()]));
                            } else {
                                item.setValue(data[item.getName()]);
                            }
                        }
                    })
                }
            }
        });
        var myMask = new Ext.LoadMask(page, {msg: "Please wait..."});
    });
})
