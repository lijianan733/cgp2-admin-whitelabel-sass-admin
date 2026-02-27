Ext.Loader.syncRequire([
    'CGP.language.store.LanguageStore',
    'CGP.common.field.WebsiteCombo'
])
Ext.define('CGP.product.controller', {
    managerSkuAttribute: function (id, isSpecialSku, isSku) {
        JSOpen({
            id: 'managerskuattribute',
            url: path + "partials/product/managerskuattribute.html?id=" + id + '&isSpecialSku=' + isSpecialSku + '&isSku=' + isSku,
            title: i18n.getKey('manager') + i18n.getKey('configurable') + i18n.getKey('attribute') + '(' + i18n.getKey('productCode') + ':' + id + ')',
            refresh: true
        });
    },
    managerSkuAttributeConstraint: function (id) {
        JSOpen({
            id: 'managerskuattributeConstraint',
            url: path + "partials/product/managerskuattributeConstraint.html?id=" + id,
            title: i18n.getKey('managerProductAttrConstraint') + '(' + i18n.getKey('id') + ':' + id + ')',
            refresh: true
        });
    },
    managerSkuAttributeConstraintVersion2: function (id) {
        JSOpen({
            id: 'managerskuattributeConstraintversion2',
            url: path + "partials/product/managerskuattributeconstraintversion2.html?id=" + id,
            title: i18n.getKey('managerProductAttrConstraint') + i18n.getKey('version') + '2' + '(' + i18n.getKey('id') + ':' + id + ')',
            refresh: true
        });
    },
    modifyProductPackageWin: function (productId, store, filterPackageId, packageData) {
        var me = this;
        Ext.create('CGP.product.view.productpackage.AllPackageWin', {
            productId: productId,
            controller: me,
            filterPackageId: filterPackageId,
            productPackageStore: store,
            filterData: packageData

        }).show();
    },
    modifyProductPackage: function (allPackageWin, packageId) {
        Ext.MessageBox.confirm('提示', '是否为产品添加此部件?', callBack);

        function callBack(id) {
            //var selected = me.getSelectionModel().getSelection();
            if (id === "yes") {
                var requestConfig = {
                    url: adminPath + 'api/products/' + allPackageWin.productId + '/packages',
                    method: 'POST',
                    jsonData: {"packageId": packageId},
                    headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                    success: function (resp) {
                        allPackageWin.productPackageStore.load();
                        allPackageWin.close();
                    },
                    failure: function (resp) {
                        var response = Ext.JSON.decode(resp.responseText);
                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                    }
                }
                Ext.Ajax.request(requestConfig);
                //store.sync();
            } else {
                close();
            }
        }
    },
    /**
     * @param productId
     * @param productType  SKU or Configurable
     * @param configurableProductId  sku产品的来源
     */
    productConfig: function (productId, productType, configurableProductId) {
        var controller = this;
        var isLock = JSCheckProductIsLock(productId);
        Ext.Ajax.request({
            url: adminPath + 'api/productConfigs/products/' + productId,
            method: 'GET',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (res) {
                var response = Ext.JSON.decode(res.responseText);
                var success = response.success;
                var productConfigId = response.data.id;
                if (success == true) {
                    function openProductTab(productId, productConfigId, productType) {
                        JSOpen({
                            id: 'productconfig',
                            url: path + "partials/product/productconfig/productconfig.html" +
                                "?productId=" + productId +
                                '&productConfigId=' + productConfigId +
                                '&productType=' + productType +
                                '&isLock=' + isLock +
                                '&configurableProductId=' + (configurableProductId ? configurableProductId : ''),
                            title: i18n.getKey('product') + i18n.getKey('config') + '(' + i18n.getKey('productCode') + ':' + productId + ')',
                            refresh: true
                        });
                    }

                    if (productConfigId != null) {
                        openProductTab(productId, productConfigId, productType)
                    } else {
                        Ext.Msg.confirm('提示', '产品配置为空，是否创建？', callback);

                        function callback(id) {
                            if (id === 'yes') {
                                Ext.Ajax.request({
                                    url: adminPath + 'api/productConfigs/products/' + productId,
                                    method: 'POST',
                                    jsonData: {},
                                    headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                                    success: function (resp) {
                                        var response = Ext.JSON.decode(resp.responseText);
                                        var success = response.success;
                                        if (success) {
                                            var productConfigId = response.data.id;
                                            openProductTab(productId, productConfigId, productType)
                                        } else {
                                            Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                        }
                                    },
                                    failure: function (resp) {
                                        var response = Ext.JSON.decode(resp.responseText);
                                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                    }
                                })
                            } else {
                                window.close();
                            }
                        }
                    }
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        })

    },
    copyProduct: function (record) {
        var type = record.get('type');
        var productId = record.get('id');
        var model = record.get('model');//当为sku产品时不需要
        var websiteId = 11;
        var websiteStore = Ext.StoreManager.lookup('websiteStore');
        var website = (Ext.StoreManager.lookup('websiteStore').findRecord('id', websiteId)).get('name');
        var sku = record.get('sku');//当为可配置产品时不需要
        Ext.create('Ext.window.Window', {
            header: false,
            height: 400,
            width: 600,
            modal: true,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            bbar: ['->', {
                xtype: 'button',
                text: i18n.getKey('ok'),
                iconCls: 'icon_agree',
                handler: function (view) {
                    var win = view.ownerCt.ownerCt;
                    win.el.mask('创建中...');
                    var afterCopyForm = view.ownerCt.ownerCt.getComponent('afterCopyForm');
                    if (afterCopyForm.isValid()) {
                        var data = afterCopyForm.getValues();
                        Ext.Ajax.request({
                            url: adminPath + 'api/products/' + productId + '/copy',
                            method: 'POST',
                            headers: {
                                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                            },
                            jsonData: data,
                            timeout: 300000,
                            success: function (response) {
                                win.el.unmask();
                                var responseMessage = Ext.JSON.decode(response.responseText);
                                var productId = responseMessage.data.id;
                                if (responseMessage.success) {
                                    Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('成功创建产品：' + productId + '<br>是否查看该产品?'), function (selector) {
                                        if (selector == 'yes') {
                                            JSOpen({
                                                id: 'productpage',
                                                url: path + 'partials/product/product.html?id=' + productId,
                                                title: i18n.getKey('product'),
                                                refresh: true
                                            });
                                        }
                                        win.close();
                                    });
                                } else {
                                    var responseMessage = Ext.JSON.decode(response.responseText);
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                }
                            },
                            failure: function (response) {
                                win.el.unmask();
                                var responseMessage = Ext.JSON.decode(response.responseText);
                                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                            }
                        });
                    }
                }
            }, {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                iconCls: 'icon_cancel',
                handler: function (view) {
                    view.ownerCt.ownerCt.close();
                }
            }],
            items: [
                {
                    itemId: 'beforeCopyForm',
                    xtype: 'form',
                    border: false,
                    flex: 1,
                    defaults: {
                        align: 'center',
                        margin: '10 10 10',
                        labelWidth: 60
                    },
                    /*
                     margin: 10,
                     */
                    title: '原产品',
                    items: [
                        {
                            xtype: 'displayfield',
                            fieldLabel: i18n.getKey('type'),
                            value: type
                        },
                        {
                            xtype: 'displayfield',
                            fieldLabel: i18n.getKey('website'),
                            hidden: true,
                            value: website,
                            websiteId: websiteId,
                            itemId: 'websiteId'

                        },
                        {
                            xtype: 'displayfield',
                            fieldLabel: i18n.getKey('model'),
                            value: model,
                            itemId: 'model',
                            disabled: type == 'SKU',
                            hidden: type == 'SKU'
                        },
                        {
                            xtype: 'displayfield',
                            fieldLabel: i18n.getKey('sku'),
                            value: sku,
                            itemId: 'sku',
                            disabled: type != 'SKU',
                            hidden: type != 'SKU'
                        }
                    ]
                },
                {
                    xtype: 'displayfield',
                    padding: 0,
                    margin: '-20 0 0 0 ',
                    border: false,
                    value: '<div style="height:500px; width:1px; border-left:1px gray solid"></div>'
                },
                {
                    xtype: 'form',
                    flex: 1,
                    border: false,
                    itemId: 'afterCopyForm',
                    defaults: {
                        align: 'center',
                        margin: '10 10 10',
                        labelWidth: 60,
                        allowBlank: false,
                        msgTarget: 'side'
                    },
                    title: '生成产品',
                    /*
                     margin: 10,
                     */
                    items: [
                        {
                            xtype: 'displayfield',
                            fieldLabel: i18n.getKey('type'),
                            value: type
                        },
                        {
                            xtype: 'hiddenfield',
                            value: parseInt(productId),
                            name: 'productId'
                        },
                        {
                            xtype: 'websitecombo',
                            name: 'websiteId',
                            itemId: 'websiteId',
                            value: parseInt(websiteId) || 11,
                            hidden: true,
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: i18n.getKey('model'),
                            name: 'model',
                            itemId: 'model',
                            disabled: type == 'SKU',
                            hidden: type == 'SKU',
                            vtype: 'verifyUnique'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: i18n.getKey('sku'),
                            name: 'sku',
                            itemId: 'sku',
                            disabled: type != 'SKU',
                            hidden: type != 'SKU',
                            vtype: 'verifyUnique'
                        }
                    ]
                }

            ]
        }).show();
    },
    customsElement: function (productId, type, parentConfigProductId) {
        JSOpen({
            id: 'customsElements',
            url: path + "partials/product/customselement/main.html?productId=" + productId + "&type=" + type + "&parentConfigProductId=" + parentConfigProductId,
            title: i18n.getKey('customsElements'),
            refresh: true
        });
    },
    /**
     * 打开产品属性双向映射关系编辑panel
     * @param productId
     */
    openAttributeBothwayRegulation: function (productId) {
        JSOpen({
            id: 'bothWayAttributePropertyRelevanceConfig',
            url: path + "partials/product/bothwayattributepropertyrelevanceconfig/main.html?productId=" + productId,
            title: i18n.getKey('bothWayAttributeRegulationConfig') + '(' + i18n.getKey('product') + ':' + productId + ')',
            refresh: true
        });
    },
    /**
     * 打开产品属性双向映射关系编辑panel
     * @param productId
     */
    openAttributeBothwayRegulationV2: function (productId) {
        JSOpen({
            id: 'bothWayAttributePropertyRelevanceConfig',
            url: path + "partials/product/bothwayattributemapping/main.html?productId=" + productId,
            title: i18n.getKey('bothWayAttributeRegulationConfig') + '(' + i18n.getKey('product') + ':' + productId + ')',
            refresh: true
        });
    },
    openAttributeSingleWayRegulationVersion2: function (productId) {
        JSOpen({
            id: 'singleWayAttributePropertyRelevanceConfigVersion2',
            url: path + "partials/product/singlewayattributepropertyrelevanceconfigversion2/main.html?productId=" + productId,
            title: i18n.getKey('singleWayAttributeRegulationConfig') + '(' + i18n.getKey('product') + ':' + productId + ')',
            refresh: true
        });
    },
    manageProductProfile: function (productId) {
        JSOpen({
            id: 'manageProductAttributeProfile',
            url: path + "partials/product/view/productattributeprofile/main.html?productId=" + productId,
            title: i18n.getKey('productAttributeProfile'),
            refresh: true
        });
    },
    CGPPlaceOrder: function (productId, type) {
        Ext.util.Cookies.set('cgpOrderItemArr', '[]');
        if (type == 'SKU') {
            JSOpen({
                id: 'CGPPlaceOrderpage',
                url: path + "partials/order/cgpplaceorder/cgpplaceorder.html?productId=" + productId + '&type=' + type,
                title: i18n.getKey('后台下单'),
                refresh: true
            })
        } else {
            JSOpen({
                id: 'CGPPlaceOrderpage',
                url: path + "partials/order/cgpplaceorder/cgpplaceordergeneratesku.html?productId=" + productId + '&type=' + type,
                title: i18n.getKey('后台下单'),
                refresh: true
            })
        }
    },
    /**
     * 显示产品锁定操作历史
     */
    showLockHistory: function (productId) {
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            constrain: true,
            width: 500,
            height: 450,
            title: i18n.getKey('productLockHistory'),
            layout: 'fit',
            items: [
                {
                    xtype: 'grid',
                    store: Ext.create('CGP.product.store.ProductLockHistoryStore', {
                        productId: productId
                    }),
                    columns: [
                        {
                            xtype: 'rownumberer'
                        },
                        {
                            dataIndex: 'userId',
                            flex: 1,
                            text: i18n.getKey('customer') + i18n.getKey('id'),
                            xtype: 'componentcolumn',
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip="查看用户"';
                                return {
                                    xtype: 'displayfield',
                                    value: '<a href="#")>' + value + '</a>',
                                    listeners: {
                                        render: function (display) {
                                            var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                            var ela = Ext.fly(a); //获取到a元素的element封装对象
                                            ela.on("click", function () {
                                                JSOpen({
                                                    id: 'customerpage',
                                                    url: path + 'partials/customer/customer.html?id=' + value,
                                                    title: i18n.getKey('customer'),
                                                    refresh: true
                                                })
                                            });
                                        }
                                    }
                                };
                            }
                        },
                        {
                            dataIndex: 'operatorDate',
                            flex: 1,
                            text: i18n.getKey('operatorDate'),
                            renderer: function (value, metadata, record) {
                                metadata.style = "color: gray";
                                value = Ext.Date.format(value, 'Y/m/d H:i');
                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                return '<div style="white-space:normal;">' + value + '</div>';
                            }
                        },
                        {
                            dataIndex: 'lockStatus',
                            flex: 1,
                            text: i18n.getKey('lockStatus')
                        },
                    ]
                }
            ]
        });
        win.show();
    },
    /**
     * 设置区域计价规则
     */
    setAreaAmountRule: function (productId) {
        var areaAmountRuleStore = Ext.create('CGP.areaamountrule.store.AreaAmountRuleStore', {});
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            constrain: true,
            title: i18n.getKey('areaAmountRule'),
            layout: 'fit',
            items: [
                {
                    xtype: 'errorstrickform',
                    defaults: {
                        margin: '5 25 10 25'
                    },
                    items: [
                        {
                            xtype: 'hiddenfield',
                            value: productId,
                            name: 'product',
                            itemId: 'product',
                            diyGetValue: function () {
                                var me = this;
                                return {
                                    type: 'configurable',
                                    clazz: "com.qpp.cgp.domain.product.ConfigurableProduct",
                                    id: me.getValue()
                                };
                            },
                            diySetValue: function (data) {
                                var me = this;
                                if (data) {
                                    me.setValue(data.id);
                                }
                            }
                        },
                        {
                            xtype: 'hiddenfield',
                            name: 'clazz',
                            itemId: 'clazz',
                            clazz: "com.qpp.cgp.domain.adjust.ProductOfAdjustAmount"
                        },
                        {
                            xtype: 'hiddenfield',
                            name: '_id',
                            itemId: '_id',
                        },
                        {
                            xtype: 'gridcombo',
                            name: 'adjust',
                            itemId: 'adjust',
                            editable: false,
                            fieldLabel: i18n.getKey('areaAmountRule'),
                            multiSelect: false,
                            displayField: 'name',
                            valueField: '_id',
                            store: areaAmountRuleStore,
                            matchFieldWidth: false,
                            filterCfg: {
                                height: 80,
                                layout: {
                                    type: 'column',
                                    columns: 2
                                },
                                fieldDefaults: {
                                    width: 200,
                                    style: 'margin-left:20px; margin-top : 5px;',
                                    labelWidth: 50
                                },
                                items: [
                                    {
                                        id: 'idSearchField',
                                        name: '_id',
                                        xtype: 'textfield',
                                        hideTrigger: true,
                                        isLike: false,
                                        fieldLabel: i18n.getKey('id'),
                                        itemId: 'id'
                                    }, {
                                        name: 'name',
                                        xtype: 'textfield',
                                        hideTrigger: true,
                                        fieldLabel: i18n.getKey('name'),
                                        itemId: 'name'
                                    }, {
                                        name: 'description',
                                        xtype: 'textfield',
                                        hideTrigger: true,
                                        fieldLabel: i18n.getKey('description'),
                                        itemId: 'description'
                                    }
                                ]
                            },
                            gridCfg: {
                                width: 500,
                                height: 400,
                                columns: [
                                    {
                                        text: i18n.getKey('id'),
                                        dataIndex: '_id',
                                        itemId: 'builderId',
                                        xtype: 'componentcolumn',
                                        renderer: function (value, metadata, record) {
                                            metadata.tdAttr = 'data-qtip=查看Builder';
                                            return {
                                                xtype: 'displayfield',
                                                value: '<a href="#")>' + value + '</a>',
                                                listeners: {
                                                    render: function (display) {
                                                        var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                                        var ela = Ext.fly(a); //获取到a元素的element封装对象
                                                        ela.on("click", function () {
                                                            JSOpen({
                                                                id: 'areaAmountRule',
                                                                url: path + 'partials/areaamountrule/main.html?_id=' + value,
                                                                title: i18n.getKey('areaAmountRule'),
                                                                refresh: true
                                                            });

                                                        });
                                                    }
                                                }
                                            };
                                        }
                                    },
                                    {
                                        dataIndex: 'name',
                                        text: i18n.getKey('name')
                                    },
                                    {
                                        dataIndex: 'description',
                                        flex: 1,
                                        text: i18n.getKey('description')
                                    },
                                ],
                                bbar: {
                                    xtype: 'pagingtoolbar',
                                    store: areaAmountRuleStore
                                },
                                listeners: {
                                    beforeselect: function (rowMode, record, rowIndex) {
                                        var isAllow = true;
                                        for (var i = 0; i < event.path.length; i++) {
                                            var item = event.path[i];
                                            var tagName = item.tagName;
                                            if (tagName == 'HTML') {
                                                break;
                                            }
                                            var clazz = item.getAttribute('class');
                                            if (clazz && clazz.indexOf('x-grid-cell-builderId') != -1) {
                                                isAllow = false;
                                                break;
                                            }
                                        }
                                        return isAllow;
                                    },
                                }
                            },
                            haveReset: true,
                            diySetValue: function (data) {
                                var me = this;
                                if (data) {
                                    me.setInitialValue([data._id])
                                }
                            }
                        }
                    ]
                }
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        var form = win.items.items[0];
                        var url = adminPath + 'api/productofadjustamount';
                        var data = form.getValue();
                        var method = 'POST';
                        if (data._id) {
                            url = adminPath + 'api/productofadjustamount' + '/' + data._id;
                            method = 'PUT';
                        }
                        JSAjaxRequest(url, method, false, data, null);
                    }
                }
            },
            listeners: {
                afterrender: function () {
                    var me = this;
                    var form = me.items.items[0];
                    var url = adminPath + 'api/productofadjustamount?page=1&limit=25&filter=[{"name":"product.id","value":' + productId + ',"type":"number"}]';
                    JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
                        var responseText = Ext.JSON.decode(response.responseText);
                        if (success && responseText.data.content && responseText.data.content.length > 0) {
                            form.setValue(responseText.data.content[0]);
                        }
                    });
                }
            }
        });
        win.show();
    }
})
