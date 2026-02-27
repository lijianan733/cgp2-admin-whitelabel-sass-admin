/**
 * @author xiu
 * @date 2025/7/30
 */
Ext.Loader.syncRequire([
    'CGP.websiteproductlist.view.CreateDefaultsConfig',
    'CGP.websiteproductlist.view.CreateStoreConfig'
])
Ext.define('CGP.websiteproductlist.view.CreateEditPage', {
    extend: 'Ext.ux.ui.EditPage',
    alias: 'widget.createEditPage',
    block: 'websiteproductlist',
    gridPage: 'main.html',
    initComponent: function () {
        var me = this,
            id = JSGetQueryString('_id'),
            type = JSGetQueryString('type'),
            clazz = JSGetQueryString('clazz'),
            productId = JSGetQueryString('productId'),
            upVersionId = JSGetQueryString('upVersionId'),
            isHistory = JSGetQueryString('isHistory') === 'true',
            isUpVersion = JSGetQueryString('isUpVersion') === 'true',
            versionedProductAttributeId = JSGetQueryString('versionedProductAttributeId'),
            // isReadOnly = JSGetQueryString('isReadOnly') === 'true',
            controller = Ext.create('CGP.websiteproductlist.controller.Controller'),
            defaults = Ext.create('CGP.websiteproductlist.defaults.WebsiteproductlistDefaults'),
            isEdit = !!id && !['null', 'undefined'].includes(id),
            queryData = controller.getWebsiteProductItemData(productId, id, isUpVersion, upVersionId),
            isActived = queryData?.isActived,
            isRelease = queryData?.isRelease,
            version = queryData?.version,
            isReadOnly = isActived,
            isActivedBtnText = isActived ? '切换回草稿' : '生效';


        me.config = {
            block: me.block,
            tbarCfg: {
                hiddenButtons: ['copy'],
                btnCreate: {
                    text: '升级版本',
                    iconCls: 'icon_up',
                    hidden: !isActived || isHistory,
                    handler: function () {
                        var newVersion = version + 1,
                            isUpVersion = true,
                            params = {
                                upVersionId: id,
                                type,
                                clazz,
                                version: newVersion,
                                isUpVersion,
                                productId,
                                versionedProductAttributeId,
                                isReadOnly
                            };

                        controller.jumpOpenToEdit(params);
                    }
                },
                btnSave: {
                    text: '保存',
                    width: 100,
                    hidden: isActived || isHistory,
                    handler: function (btn) {
                        var result = me.diyGetValue();
                        controller.upDataDefaultConfigDataHandler(productId, id, result, function (data) {
                            var {_id, version, isRelease, isActived} = data,
                                isReadOnly = isActived,
                                params = {
                                    id: _id,
                                    type,
                                    clazz,
                                    version,
                                    productId,
                                    versionedProductAttributeId,
                                    isReadOnly
                                };

                            // 如果是升级版本
                            if (isUpVersion) {
                                var storeConfigData = controller.getStoreConfigData(upVersionId, productId);
                                storeConfigData.forEach((item) => {
                                    controller.upDataStoreConfigDataHandler(_id, null, item);
                                })
                            }

                            setTimeout(item => {
                                controller.jumpOpenToEdit(params);
                            }, 2000)
                        })
                    }
                },
                btnReset: {
                    text: isActivedBtnText,
                    iconCls: 'icon_agree',
                    hidden: !isEdit || isHistory,
                    width: 100,
                    handler: function () {
                        var params = {
                            id,
                            type,
                            clazz,
                            version,
                            productId,
                            versionedProductAttributeId,
                            isReadOnly,
                        };

                        controller.changeStatusWin(isActived, productId, id, function (result) {
                            controller.jumpOpenToEdit(params);
                        });
                    }
                },
                btnGrid: {
                    text: '返回列表',
                    handler: function () {
                        JSOpen({
                            id: me.block + 'page',
                            url: path + 'partials/' + me.block + '/' + me.gridPage
                        })
                    }
                },
                btnConfig: {
                    text: '取消发布至release',
                    disabled: false,
                    iconCls: 'icon_cancel',
                    // hidden: !isRelease,
                    hidden: true,
                    handler: function () {
                        var params = {
                            id,
                            type,
                            clazz,
                            version,
                            productId,
                            versionedProductAttributeId,
                            isReadOnly,
                        };

                        controller.changePublishStatusWin(true, id, function (result) {
                            controller.jumpOpenToEdit(params);
                        });
                    }
                },
                btnHelp: {
                    text: '查看版本历史',
                    iconCls: 'icon_check',
                    handler: function () {
                        controller.checkVersionHistoryWin(productId, versionedProductAttributeId);
                    }
                },
            },
            formCfg: {
                model: 'CGP.websiteproductlist.model.WebsiteproductlistModel',
                remoteCfg: false,
                layout: 'vbox',
                fieldDefaults: {
                    isFormField: true,
                },
                items: [
                    {
                        xtype: 'textfield',
                        name: 'id',
                        itemId: 'id',
                        hidden: true,
                        fieldLabel: i18n.getKey('id'),
                    },
                    {
                        xtype: 'textfield',
                        name: 'clazz',
                        itemId: 'clazz',
                        hidden: true,
                        fieldLabel: i18n.getKey('clazz'),
                        diyGetValue: function () {
                            return 'com.qpp.cgp.domain.product.config.ProductDefaultSettingForStore'
                        },
                    },
                    {
                        xtype: 'booleancombo',
                        name: 'isActived',
                        itemId: 'isActived',
                        hidden: true,
                        fieldLabel: i18n.getKey('isActived'),
                    },
                    {
                        xtype: 'booleancombo',
                        name: 'product',
                        itemId: 'product',
                        rowData: null,
                        hidden: true,
                        fieldLabel: i18n.getKey('product'),
                        diyGetValue: function () {
                            return {
                                id: productId,
                                type: type,
                                clazz: clazz
                            }
                        },
                    },
                    {
                        xtype: 'booleancombo',
                        name: 'attributeVersion',
                        itemId: 'attributeVersion',
                        fieldLabel: i18n.getKey('attributeVersion'),
                        hidden: true,
                        diySetValue: function (data) {
                            if (!Ext.Object.isEmpty(data)) {
                                var me = this,
                                    {clazz, id} = data;

                                me.rowData = {clazz, id}
                            }
                        },
                        diyGetValue: function () {
                            var me = this;

                            return me.rowData;
                        },
                    },

                    {
                        xtype: 'checkboxgroup',
                        fieldLabel: i18n.getKey('应用到Release'),
                        name: 'isRelease',
                        readOnly: false,
                        itemId: isActived ? 'isRelease' : 'noReleased',
                        hidden: !isActived || isHistory,
                        isEnabledChange: false,
                        diySetValue: function (data) {
                            var me = this;

                            me.setValue({
                                isRelease: !!data
                            });
                        },
                        diyGetValue: function () {
                            var me = this,
                                {isRelease} = me.setValue();

                            return isRelease;
                        },
                        items: [
                            {
                                boxLabel: '是',
                                name: 'isRelease',
                                inputValue: true
                            },
                        ],
                        listeners: {
                            afterrender: function (comp) {
                                setTimeout(item => {
                                    comp.isEnabledChange = true;
                                }, 1000)
                            },
                            change: function (comp, value) {
                                var {isRelease} = value,
                                    params = {
                                        id,
                                        type,
                                        clazz,
                                        version,
                                        productId,
                                        versionedProductAttributeId,
                                        isReadOnly,
                                    };

                                if (comp.isEnabledChange) {
                                    controller.changePublishStatusWin(!isRelease, productId, id, function (result) {
                                            controller.jumpOpenToEdit(params);
                                        },
                                        function () {
                                            comp.isEnabledChange = false;
                                            comp.setValue({
                                                isRelease: !isRelease,
                                            })
                                            setTimeout(item => {
                                                comp.isEnabledChange = true;
                                            }, 1000)
                                        })
                                }
                            }
                        }
                    },
                    {
                        xtype: 'displayfield',
                        name: 'isRelease',
                        fieldLabel: i18n.getKey('应用环境'),
                        itemId: isActived ? 'noRelease' : 'isRelease',
                        hidden: !isHistory && isActived,
                        rowData: false,
                        diySetValue: function (data) {
                            var me = this,
                                result = [],
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

                            me.rowData = data;
                            valueGather[!!data].forEach(item => {
                                var {color, text} = item;
                                result.push(JSCreateFont(color, true, text, 15));
                            })

                            me.setValue(result.join(', '));
                        },
                        diyGetValue: function () {
                            var me = this;
                            return me.rowData;
                        },
                    },
                    {
                        xtype: 'displayfield',
                        name: 'isActived',
                        itemId: 'status',
                        rowData: true,
                        fieldLabel: i18n.getKey('发布状态'),
                        diySetValue: Ext.emptyFn,
                        diySetValue2: function (data) {
                            var me = this,
                                statusGather = {
                                    false: {
                                        color: 'orange',
                                        text: '草稿'
                                    },
                                    true: {
                                        color: 'green',
                                        text: '生效'
                                    },
                                },
                                {color, text} = statusGather[!!data];

                            me.rowData = data;

                            me.setValue(JSCreateFont(color, true, text, 15));
                        },
                        diyGetValue: function () {
                            var me = this;
                            return me.rowData;
                        },
                        listeners: {
                            afterrender: function (comp) {
                                comp.diySetValue2(isActived);
                            }
                        }
                    },
                    {
                        xtype: 'displayfield',
                        name: 'version',
                        itemId: 'version',
                        fieldLabel: i18n.getKey('版本'),
                        rowData: 0,
                        diySetValue: function (data) {
                            var me = this;

                            me.rowData = data;

                            me.setValue(JSCreateFont('#000', true, data, 15));
                        },
                        diyGetValue: function () {
                            var me = this;
                            return me.rowData;
                        },
                    },
                    {
                        xtype: 'defaults_config',
                        width: '100%',
                        margin: '0 5 0 5',
                        readOnly: isReadOnly,
                        name: 'defaultDetailSetting',
                        itemId: 'defaultDetailSetting',
                    },

                ]
            },
        }
        me.callParent();

        me.on('afterrender', function (comp) {
            var form = me.getComponent('form');
            me.diySetValue(queryData);
            if (isEdit || isUpVersion) {
                form.add({
                    xtype: 'store_config',
                    width: '100%',
                    margin: '0 5 0 5',
                    // hidden: !isEdit,
                    readOnly: isUpVersion || isReadOnly,
                    isFormField: false,
                    settingId: isUpVersion ? upVersionId : id,
                    itemId: 'storeConfig',
                })
            }
        })
    },
    diySetValue: function (data) {
        if (data) {
            var me = this,
                form = me.getComponent('form'),
                items = form.items.items

            items.forEach(item => {
                var {itemId, isFormField} = item;
                if (isFormField) {
                    item.diySetValue ? item.diySetValue(data[itemId]) : item.setValue(data[itemId]);
                }
            });
        }
    },
    diyGetValue: function () {
        var me = this,
            form = me.getComponent('form'),
            items = form.items.items,
            result = {};

        items.forEach(item => {
            var {itemId, isFormField} = item;
            if (isFormField) {
                result[itemId] = item.diyGetValue ? item.diyGetValue() : item.getValue()
            }
        });
        return result;
    },
    constructor: function (config) {
        var me = this;
        me.initConfig(config);
        me.callParent([config]);
    },
})