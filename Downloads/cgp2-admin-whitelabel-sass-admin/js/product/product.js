Ext.Loader.syncRequire([
    'CGP.common.controller.overridesubmit',
    'CGP.product.view.batchgenerateskuproduct.config.Configs',
    'CGP.common.field.WebsiteCombo'
]);
Ext.onReady(function () {


    var controller = new CGP.product.controller();
    var productController = Ext.create('CGP.product.controller.Controller');
    var backgroundController = Ext.create("CGP.product.controller.BuilderBackground");
    var embellishmentController = Ext.create("CGP.product.controller.BuilderEmbellishment");

    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    };
    Ext.apply(Ext.form.VTypes, {
        verifyUnique: function (value, field) {//验证方法名
            var itemId = field.itemId;
            oldValue = field.ownerCt.ownerCt.getComponent('beforeCopyForm').getComponent(itemId).getValue();
            var oldWebsite = field.ownerCt.ownerCt.getComponent('beforeCopyForm').getComponent('websiteId').getValue();
            var newWebsite = field.ownerCt.ownerCt.getComponent('afterCopyForm').getComponent('websiteId').rawValue;
            if (!Ext.isEmpty(newWebsite) && oldWebsite == newWebsite) {
                if (oldValue == value) {
                    return false;
                }
            }
            return true;
        },
        verifyUniqueText: i18n.getKey('同一网站下，该数据不能和原数据相同')
    });
    var page = Ext.create('Ext.ux.ui.GridPage', {
        accessControl: true,
        i18nblock: i18n.getKey('product'),
        block: 'product',
        editPage: 'edit.html',

        gridCfg: {
            store: productStore,
            columnDefaults: {
                autoSizeColumn: true
            },
            viewConfig: {
                enableTextSelection: true
            },
            columns: [
                {
                    text: i18n.getKey('operation'),
                    sortable: false,
                    width: 105,
                    autoSizeColumn: false,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record) {
                        var configurableProductId = record.get('configurableProductId');
                        var isSku = record.get('type') == 'SKU';
                        var isSpecialSku = isSku && Ext.isEmpty(configurableProductId);//是sku且没有父可配置产品
                        var isGeneralSku = isSku && !Ext.isEmpty(configurableProductId);//是sku且有父可配置产品
                        return {
                            xtype: 'button',
                            ui: 'default-toolbar-small',
                            height: 26,
                            text: i18n.getKey('options'),
                            width: '100%',
                            flex: 1,
                            menu: [
                                {
                                    text: i18n.getKey('priceRule'),
                                    disabledCls: 'menu-item-display-none',
                                    disabled: record.get('type') != 'SKU',
                                    handler: function () {
                                        Ext.create('CGP.product.view.pricerule.ListWindow', {
                                            store: Ext.create('CGP.product.store.PriceRule', {
                                                productId: record.get('id')
                                            }),
                                            productId: record.get('id')
                                        }).show();
                                    }
                                },

                                {
                                    text: i18n.getKey('producePage'),
                                    disabledCls: 'menu-item-display-none',
                                    disabled: record.get('type') != 'SKU',//sku产品才有
                                    handler: function () {
                                        if (record.get('invisible') == false) {
                                            Ext.create('CGP.product.view.producepage.ProducePageWin', {
                                                website: record.get('mainCategory').website,
                                                productId: record.get('id'),
                                                record: record
                                            }).show();
                                        } else {
                                            Ext.Msg.alert('提示', '此产品不能生成页面！');
                                        }
                                    }
                                },
                                {
                                    text: i18n.getKey('product') + i18n.getKey('config'),
                                    disabledCls: 'menu-item-display-none',
                                    handler: function () {
                                        var productId = record.get('id');
                                        controller.productConfig(productId, record.get('type'), configurableProductId);
                                    }
                                },
                                {
                                    text: i18n.getKey('验证产品配置'),
                                    disabledCls: 'menu-item-display-none',
                                    disabled: isGeneralSku,//普通sku产品没该配置
                                    handler: function () {
                                        var productId = record.get('id');
                                        JSOpen({
                                            id: 'validproductconfig',
                                            url: path + 'partials/product/view/validproductconfig/main.html?productId=' + productId,
                                            title: i18n.getKey('验证产品配置') + '(' + productId + ')',
                                            refresh: true
                                        });
                                        /*
                                                                                                    controller.checkProductConfig();
                                        */
                                    }
                                },
                                {
                                    text: i18n.getKey('check') + i18n.getKey('skuProduct'),
                                    disabledCls: 'menu-item-display-none',
                                    disabled: record.get('type') == 'SKU',
                                    handler: function () {
                                        var productId = record.get('id');
                                        JSOpen({
                                            id: 'checkSkuProductPage',
                                            url: path + 'partials/product/view/skuproducts.html?productId=' + productId,
                                            title: i18n.getKey('check') + i18n.getKey('skuProduct'),
                                            refresh: true
                                        });
                                    }
                                },
                                {
                                    text: i18n.getKey('checkOrderLineItem'),
                                    disabledCls: 'menu-item-display-none',
                                    disabled: record.get('type') != 'SKU',
                                    handler: function () {
                                        var productId = record.get('id');
                                        JSOpen({
                                            id: 'orderlineitempage',
                                            url: path + 'partials/orderlineitem/orderlineitem.html' +
                                                '?productId=' + productId +
                                                '&isTest2=' + record.get('isTest'),
                                            title: '订单项管理 所有状态',
                                            refresh: true
                                        });
                                    }
                                },
                                {
                                    text: i18n.getKey('copy') + i18n.getKey('product'),
                                    disabledCls: 'menu-item-display-none',
                                    handler: function () {
                                        controller.copyProduct(record);
                                    }
                                },
                                {
                                    text: i18n.getKey('generate') + i18n.getKey('skuProduct'),
                                    disabledCls: 'menu-item-display-none',
                                    disabled: record.get('type') == 'SKU',
                                    handler: function () {
                                        var productId = record.get('id');
                                        var win = Ext.create('CGP.product.view.batchgenerateskuproduct.view.ShowAttributWindow', {
                                            productId: productId
                                        })
                                        win.show();
                                    }
                                },
                                {
                                    //报关要素
                                    text: i18n.getKey('customsElements'),
                                    disabledCls: 'menu-item-display-none',
                                    handler: function () {
                                        var productId = record.get('id');
                                        var type = record.get('type');
                                        var parentConfigProductId = record.get('configurableProductId') || '';
                                        controller.customsElement(productId, type, parentConfigProductId);
                                    }
                                },
                                // {
                                //     //同步sku报关要素
                                //     text: '同步' + 'sku' + i18n.getKey('product') + i18n.getKey('customsElements'),
                                //     disabledCls: 'menu-item-display-none',
                                //     disabled: record.get('type') == 'SKU',
                                //     handler: function () {
                                //         var lask = page.setLoading();
                                //         var productId = record.get('id');
                                //         var requestConfig = {
                                //             url: adminPath + 'api/products/' + productId + '/syncCustomsElement',
                                //             method: 'PUT',
                                //             headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                                //             success: function (resp) {
                                //                 var response = Ext.JSON.decode(resp.responseText);
                                //                 if (!response.success) {
                                //                     lask.hide();
                                //                     Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                //                 } else {
                                //                     lask.hide();
                                //                     Ext.Msg.alert(i18n.getKey('prompt'), '同步成功！');
                                //                 }
                                //
                                //             },
                                //             failure: function (resp) {
                                //                 lask.hide();
                                //                 var response = Ext.JSON.decode(resp.responseText);
                                //                 Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                //             }
                                //         };
                                //         Ext.Ajax.request(requestConfig);
                                //     }
                                // },
                                // {
                                //     //将产品修改为正式
                                //     text: i18n.getKey('modify') + i18n.getKey('productMode'),
                                //     disabledCls: 'menu-item-display-none',
                                //     //disabled: record.get('type') == 'SKU',
                                //     handler: function () {
                                //         var productId = record.get('id');
                                //         productController.modifyProductMode(productId);
                                //     }
                                // },
                                {
                                    //产品管理
                                    text: i18n.getKey('product') + i18n.getKey('manager'),
                                    disabledCls: 'menu-item-display-none',
                                    //disabled: record.get('type') == 'SKU',
                                    handler: function () {
                                        productController.getProductManagers(record);
                                    }
                                },
                                {
                                    disabledCls: 'menu-item-display-none',
                                    text: i18n.getKey('后台下单'),
                                    disabled: true,
                                    handler: function () {
                                        var productId = record.get('id');
                                        var type = record.get('type');
                                        controller.CGPPlaceOrder(productId, type);
                                    }
                                },
                                {
                                    text: i18n.getKey('属性管理'),
                                    disabledCls: 'menu-item-display-none',
                                    menu: {
                                        items: [
                                            {
                                                text: i18n.getKey('manager') + i18n.getKey('configurable') + i18n.getKey('attribute'),
                                                disabled: isGeneralSku,
                                                handler: function () {
                                                    controller.managerSkuAttribute(record.get('id'), isSpecialSku, isSku);
                                                }
                                            },
                                            {
                                                text: i18n.getKey('导出sku属性'),
                                                disabled: isGeneralSku,
                                                handler: function () {
                                                    var productId = record.get('id');
                                                    var fileUrl = adminPath + 'api/products/' + productId + '/skuAttributes/excel?access_token=' + Ext.util.Cookies.get('token');
                                                    if (!Ext.isEmpty(fileUrl)) {
                                                        var a = document.createElement('a');
                                                        a.setAttribute('href', fileUrl);
                                                        a.setAttribute('download', null);
                                                        a.click();
                                                    }
                                                }
                                            },
                                            {
                                                text: i18n.getKey('manager') + i18n.getKey('productAttributeProfile'),
                                                handler: function () {
                                                    controller.manageProductProfile(record.get('id'));
                                                }
                                            },
                                            /*  {
                                                  //配置可配置产品中属性单向关联关系
                                                  text: i18n.getKey('singleWayAttributeRegulationConfig'),
                                                  handler: function () {
                                                      var productId = record.get('id');
                                                      controller.openAttributeSingleWayRegulation(productId);
                                                  }
                                              },*/
                                            {
                                                //配置可配置产品中属性单向关联关系v2
                                                text: i18n.getKey('singleWayAttributeRegulationConfig'),
                                                disabled: isSku,
                                                handler: function () {
                                                    var productId = record.get('id');
                                                    controller.openAttributeSingleWayRegulationVersion2(productId);
                                                }
                                            },
                                            /*       {
                                                       //配置可配置产品中各个属性的双向关联关系
                                                       text: i18n.getKey('bothWayAttributeRegulationConfig'),
                                                       handler: function () {
                                                           var productId = record.get('id');
                                                           controller.openAttributeBothwayRegulation(productId);
                                                       }
                                                   },*/
                                            {
                                                //配置可配置产品中各个属性的双向关联关系v2
                                                text: i18n.getKey('bothWayAttributeRegulationConfig'),
                                                disabled: isSku,
                                                handler: function () {
                                                    var productId = record.get('id');
                                                    controller.openAttributeBothwayRegulationV2(productId);
                                                }
                                            },
                                            /*,  {
                                                  text: i18n.getKey('manageMutliAttributeConstraint'),
                                                  handler: function () {
                                                      controller.managerSkuAttributeConstraint(record.get('id'));
                                                  }
                                              }, {
                                                  text: i18n.getKey('manageMutliAttributeConstraint') + i18n.getKey('version') + '2',
                                                  handler: function () {
                                                      controller.managerSkuAttributeConstraintVersion2(record.get('id'));
                                                  }
                                              }
                                              {
                                                  text: i18n.getKey('manager') + i18n.getKey('single') + i18n.getKey('attributeConstraint'),
                                                  handler: function () {
                                                      var skuAttributeId = record.getId();
                                                      var store = Ext.create('CGP.product.view.managerskuattribute.store.SkuAttributeConstraint', {
                                                          skuAttributeId: skuAttributeId
                                                      });
                                                      //输入类型
                                                      var inputType = record.get('attribute').inputType;
                                                      controller.managerSkuAttriConstraint(tab, skuAttributeId, id, store, inputType);
                                                  }
                                              }*/, {
                                                text: i18n.getKey('验证产品属性配置表单'),
                                                handler: function () {
                                                    var productId = record.get('id');
                                                    JSOpen({
                                                        id: 'CGPPlaceOrderpage',
                                                        url: path + "partials/product/VerifyProductAttributeConfig.html?productId=" + productId + '&access_token=' + Ext.util.Cookies.get('token'),
                                                        title: i18n.getKey('验证产品属性配置表单'),
                                                        refresh: true
                                                    })

                                                }
                                            },
                                            {
                                                text: i18n.getKey('mappingLink'),
                                                disabled: isSku,
                                                handler: function () {
                                                    var productId = record.get('id');
                                                    JSOpen({
                                                        id: 'product/mappinglinkpage',
                                                        url: path + "partials/product/mappinglink/main.html?productId=" + productId,
                                                        title: i18n.getKey('mappingLink'),
                                                        refresh: true
                                                    })

                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    //产品计价策略管理
                                    text: i18n.getKey('product') + i18n.getKey('计价策略'),
                                    disabledCls: 'menu-item-display-none',
                                    menu: {
                                        items: [
                                            {
                                                text: i18n.getKey('product') + i18n.getKey('pricingStrategy') + i18n.getKey('V2'),
                                                handler: function () {
                                                    var productId = record.get('id');
                                                    JSOpen({
                                                        id: 'productPricingStrategy',
                                                        url: path + "partials/pricingstrategy/main.html" +
                                                            "?productId=" + productId +
                                                            '&clazz=com.qpp.cgp.domain.pricing.configuration.ProductPricingConfig',
                                                        title: i18n.getKey('product') + '(' + productId + ')' + i18n.getKey('pricingStrategy') + i18n.getKey('config'),
                                                        refresh: true
                                                    });
                                                }
                                            },
                                            {
                                                text: i18n.getKey('product') + i18n.getKey('costingStrategy') + i18n.getKey('V2'),
                                                handler: function () {
                                                    var productId = record.get('id');
                                                    JSOpen({
                                                        id: 'productCostingStrategy',
                                                        url: path + "partials/pricingstrategy/main.html" +
                                                            "?productId=" + productId +
                                                            '&clazz=com.qpp.cgp.domain.product.consting.ProductCostingConfig',
                                                        title: i18n.getKey('product') + '(' + productId + ')' + i18n.getKey('costingStrategy') + i18n.getKey('config'),
                                                        refresh: true
                                                    })
                                                }
                                            },

                                            {
                                                //价格调整,各个区域可以有不同的价格
                                                text: i18n.getKey('areaAmountRule'),
                                                disabledCls: 'menu-item-display-none',
                                                handler: function () {
                                                    var productId = record.get('id');
                                                    controller.setAreaAmountRule(productId)
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    //产品计价策略管理
                                    text: i18n.getKey('shippingStrategy'),
                                    disabledCls: 'menu-item-display-none',
                                    //disabled: record.get('type') == 'SKU',
                                    menu: {
                                        items: [
                                            {
                                                text: i18n.getKey('qtyCharge'),
                                                disabledCls: 'menu-item-display-none',
                                                // disabled: record.get('type') == 'SKU',
                                                handler: function () {
                                                    var productId = record.get('id');
                                                    var productType = record.get('type');
                                                    JSOpen({
                                                        id: 'qtyChargeStrategy',
                                                        url: path + "partials/product/view/productshippingcostbyqty/main.html?productId=" + productId + '&productType=' + productType,
                                                        title: i18n.getKey('qtyCharge') + i18n.getKey('shippingStrategy') + '(' + productId + ')',
                                                        refresh: true
                                                    });
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    //产品锁定历史
                                    text: i18n.getKey('productLockHistory'),
                                    disabledCls: 'menu-item-display-none',
                                    handler: function () {
                                        controller.showLockHistory(record.getId());

                                    }
                                }

                            ]
                        };
                    }
                },
                {
                    text: i18n.getKey('id'),
                    autoSizeColumn: false,
                    width: 120,
                    dataIndex: 'id',
                    xtype: 'gridcolumn',
                    itemId: 'id',
                    renderer: function (value, metadata, record) {
                        var mode = record.get('mode');
                        var modeResource = {'TEST': '测试', 'RELEASE': '正式'};
                        return value + '<' + '<text style="color: red">' + modeResource[mode] + '</text>' + '>';
                    }
                },
                {
                    text: i18n.getKey('type'),
                    dataIndex: 'type',
                    xtype: 'gridcolumn',
                    itemId: 'type',
                    sortable: false
                },
                {
                    text: i18n.getKey('sku'),
                    dataIndex: 'sku',
                    autoSizeColumn: false,
                    xtype: 'gridcolumn',
                    itemId: 'sku',
                    sortable: false,
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    width: 250,
                    xtype: 'gridcolumn',
                    itemId: 'name',
                    renderer: function (value, metadata) {
                        metadata.tdAttr = "data-qtip='" + value + "'";
                        return value;
                    }
                },
                {
                    text: i18n.getKey('model'),
                    dataIndex: 'model',
                    xtype: 'gridcolumn',
                    itemId: 'model'
                },
                {
                    text: i18n.getKey('enabledDate'),
                    dataIndex: 'dateAvailable',
                    xtype: 'datecolumn',
                    itemId: 'dateAvailable',
                    renderer: function (date) {
                        return Ext.Date.format(date, 'Y-m-d');
                    }
                },
                {
                    text: i18n.getKey('salePrice'),
                    dataIndex: 'salePrice',
                    xtype: 'gridcolumn',
                    itemId: 'salePrice'
                },
                {
                    text: i18n.getKey('maincategory'),
                    dataIndex: 'mainCategory',
                    xtype: 'gridcolumn',
                    itemId: 'mainCategory',
                    renderer: function (mainCategory) {
                        return mainCategory.name + '(' + mainCategory.id + ')';
                    }
                },
                {
                    text: i18n.getKey('subCategories'),
                    dataIndex: 'subCategories',
                    xtype: 'gridcolumn',
                    itemId: 'subCategories',
                    renderer: function (subCategories) {

                        var value = [];
                        Ext.Array.each(subCategories, function (subCategory) {
                            value.push(subCategory.name + '(' + subCategory.id + ')');
                        })
                        return value.join(",");
                    }
                },
                {
                    text: i18n.getKey('configurableProductId'),
                    dataIndex: 'configurableProductId',
                    width: 120,
                    xtype: 'atagcolumn',
                    clickHandler: function (value, metadata, record) {
                        JSOpen({
                            id: 'productpage_' + value,
                            url: path + 'partials/product/product.html?id=' + value,
                            title: i18n.getKey('product') + '(' + value + ')',
                            refresh: true
                        });
                    },
                    sortable: false,
                    itemId: 'configurableProductId',
                },
                {
                    text: i18n.getKey('website'),
                    xtype: 'gridcolumn',
                    itemId: 'website',
                    hidden: true,
                    dataIndex: 'websiteName',
                    width: 150,

                }
            ]
        },
        filterCfg: {
            layout: {
                type: 'table',
                columns: 4
            },
            items: [
                {
                    id: 'idSearcher',
                    name: 'id',
                    xtype: 'numberfield',
                    hideTrigger: true,
                    /*listeners: {
                        render: function (comp) {
                            var productId = getQueryString('productId');
                            if (productId) {
                                comp.setValue(parseInt(productId));
                            }
                        }
                    },*/
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id'
                },
                {
                    id: 'typeSearcher',
                    name: 'type',
                    xtype: 'combo',
                    value: '',
                    fieldLabel: i18n.getKey('type'),
                    store: new Ext.data.Store({
                        fields: ['name', 'value'],
                        data: [
                            {
                                name: 'Sku',
                                value: 'Sku'
                            },
                            {
                                name: 'Configurable',
                                value: 'Configurable'
                            },
                            {
                                name: i18n.getKey('allType'),
                                value: ''
                            }
                        ]
                    }),
                    displayField: 'name',
                    valueField: 'value',
                    itemId: 'type',
                    editable: false,
                    listeners: {
                        select: function (combo, records) {
                            if (records[0].get('value') == 'Configurable') {
                                combo.ownerCt.getComponent('sku').setValue('');
                            }
                        }
                    }
                },
                {
                    id: 'skuSeacher',
                    name: 'sku',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('sku'),
                    itemId: 'sku',
                    width: 325,
                    listeners: {
                        change: function (field, newValue, oldValue) {
                            var type = field.ownerCt.getComponent('type');
                            //type == configurable   需要为空 不能输入值
                            if (type.getValue() == "Configurable") {
                                field.setValue('');
                                Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('CPNCSKUA') + '!');
                            }
                        }
                    }
                },
                {
                    id: 'nameSearcher',
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name'
                },
                {
                    id: 'modelSearcher',
                    name: 'model',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('model'),
                    itemId: 'model'
                },
                {
                    id: 'dateAvailableSearcher',
                    style: 'margin-right:50px; margin-top : 0px;',
                    name: 'dateAvailable',
                    xtype: 'datefield',
                    itemId: 'fromDate',
                    fieldLabel: i18n.getKey('enabledDate'),
                    format: 'Y/m/d',
                    scope: true,
                    width: 190
                },
                {
                    id: 'salePriceSearcher',
                    name: 'salePrice',
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('salePrice'),
                    itemId: 'salePrice'
                },
                {
                    name: 'mainCategory.website.id',
                    xtype: 'websitecombo',
                    itemId: 'website',
                    hidden: true,
                    value: 11,
                },
                {
                    name: 'mode',
                    xtype: 'combo',
                    isLike: false,
                    editable: false,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['name', 'value'],
                        data: [
                            {name: '正式', value: 'RELEASE'},
                            {name: '测试', value: 'TEST'}
                        ]
                    }),
                    displayField: 'name',
                    valueField: 'value',
                    queryMode: 'local',
                    fieldLabel: i18n.getKey('productMode'),
                    itemId: 'mode'
                },
                {
                    id: 'mainCategory',
                    name: 'mainCategory',
                    xtype: 'productcategorycombo',
                    fieldLabel: i18n.getKey('maincategory'),
                    itemId: 'mainCategory',
                    isLike: false,
                    multiselect: true,
                    isMain: true
                },
                /*    {
                        id: 'subCategories',
                        name: 'subCategories',
                        xtype: 'productcategorycombo',
                        fieldLabel: i18n.getKey('subCategories'),
                        isLike: false,
                        itemId: 'subCategories',
                        defaultWebsite: 11,
                        websiteSelectorEditable: false,
                        multiselect: true,
                        isMain: false
                    },*/
                {
                    id: 'skuConfigurableProductId',
                    name: 'configurableProduct.id',
                    xtype: 'numberfield',
                    itemId: 'configurableProductId',
                    fieldLabel: i18n.getKey('configurableProductId')
                }
            ]
        },
        listeners: {
            afterload: function (page) { //这个afterload事件是自定义事件。在initComponent后触发
                var website = page.filter.getComponent('website');
                var mainCategory = page.filter.getComponent("mainCategory");
                var subCategory = page.filter.getComponent("subCategories");
                //mainCategory.tree.expandAll();
                //subCategory.tree.expandAll();
                var store = page.filter.getComponent('website').getStore();
                store.on('load', function () {
                    this.loadData([
                        {
                            name: i18n.getKey('allWebsite'),
                            id: null
                        }
                    ], true);
                    // website.select(store.getAt(store.getCount() - 1));


                    //如果指定了mainCategory或者subCategory则将网站和对应的分类或目录值设置好并查询
                    // 展示该分类或目录下的产品
                    var searcher = Ext.Object.fromQueryString(location.search);
                    if (!Ext.Object.isEmpty(searcher)) {

                        var websiteId = Ext.Number.from(searcher.website);
                        var record = store.getById(websiteId);
                        var productId = Ext.Number.from(searcher.id);
                        website.select(record);
                        website.fireEvent('select', website, [record]);

                        var mainCategory = page.filter.getComponent('mainCategory');
                        var subCategory = page.filter.getComponent('subCategories');

                        var mainCategoryId;
                        var subCategoryId;
                        if (searcher.hasOwnProperty('mainCategory')) {
                            mainCategoryId = Ext.Number.from(searcher.mainCategory);

                        } else {
                            subCategoryId = Ext.Number.from(searcher.subCategory);
                        }
                        if (!Ext.isEmpty(productId)) {
                            if (page.grid.getStore().isLoading()) {
                                page.grid.getStore().on('load', function () {
                                    page.grid.getStore().loadPage(1);
                                }, this, {
                                    single: true
                                })
                            } else {
                                page.grid.getStore().loadPage(1);
                            }
                        }
                        //设置mainCategory默认值
                        if (mainCategoryId)
                            mainCategory.store.on('load', function onload() {
                                mainCategory.websiteSelector.setValue(websiteId);
                                console.log('setInitialValue 1');
                                mainCategory.setInitialValue([mainCategoryId]);
                                console.log('setInitialValue 2');
                                mainCategory.store.removeListener('load', onload);
                                if (page.grid.getStore().isLoading()) {
                                    page.grid.getStore().on('load', function () {
                                        page.grid.getStore().loadPage(1);
                                    }, this, {
                                        single: true
                                    })
                                } else {
                                    page.grid.getStore().loadPage(1);
                                }

                            });
                        mainCategory.store.load();
                        //设置subCategory默认值
                        if (subCategoryId) {
                            subCategory.store.on('load', function onload() {
                                subCategory.websiteSelector.setValue(websiteId);
                                subCategory.setInitialValue([subCategoryId])
                                subCategory.store.removeListener('load', onload);
                                if (page.grid.getStore().isLoading()) {
                                    page.grid.getStore().on('load', function () {
                                        page.grid.getStore().loadPage(1);
                                    }, this, {
                                        single: true
                                    })
                                } else {
                                    page.grid.getStore().loadPage(1);
                                }

                            });
                            subCategory.store.load();
                        }
                    }

                }, store);
                store.load();
            },

            afterrender: function (panel) {
                var grid = panel.grid;
                var toolbar = grid.getDockedItems('toolbar[dock="top"]')[0];

                toolbar.insert(4, {
                    xtype: 'button',
                    width: 90,
                    hidden: true,
                    iconCls: 'icon_place_order',
                    text: i18n.getKey('后台下单'),
                    handler: function () {
                        var selection = grid.getSelectionModel().getSelection();
                        if (selection.length == 0) {
                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('选择一个产品来进行下单'));
                            return;
                        }
                        if (selection.length > 1) {
                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('只能选择单个产品进行下单'));
                            return;
                        }
                        var productId = selection[0].get('id');
                        var type = selection[0].get('type');
                        controller.CGPPlaceOrder(productId, type);
                    }
                });
                toolbar.add({
                    xtype: 'button',
                    width: 90,
                    iconCls: 'icon_refresh',
                    text: i18n.getKey('syncProduct'),
                    hidden: (window.env == 'dev'),
                    handler: function () {
                        var selections = grid.getSelectionModel().getSelection();
                        if (selections.length == 0) {
                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('未选择产品'));
                            return;
                        }
                        if (selections.length > 0) {
                            var productList = [];
                            Ext.each(selections, function (product) {
                                productList.push(product.data);
                            })
                            Ext.create('CGP.product.view.syncproduct.InputFormWin', {
                                productList: productList,
                                progressContainer: page.toolbar
                            })
                        }
                    }
                })
                //me.config.gridCfg.editAction = false;
                //根据权限中是否允许编辑。判断是否需要锁定
                Ext.util.Cookies.set('productEditAction', panel.grid.editAction, null, '/' + top.pathName);

            }
        }
    })

})
