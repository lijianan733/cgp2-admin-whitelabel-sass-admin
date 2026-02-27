/**
 * Created by nan on 2020/5/21.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3test.view.CreateMappingTestDataWindow', {
    extend: 'Ext.window.Window',
    width: 1000,
    layout: {
        type: 'fit'
    },
    title: i18n.getKey('属性映射测试数据'),
    maximizable: true,
    modal: true,
    productConfigDesignId: null,
    constrain: true,
    initComponent: function () {
        var me = this;
        var formItems = [];
        var fields = [];
        var columns = [];
        var attributeStore = Ext.data.StoreManager.get('skuAttributeStore');
        for (var i = 0; i < attributeStore.getCount(); i++) {
            var skuAttribute = attributeStore.getAt(i).getData();
            var field = Qpp.CGP.util.createFieldByAttributeV2(skuAttribute.attribute, {
                msgTarget: 'side',
                padding: '5 10 5 10',
                validateOnChange: false,
                allowBlank: true
            });
            formItems.push(field);
            console.log(skuAttribute);
            fields.push({
                name: skuAttribute.attribute.id,
                type: 'nan'//这是个没定义的类型，作用是不处理原数据
            });
            columns.push({
                dataIndex: skuAttribute.attribute.id,
                text: skuAttribute.attribute.name,
                options: skuAttribute.attribute.options,
                renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                    record.getData();
                    if (metadata.column.options && metadata.column.options.length > 0) {
                        if (Ext.isArray(value)) {
                            var result = [];
                            metadata.column.options.forEach(function (option) {
                                if (Ext.Array.contains(value, option.id)) {
                                    result.push(option.name);
                                }
                            })
                            return result;
                        } else {
                            var result = null;
                            metadata.column.options.forEach(function (option) {
                                if (option.id.toString() == value.toString()) {
                                    result = option.name;
                                }
                            })
                            return result;
                        }
                    } else {
                        return value;
                    }
                }
            })
        }
        me.items = [
            {
                xtype: 'gridwithcrud',
                columns: columns,
                width: 600,
                height: 500,
                itemId: 'testDateGrid',
                store: Ext.create('Ext.data.Store', {
                    fields: fields,
                    data: [],
                    proxy: {
                        type: 'memory'
                    }
                }),
                tbar: {
                    btnDelete: {
                        hidden: false,
                        width: 5,
                        xtype: 'tbseparator'
                    },
                    btnConfig: {
                        xtype: 'fieldcontainer',
                        hidden: false,
                        width: 200,
                        layout: 'hbox',
                        items: [
                            {
                                xtype: 'textfield',
                                emptyText: 'propertyModelId',
                                flex: 1,
                                allowBlank: false,
                                itemId: 'propertyModelId',
                                name: 'propertyModelId'
                            },
                            {
                                xtype: 'button',
                                text: '导入',
                                width: '60',
                                margin: '0 5 0 5',
                                iconCls: 'icon_import',
                                ui: 'default-toolbar-small',
                                handler: function (btn) {
                                    var container = btn.ownerCt;
                                    var grid = container.ownerCt.ownerCt;
                                    var propertyModelIdField = container.getComponent('propertyModelId');
                                    var propertyModelId = propertyModelIdField.getValue();
                                    if (propertyModelIdField.isValid() && propertyModelId) {
                                        var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3test.controller.Controller');
                                        var data = controller.builderTestData(propertyModelId);
                                        grid.store.proxy.data.push(data);
                                        grid.store.load();
                                    }
                                }
                            }
                        ]

                    }
                },
                winConfig: {
                    winTitle: i18n.getKey('产品运行时的sku属性配置值'),
                    setValueHandler: function () {
                        var win = this;
                        var data = win.record.getData();
                        var form = win.getComponent('form');
                        form.items.items.forEach(function (item) {
                            if (item.disabled == false) {
                                if (item.xtype == 'datetimefield') {
                                    item.setValue(new Date(data[item.getName()]));
                                } else {
                                    item.setValue(data[item.getName()]);
                                }
                            }
                        })
                    },
                    formConfig: {
                        width: 500,
                        saveHandler: function (btn) {
                            var form = btn.ownerCt.ownerCt;
                            var win = form.ownerCt;
                            if (form.isValid()) {
                                var data = {};
                                form.items.items.forEach(function (item) {
                                    if (item.disabled == false) {
                                        if (item.xtype == 'datetimefield') {
                                            data[item.getName()] = Ext.util.Format.date(item.getValue(), 'Y/m/d H:i:s');
                                        } else {
                                            data[item.getName()] = item.getValue();
                                        }
                                    }
                                });
                                console.log(data);
                                if (win.createOrEdit == 'create') {
                                    /*  for (var i = 0; i < win.outGrid.store.getCount(); i++) {
                                          var recordData = win.outGrid.store.getAt(i).getData();
                                          delete recordData.id;
                                          JSObjectValueEqual(recordData, data);
                                      }*/
                                    win.outGrid.store.add(data);
                                } else {
                                    for (var i in data) {
                                        win.record.set(i, data[i]);
                                    }
                                }
                                win.close();
                            }
                        },
                        items: formItems,
                    },
                }
            }
        ];
        me.callParent();
    },
    bbar: [
        '->', {
            xtype: 'button',
            text: i18n.getKey('运行以上测试数据'),
            iconCls: 'icon_agree',
            handler: function (btn) {
                var win = btn.ownerCt.ownerCt;
                var grid = win.getComponent('testDateGrid');
                if (grid.getStore().getCount() >= 1) {
                    win.el.mask();
                    setTimeout(function () {
                        var jsonData = {
                            "productAttributes": [],
                            "productConfigDesignId": win.productConfigDesignId
                        };
                        if (win.configType == 'mappingConfig') {
                            jsonData.productConfigMappingId = win.productConfigDesignId;
                            delete jsonData.productConfigDesignId;
                        }
                        for (var i = 0; i < grid.store.getCount(); i++) {
                            var data = grid.store.getAt(i).getData();
                            var array = [];
                            for (var j in data) {
                                if (j != 'id') {
                                    array.push({
                                        "id": j,
                                        "value": data[j]
                                    })
                                }
                            }
                            jsonData.productAttributes.push(array);
                        }
                        Ext.Ajax.request({
                            url: adminPath + 'api/materialMappingTestRecords',
                            method: 'POST',
                            async: false,
                            jsonData: jsonData,
                            headers: {
                                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                            },
                            success: function (response) {
                                win.el.unmask();
                                var responseMessage = Ext.JSON.decode(response.responseText);
                                if (responseMessage.success) {
                                    Ext.Msg.confirm(i18n.getKey('prompt'), '是否查看测试结果?', function (selector) {
                                        if (selector == 'yes') {
                                            console.log(responseMessage.data)
                                            var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
                                            var productId = JSGetQueryString('productId');
                                            var productConfigDesignId = JSGetQueryString('productConfigDesignId');
                                            var MMTId = JSGetQueryString('MMTId');
                                            var includeIds = [];
                                            for (var i = 0; i < responseMessage.data.length; i++) {
                                                includeIds.push(responseMessage.data[i]._id);
                                            }
                                            builderConfigTab.managerMaterialMappingConfigV3TestHistory(productConfigDesignId, productId, MMTId, includeIds, win.configType);
                                            win.close();
                                        } else {
                                        }
                                    });
                                } else {
                                    win.el.unmask();
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                }
                            },
                            failure: function (response) {
                                win.el.unmask();
                                var responseMessage = Ext.JSON.decode(response.responseText);
                                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                            }
                        });
                    }, 100)
                }
            }
        }, {
            xtype: 'button',
            text: i18n.getKey('cancel'),
            iconCls: 'icon_cancel',
            handler: function (btn) {
                var win = btn.ownerCt.ownerCt;
                win.close();

            }
        }
    ]
})
