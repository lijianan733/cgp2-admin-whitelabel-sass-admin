/**
 * ProductcatalogForm
 * @Author: miao
 * @Date: 2022/5/12
 */
Ext.define("CGP.productcatalog.view.ProductCatalogForm", {
    extend: "Ext.ux.form.ErrorStrickForm",
    alias: 'widget.productcatalogform',
    isValidForItems: true,
    requires: ["CGP.common.field.TemplateUpload"],
    border: 0,
    data: null,
    defaults: {
        width: 400,
        margin: '5 25'
    },
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'textarea',
                itemId: 'description',
                name: 'description',
                fieldLabel: i18n.getKey('description'),
                allowBlank: true
            },
            {
                xtype: 'numberfield',
                itemId: 'priority',
                name: 'priority',
                fieldLabel: i18n.getKey('priority'),
                allowBlank: true
            },
            {
                xtype: 'fileuploadv2',
                name: 'productImage',
                fieldLabel: i18n.getKey('product') + i18n.getKey('image'),
                itemId: 'productImage',
                allowBlank: false,
                height: 90,
                valueUrlType: 'object',//完整路径 full, 部分路径 part, 文件信息 object,
                diyGetValue: function () {
                    var me = this;
                    var data = me.getValue();
                    if (data) {
                        return data;
                    } else {
                        return null;
                    }
                },
                diySetValue: function (data) {
                    var me = this;
                    if (data) {
                        me.rawData = data;
                        me.setValue(data);
                    }
                },
                extraButton: [
                    {
                        xtype: 'button',
                        margin: '0 0 5 5',
                        width: 60,
                        itemId: 'selProductImage',
                        text: i18n.getKey('选产品图'),
                        handler: function (btn) {
                            var data = me.data,
                                productId = data?.product?.id,
                                controller = Ext.create('CGP.cmsconfig.controller.Controller'),
                                fileuploadv2 = btn.ownerCt.ownerCt,
                                queryData = controller.getCmsConfigsProductImage(productId),
                                store = Ext.create('Ext.data.Store', {
                                    fields: [
                                        {
                                            name: '_id',
                                            type: 'string',
                                        },
                                        {
                                            name: 'pageTitle',
                                            type: 'string',
                                        },
                                        {
                                            name: 'small',
                                            type: 'object'
                                        },
                                        {
                                            name: 'large',
                                            type: 'object'
                                        },
                                        {
                                            name: 'title',
                                            type: 'string'
                                        },
                                        {
                                            name: 'alt',
                                            type: 'string'
                                        },
                                    ],
                                    pageSize: 10000,
                                    autoLoad: true,
                                    proxy: {
                                        type: 'memory'
                                    },
                                    groupField: '_id',
                                    data: queryData || []
                                });

                            controller.createSelProductImageWin(true,store, function (record) {
                                fileuploadv2.diySetValue(record.get('large'));
                            });
                        }
                    },
                ]
            },
            {
                xtype: 'fileuploadv2',
                name: 'hoverImage',
                itemId: 'hoverImage',
                fieldLabel: i18n.getKey('产品hover图'),
                allowFileType: ['image/*'],
                allowBlank: true,
                editable: true,
                isShowImage: true,        //是否显示预览图
                height: 90,
                valueUrlType: 'object',   //完整路径 full, 部分路径 part, 文件信息 object
                diyGetValue: function () {
                    var me = this;
                    var filePath = me.getComponent('filePath');
                    var fileName = filePath.getValue();
                    if (fileName) {
                        return me.rawData;
                    } else {
                        return null;
                    }
                },
                diySetValue: function (data) {
                    var me = this;
                    if (data) {
                        me.rawData = data;
                        me.setValue(data);
                    }
                },
                extraButton: [
                    {
                        xtype: 'button',
                        margin: '0 0 5 5',
                        width: 60,
                        itemId: 'selProductImage',
                        text: i18n.getKey('选产品图'),
                        handler: function (btn) {
                            var data = me.data,
                                productId = data?.product?.id,
                                fileUpLoadV2 = btn.ownerCt.ownerCt,
                                controller = Ext.create('CGP.cmsconfig.controller.Controller'),
                                queryData = controller.getCmsConfigsProductImage(productId),
                                store = Ext.create('Ext.data.Store', {
                                    fields: [
                                        {
                                            name: '_id',
                                            type: 'string',
                                        },
                                        {
                                            name: 'pageTitle',
                                            type: 'string',
                                        },
                                        {
                                            name: 'small',
                                            type: 'object'
                                        },
                                        {
                                            name: 'large',
                                            type: 'object'
                                        },
                                        {
                                            name: 'title',
                                            type: 'string'
                                        },
                                        {
                                            name: 'alt',
                                            type: 'string'
                                        },
                                    ],
                                    pageSize: 10000,
                                    autoLoad: true,
                                    proxy: {
                                        type: 'memory'
                                    },
                                    groupField: '_id',
                                    data: queryData || []
                                });
                            
                            controller.createSelProductImageWin(true,store, function (record) {
                                fileUpLoadV2.diySetValue(record.get('large'));
                            });
                        }
                    },
                ]
            },
        ];
        me.callParent(arguments);
    },
    listeners: {
        afterRender: function (comp) {
            if (comp.data) {
                comp.setValue(comp.data);
            }
        }
    },
});