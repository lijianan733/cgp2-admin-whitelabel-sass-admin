/**
 * @author xiu
 * @date 2023/2/20
 */
Ext.Loader.syncRequire([
    'partner.productSupplier.view.AttributeMapping',
    'partner.productSupplier.view.ProductPMVTMapping', ,
    'partner.productSupplier.view.ProductPMVTMappingV2'
])
Ext.define('partner.productSupplier.view.EditSupplierProductConfig', {
    extend: 'Ext.window.Window',
    alias: 'widget.edit_supplier_product_config',
    title: i18n.getKey('edit') + '_' + i18n.getKey('供应商产品配置'),
    width: 1200,
    height: 700,
    modal: true,
    layout: 'fit',
    data: null,
    parentStore: null,
    autoScroll: true,
    productId: null,
    attributeVersionId: null,
    version: 'v1',//v1,v2,根据字段pmvtMappingV2有无来判断
    diySetValue: function (data) {
        var me = this;
        var items = me.items.items;
        items.forEach(item => {
            item.diySetValue ? item.diySetValue(data) : item.setValue(data)
        })
    },
    initComponent: function () {
        var me = this;
        var productId = null;
        var sku = me.data.sku;
        var id = me.data._id;
        if (me.data?.pmvtMapping) {
            me.version = 'v1';
        } else {
            me.version = 'v2';
        }
        me.items = [
            {
                xtype: 'form',
                itemId: 'form',
                layout: 'vbox',
                autoScroll: true,
                defaults: {
                    margin: '0 0 10 10',
                    width: '100%',

                    isValid: function () {
                        var me = this;
                        var isValid = true;
                        var items = me.items.items;
                        var result = [];
                        items.forEach(item => {
                            !item.hidden && result.push(item.isValid && item.isValid())
                        });
                        result.forEach(item => !item && (isValid = false));
                        return isValid;
                    }
                },
                diyGetValue: function () {
                    var result = {};
                    var me = this;
                    var items = me.items.items;
                    items.forEach(item => {
                        var data = !item.hidden && (item.diyGetValue ? item.diyGetValue() : item.getValue());
                        Ext.Object.merge(result, data);
                        var skuModel = {
                            "productId": result.manufactureProduct,
                            "sku": sku,
                            "clazz": "com.qpp.cgp.domain.partner.cooperation.manufacture.SkuManufactureProduct"
                        }
                        item.hidden && (result.manufactureProduct = skuModel)
                    })
                    return result;
                },
                diySetValue: function (data) {
                    var me = this;
                    var items = me.items.items;
                    items.forEach(item => {
                        !item.hidden && (item.diySetValue ? item.diySetValue(data) : item.setValue(data))
                    })
                },
                isValid: function () {
                    var me = this;
                    var isValid = true;
                    var items = me.items.items;
                    var result = [];
                    items.forEach(item => {
                        !item.hidden && result.push(item.isValid && item.isValid())
                    });
                    result.forEach(item => !item && (isValid = false));
                    return isValid;
                },
                items: [
                    { //已完成
                        xtype: 'container',
                        itemId: 'container',
                        name: 'product',
                        margin: '10 0 10 10',
                        defaults: {
                            width: 350,
                            margin: '0 0 5 10',
                        },
                        diyGetValue: function () {
                            var result = {};
                            var me = this;
                            var items = me.items.items;
                            items.forEach(item => {
                                var name = item.name;
                                result[name] = item.diyGetValue ? item.diyGetValue() : item.getValue();
                            })
                            return result;
                        },
                        diySetValue: function (data) {
                            var me = this;
                            var items = me.items.items;
                            items.forEach(item => {
                                var name = item.name
                                item.diySetValue ? item.diySetValue(data[name]) : item.setValue(data[name])
                            })
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                name: '_id',
                                fieldLabel: i18n.getKey('_id'),
                                hidden: true,
                            },
                            {
                                xtype: 'textfield',
                                name: 'clazz',
                                hidden: true,
                                fieldLabel: i18n.getKey('clazz'),
                                value: 'com.qpp.cgp.domain.partner.cooperation.manufacture.ProductOfManufacture',
                            },
                            {
                                xtype: 'textfield',
                                name: 'name',
                                readOnly: true,
                                fieldStyle: 'background-color: silver',
                                fieldLabel: i18n.getKey('产品名称')
                            },
                            {
                                xtype: 'textfield',
                                name: 'manufactureProduct',
                                itemId: 'manufactureProductId',
                                allowBlank: false,
                                fieldLabel: i18n.getKey('供应商产品编号'),
                                diySetValue: function (data) {
                                    var me = this;
                                    me.setValue(data?.productId)
                                }
                            },
                            {
                                xtype: 'textfield',
                                name: 'productScope',
                                itemId: 'productScope',
                                readOnly: true,
                                fieldStyle: 'background-color: silver',
                                hidden: true,
                                _id: null,
                                productId: null,
                                attributeVersionId: me.attributeVersionId,
                                clazz: 'com.qpp.cgp.domain.product.scope.ConfigurableProductScope',
                                fieldLabel: i18n.getKey('产品编号'),
                                diyGetValue: function () {
                                    var me = this;
                                    if (me.attributeVersionId) {
                                        return {
                                            _id: me._id,
                                            productId: me.productId,
                                            clazz: me.clazz,
                                            versionedProductAttribute: {
                                                clazz: "com.qpp.cgp.domain.product.attribute.VersionedProductAttribute",
                                                _id: me.attributeVersionId
                                            }
                                        }
                                    } else {
                                        return {
                                            _id: me._id,
                                            productId: me.productId,
                                            clazz: me.clazz,
                                        }
                                    }

                                },
                                diySetValue: function (data) {
                                    var me = this;
                                    me.productId = data.productId;
                                    me.clazz = data.clazz;
                                    me._id = data._id
                                    productId = data.productId;
                                    me.setValue(data.productId);
                                }
                            },
                            {
                                xtype: 'textfield',
                                name: 'manufacture',
                                manufactureId: null,
                                hidden: true,
                                clazz: 'com.qpp.cgp.domain.partner.cooperation.manufacture.Manufacture',
                                fieldLabel: i18n.getKey('manufacture'),
                                diyGetValue: function () {
                                    var me = this;
                                    return {
                                        _id: me.manufactureId,
                                        clazz: me.clazz,
                                    }
                                },
                                diySetValue: function (data) {
                                    var me = this;
                                    me.manufactureId = data._id;
                                    me.clazz = data.clazz;
                                    me.setValue(data._id);
                                }
                            },
                            {
                                xtype: 'combo',
                                name: 'status',
                                itemId: 'status',
                                editable: false,
                                fieldLabel: i18n.getKey('配置状态'),
                                value: 'RELEASE',
                                store: {
                                    xtype: 'store',
                                    fields: ['value', 'key'],
                                    data: [
                                        {
                                            key: 'RELEASE',
                                            value: '上线',
                                        },
                                        {
                                            key: 'TEST',
                                            value: '下线',
                                        },
                                        {
                                            key: 'DRAFT',
                                            value: '草稿',
                                        },
                                    ]
                                },
                                displayField: 'value',
                                valueField: 'key',
                            },
                        ]
                    },
                    { //已完成
                        xtype: 'attribute_mapping',
                        name: 'manufactureProduct',
                        itemId: 'manufactureProduct',
                        hidden: false,
                        version: me.version,
                        attributeVersionId: me.attributeVersionId,
                        title: i18n.getKey('属性映射'),

                    },
                    {
                        xtype: me.version == 'v1' ? 'product_PMVT_mapping' : 'product_PMVT_mapping_v2',
                        title: i18n.getKey('定制面映射'),
                        version: me.version,
                        productId: me.productId,
                        attributeVersionId: me.attributeVersionId,
                        name: me.version == 'v1' ? 'pmvtMapping' : 'pmvtMappingV2',
                        margin: '0 0 15 10',
                    },

                ],
                bbar: ['->',
                    {
                        xtype: 'button',
                        iconCls: "icon_save",
                        text: i18n.getKey('confirm'),
                        handler: function (btn) {
                            var form = btn.ownerCt.ownerCt;
                            var win = form.ownerCt;
                            var formValue = form.diyGetValue();
                            var container = form.getComponent('container');
                            var statusComp = container.getComponent('status');
                            var status = statusComp.getValue();
                            var url = adminPath + 'api/productofmanufactures/' + id;
                            if (status === 'DRAFT' ? container.isValid() : form.isValid()) {
                                JSSetLoading(true);
                                JSAjaxRequest(url, 'PUT', false, formValue, null, function (require, success, response) {
                                    if (success) {
                                        var responseText = Ext.JSON.decode(response.responseText);
                                        if (responseText.success) {
                                            JSSetLoading(false);
                                            me.parentStore.load();
                                            win.close();
                                        }
                                    }
                                }, true);
                            }
                        }
                    },
                    {
                        xtype: 'button',
                        iconCls: "icon_cancel",
                        text: i18n.getKey('cancel'),
                        handler: function (btn) {
                            var win = btn.ownerCt.ownerCt.ownerCt;
                            win.close();
                        }
                    },
                ]
            },
        ]
        me.callParent();
        var form = me.getComponent('form');
        var manufactureProduct = form.getComponent('manufactureProduct');
        manufactureProduct.setVisible(!sku)
    }
})