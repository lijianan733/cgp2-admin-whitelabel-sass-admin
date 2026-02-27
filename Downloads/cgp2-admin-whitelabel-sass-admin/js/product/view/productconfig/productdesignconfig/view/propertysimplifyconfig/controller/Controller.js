/**
 * Created by nan on 2021/11/10
 */
Ext.define("CGP.product.view.productconfig.productdesignconfig.view.propertysimplifyconfig.controller.Controller", {

    /**
     * 组建符合条件组件的属性上下文
     * @param rtTypeId
     * @returns {[]}
     */
    buildContentData: function (rtTypeId) {
        var contentData = [];
        var url = adminPath + 'api/rtTypes/' + rtTypeId + '/rtAttributeDefs';
        JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
            var responseText = Ext.JSON.decode(response.responseText);
            var attributes = responseText.data;
            for (var i = 0; i < attributes.length; i++) {
                var attribute = attributes[i];
                var attrOptions = [];
                for (var j = 0; j < attribute.options.length; j++) {
                    attrOptions.push({
                        name: attribute.options[j].name,
                        id: attribute.options[j].value,
                    })
                }
                contentData.push({
                    id: attribute.id,
                    key: attribute.name,
                    type: 'skuAttribute',
                    valueType: attribute.valueType,
                    selectType: attribute.selectType,
                    attrOptions: attrOptions,
                    required: attribute.required,
                    displayName: attribute.name,//sku属性
                    path: 'args.context',//该属性在上下文中的路径
                    attribute: attribute
                })
            }
        })
        return contentData;
    },
    /**
     *
     * @param data
     * @param form
     */
    saveConfig: function (data, form) {
        var me = this;
        var url = adminPath + 'api/propertySimplifyConfigs';
        var method = "POST";
        if (data._id) {
            url = url + '/' + data._id;
            method = 'PUT';
        }
        JSAjaxRequest(url, method, false, data, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                form.setValue(responseText.data);
            }
        })
    },
    /**
     * 输入上下文模板的具体数据，测试是否正确运行配置
     * @param data
     */
    testConfig: function (data, form) {
        var rtType = data.propertyTypeSchema;
        var resultStore = Ext.create('Ext.data.Store', {
            fields: [{
                name: 'notSkuAttribute',
                type: 'object'
            }, {
                name: 'value',
                type: 'string'
            }],
            proxy: {
                type: 'memory'
            },
            data: []
        });
        var win = Ext.create('Ext.window.Window', {
            title: i18n.getKey('test') + '(<font color="red">测试前请确保配置已经保存</font>)',
            modal: true,
            constrain: true,
            layout: 'fit',
            items: [
                {
                    xtype: 'errorstrickform',
                    layout: {
                        type: 'vbox',
                        align: 'stretchmax'
                    },
                    padding: 0,
                    border: false,
                    items: [
                        {
                            xtype: 'rttypetortobjectfieldcontainer',
                            allowBlank: false,
                            width: 500,
                            rtTypeAttributeInputFormConfig: {
                                hideRtType: true,
                                maxHeight: 250,
                                allowBlank: false,
                            },
                            rtTypeId: rtType._id,
                            rtType: rtType,
                            itemId: 'propertyTypeSchema',
                            name: 'propertyTypeSchema',
                            labelAlign: 'top',
                            fieldLabel: "<font style= 'color:green;font-weight: bold'> " + i18n.getKey('上下文') + '</font>',
                            diyGetValue: function () {
                                var data = this.getValue();
                                if (data) {
                                    return data.rtType;
                                }
                            },
                            diySetValue: function (data) {
                                var me = this;
                                me.setValue({
                                    rtType: data
                                })
                            }
                        },
                        {
                            labelAlign: 'top',
                            fieldLabel: "<font style= 'color:green;font-weight: bold'> " + i18n.getKey('结果') + '</font>',
                            xtype: 'gridfieldextendcontainer',
                            displayField: 'name',
                            valueField: 'id',
                            itemId: 'result',
                            margin: '10 0 -5 0',
                            hidden: true,
                            store: resultStore,
                            gridConfig: {
                                height: 250,
                                store: resultStore,
                                width: 500,
                                viewConfig: {
                                    enableTextSelection: true
                                },
                                columns: [
                                    {
                                        text: i18n.getKey('非SKU属性'),
                                        flex: 6,
                                        sortable: false,
                                        dataIndex: 'notSkuAttribute',
                                        renderer: function (value) {
                                            return value['displayName'] + '(' + value['id'] + ')';
                                        }
                                    },
                                    {
                                        text: i18n.getKey('value'),
                                        xtype: 'componentcolumn',
                                        flex: 7,
                                        dataIndex: 'value',
                                        sortable: false,
                                        renderer: function (value, metadata, record, a, b, c, view) {
                                            var notSkuAttribute = record.get('notSkuAttribute');
                                            var comp;
                                            comp = Qpp.CGP.util.createFieldByAttributeV2(notSkuAttribute.attribute, {
                                                msgTarget: 'side',
                                                valueField: 'id',
                                                validateOnChange: false,
                                                fieldLabel: null,
                                                allowBlank: false,
                                            });
                                            if (notSkuAttribute.attribute.options.length > 0) {
                                                //界面输入是[1,2,3],后台返回是‘1,2,3’
                                                if (notSkuAttribute.attribute.selectType == "MULTI") {
                                                    comp.value = value.split(',');
                                                    comp.value = comp.value.map(function (item) {
                                                        return Number(item);
                                                    });
                                                } else {
                                                    comp.value = Number(value);
                                                }
                                            } else {
                                                comp.value = value;
                                            }
                                            return comp;
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            labelAlign: 'top',
                            fieldLabel: "<font style= 'color:green;font-weight: bold'> " + i18n.getKey('结果') + '</font>',
                            xtype: 'textarea',
                            height: 250,
                            margin: '5 0 0 0',
                            width: 500,
                            itemId: 'errorInfo'
                        },
                    ]
                },
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        var form = win.items.items[0];
                        var propertyTypeSchema = form.getComponent('propertyTypeSchema');
                        var errorInfo = form.getComponent('errorInfo');
                        var result = form.getComponent('result');
                        if (propertyTypeSchema.isValid()) {
                            JSSetLoading(true, 'asdffasdf');
                            var properties = propertyTypeSchema.getValue().objectJSON;
                            var jsonData = {
                                "properties": properties,
                                "propertySimplifyConfigId": data._id
                            };
                            var url = adminPath + 'api/propertySimplifyConfigs/test';
                            JSAjaxRequest(url, 'POST', true, jsonData, '测试完成', function (require, success, response) {
                                var responseText = Ext.JSON.decode(response.responseText);
                                JSSetLoading(false);
                                win.result = responseText.data;
                                if (responseText.success) {
                                    //构建数据
                                    var attributeStore = Ext.data.StoreManager.get('attributeStore');
                                    var data = responseText.data;
                                    var storeData = [];
                                    for (var i in data) {
                                        //根据attributeId查找skuAttribute
                                        var attributeId = i;
                                        var value = data[i];
                                        var index = attributeStore.findBy(function (record, id) {
                                            if (record.get('attribute').id == attributeId) {
                                                return record;
                                            }
                                        });
                                        var skuAttribute = attributeStore.getAt(index);
                                        storeData.push({
                                            notSkuAttribute: skuAttribute.getData(),
                                            value: value
                                        })
                                    }
                                    result.store.proxy.data = storeData;
                                    result.store.load();
                                    result.show();
                                    errorInfo.hide();
                                    console.log(responseText)
                                } else {
                                    errorInfo.show();
                                    result.hide();
                                    errorInfo.setValue(responseText.data.message);
                                }
                            });

                        }
                    }
                },
                lastStepBtnCfg: {
                    text: i18n.getKey('查看结果JSON'),
                    iconCls: 'icon_check',
                    hidden: false,
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        JSShowJsonData(win.result, '测试结果');

                    }
                }
            }
        });
        win.show();

    }
})