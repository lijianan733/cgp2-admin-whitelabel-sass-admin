/**
 * @Description:
 * @author nan
 * @date 2023/9/6
 */
Ext.Loader.syncRequire([
    'CGP.cmslog.view.PublishCmsConfigConfirmWin',
    'CGP.websiteproductlist.store.ProductVersionStore'
])
Ext.define('CGP.websiteproductlist.view.CreateProductVersionGrid', {
    extend: 'Ext.grid.Panel',
    productId: null,
    autoScroll: true,
    initComponent: function () {
        var me = this,
            controller = Ext.create('CGP.websiteproductlist.controller.Controller');

        me.store = Ext.create('CGP.websiteproductlist.store.ProductVersionStore', {
            params: {
                filter: Ext.JSON.encode([
                    {
                        name: "product._id",
                        value: me.productId,
                        type: "number"
                    },
                    {
                        name: 'status',
                        value: 'DRAFT',
                        type: 'string',
                        operator: 'ne',
                    },
                ])
            },
        });
        me.columns = {
            defaults: {
                menuDisabled: true,
                sortable: false,
                width: 120
            },
            items: [
                {
                    xtype: 'rownumberer',
                    tdCls: 'vertical-middle',
                    width: 60
                },
                {
                    text: i18n.getKey('operation'),
                    sortable: false,
                    width: 250,
                    autoSizeColumn: false,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record, row, col, store) {
                        var isActived = record.get('isActived'),
                            isRelease = record.get('isRelease'),
                            product = record.get('product'),
                            productId = product?.id,
                            version = record.get('configVersion'),
                            settingId = record.get('settingId'),
                            type = product?.type,
                            clazz = product?.clazz,
                            versionedProductAttributeId = record.get('_id'),
                            productDefaultSettingForStore = record.get('productDefaultSettingForStore'),
                            configBtnText = productDefaultSettingForStore ? '编辑配置' : '新建配置',
                            isActivedBtnText = isActived ? '切换回草稿' : '生效',
                            isReleaseBtnText = isRelease ? '取消发布至release' : '发布至release'

                        return {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                align: 'center',
                                pack: 'center'
                            },
                            defaults: {
                                margin: '0 5 0 5'
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    text: i18n.getKey(configBtnText),
                                    handler: function () {
                                        var isReadOnly = true,
                                            params = {
                                                id: settingId,
                                                type,
                                                version,
                                                clazz,
                                                productId,
                                                isReadOnly,
                                                versionedProductAttributeId
                                            };

                                        controller.jumpOpenToEdit(params);
                                    }
                                },
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('其他操作'),
                                    menu: [
                                        {
                                            text: isReleaseBtnText,
                                            hidden: !isActived,
                                            handler: function () {
                                                controller.changePublishStatusWin(isRelease, productId, settingId, function () {
                                                    store.load();
                                                });
                                            }
                                        },
                                        {
                                            text: isActivedBtnText,
                                            hidden: !settingId,
                                            handler: function () {
                                                controller.changeStatusWin(isActived, productId, settingId, function () {
                                                    store.load();
                                                });
                                            }
                                        },
                                        {
                                            text: i18n.getKey('查看版本历史'),
                                            handler: function () {
                                                controller.checkVersionHistoryWin(productId, versionedProductAttributeId);
                                            }
                                        },
                                    ]
                                },
                            ]
                        }
                    }
                },
                {
                    text: i18n.getKey('发布状态'),
                    autoSizeColumn: false,
                    dataIndex: 'isRelease',
                    width: 200,
                    renderer: function (value, metadata, record) {
                        var isActived = record.get('isActived'),
                            result = [],
                            productDefaultSettingForStore = record.get('productDefaultSettingForStore'),
                            valueGather = {
                                false: [
                                    {
                                        color: 'orange',
                                        text: 'stage'
                                    },
                                ],
                                true: [
                                    {
                                        color: 'orange',
                                        text: 'stage'
                                    },
                                    {
                                        color: 'green',
                                        text: 'release'
                                    },
                                ],
                            };

                        valueGather[!!value].forEach(item => {
                            var {color, text} = item;
                            result.push(JSCreateFont(color, true, text, 15));
                        })

                        var showText = isActived ? `${result.join(', ')} 生效` : '草稿';
                        return productDefaultSettingForStore ? showText : '';
                    }
                },
                {
                    text: i18n.getKey('属性版本编号'),
                    width: 150,
                    dataIndex: '_id',
                    isLike: false,
                    sortable: true
                },
                {
                    text: i18n.getKey('status'),
                    dataIndex: 'status',
                    width: 100,
                    renderer: function (value, metadata, record) {
                        //'DRAFT', 'TEST', 'RELEASE'
                        if (value == 'DRAFT') {
                            return '<font color="orange" style="font-weight: bold">草稿</font>';
                        } else if (value == 'TEST') {
                            return '<font color="red" style="font-weight: bold">测试</font>';
                        } else if (value == 'RELEASE') {
                            return '<font color="green" style="font-weight: bold">上线</font>';
                        }
                    }
                },
                {
                    text: i18n.getKey('version'),
                    dataIndex: 'version',
                    width: 100,
                },
                {
                    text: i18n.getKey('remark'),
                    dataIndex: 'remark',
                    width: 250,
                },
                /*{
                    xtype: 'arraycolumn',
                    text: i18n.getKey('关联的Bom配置Id'),
                    dataIndex: 'bomCompatibilityIds',
                    width: 300,
                    sortable: false,
                    lineNumber: 5,
                },*/
            ]
        };
        me.bbar = {
            xtype: 'pagingtoolbar',
            store: me.store
        };
        me.callParent();
    }
})