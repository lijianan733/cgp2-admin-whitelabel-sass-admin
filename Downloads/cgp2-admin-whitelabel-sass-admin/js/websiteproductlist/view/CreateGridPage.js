/**
 * @author xiu
 * @date 2025/7/30
 */
Ext.define('CGP.websiteproductlist.view.CreateGridPage', {
    extend: 'Ext.ux.ui.GridPage',
    alias: 'widget.createGridPage',
    store: null,
    block: 'websiteproductlist',
    editPage: 'edit.html',
    i18nblock: i18n.getKey('websiteproductlist'),
    initComponent: function () {
        var me = this,
            controller = Ext.create('CGP.websiteproductlist.controller.Controller'),
            defaults = Ext.create('CGP.websiteproductlist.defaults.WebsiteproductlistDefaults');

        me.config = {
            block: me.block,
            tbarCfg: {
                hidden: true,
                hiddenButtons: ['read', 'clear', 'delete', 'config', 'help', 'export', 'import'],
                btnCreate: {
                    handler: function () {
                        JSOpen({
                            id: me.block + me.editSuffix,
                            url: path + "partials/" + me.block + "/" + me.editPage,
                            title: me.pageText.create + '_' + me.i18nblock,
                            refresh: true
                        });
                    }
                },
            },
            gridCfg: {
                editAction: false,
                deleteAction: false,
                selModel: {
                    mode: 'SINGLE'
                },
                store: me.store,
                customPaging: [
                    {value: 25},
                    {value: 50},
                    {value: 75},
                    {value: 100}
                ],
                plugins: [{
                    ptype: 'rowexpander',
                    rowBodyTpl: new Ext.XTemplate(
                        '<div  style="width: 100%" id="log-{id}" ></div>'
                    )
                }],
                viewConfig: {
                    listeners: {
                        expandbody: function (tr, record, selector, event) {
                            var raw = record.raw,
                                productId = record.getId(),
                                isShowVersion = controller.getVersionDataIsShow(productId),
                                dom = document.getElementById('log-' + raw.id);

                            JSSetLoading(true);
                            if (Ext.isEmpty(dom.innerHTML)) {
                                if (isShowVersion) {
                                    setTimeout(function () {
                                        Ext.create('CGP.websiteproductlist.view.CreateProductVersionGrid', {
                                            renderTo: 'log-' + raw.id,
                                            width: 1600,
                                            productId: productId,
                                            id: 'log-' + raw.id + '-grid',
                                            margin: '5 5 5 60',
                                            listeners: {
                                                el: {
                                                    dblclick: function (event) {
                                                        event.stopEvent();
                                                    }
                                                }
                                            }
                                        });
                                        JSSetLoading(false);
                                    }, 250);
                                } else {
                                    Ext.create('Ext.form.field.Display', {
                                        width: 200,
                                        renderTo: 'log-' + raw.id,
                                        id: 'log-not',
                                        margin: '5 5 5 180',
                                        itemId: 'browseImage',
                                        value: '无(非草稿状态)属性版本',
                                    })
                                    JSSetLoading(false);
                                }
                            } else {
                                JSSetLoading(false);
                            }
                        }
                    },
                },
                columnDefaults: {
                    align: 'center',
                },
                columns: [
                    {
                        text: i18n.getKey('操作'),
                        sortable: false,
                        width: 250,
                        autoSizeColumn: false,
                        xtype: 'componentcolumn',
                        renderer: function (value, metadata, record, row, col, store) {
                            var isActived = record.get('isActived'),
                                isRelease = record.get('isRelease'),
                                productId = record.get('id'),
                                version = record.get('version'),
                                settingId = record.get('settingId'),
                                type = record.get('type'),
                                clazz = record.get('clazz'),
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
                                                    isReadOnly
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
                                                    controller.checkVersionHistoryWin(productId);
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
                                productDefaultSettingForStore = record.get('productDefaultSettingForStore'),
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

                            valueGather[!!value].forEach(item => {
                                var {color, text} = item;
                                result.push(JSCreateFont(color, true, text, 15));
                            })

                            var showText = isActived ? `${result.join(', ')} 生效` : '草稿';
                            return productDefaultSettingForStore ? showText : '';
                        }
                    },
                    {
                        text: i18n.getKey('产品编号'),
                        autoSizeColumn: false,
                        width: 150,
                        dataIndex: 'id',
                        renderer: function (value, metadata, record) {
                            var mode = record.get('mode'),
                                modeResource = {'TEST': '测试', 'RELEASE': '正式'};
                            return value + '<' + '<text style="color: red">' + modeResource[mode] + '</text>' + '>';
                        }
                    },
                    {
                        text: i18n.getKey('config') + i18n.getKey('type'),
                        dataIndex: 'type',
                        width: 150,
                        sortable: false,
                        renderer: function (value, metadata, record) {
                            metadata.tdAttr = "data-qtip='" + value + "'";
                            return value;
                        }
                    },
                    {
                        text: i18n.getKey('name'),
                        dataIndex: 'name',
                        width: 250,
                        renderer: function (value, metadata) {
                            metadata.tdAttr = "data-qtip='" + value + "'";
                            return value;
                        }
                    },
                    {
                        text: i18n.getKey('model'),
                        dataIndex: 'model',
                        width: 250,
                        renderer: function (value, metadata) {
                            metadata.tdAttr = "data-qtip='" + value + "'";
                            return value;
                        }
                    },
                    {
                        text: i18n.getKey('enabledDate'),
                        dataIndex: 'dateAvailable',
                        width: 250,
                        renderer: function (value) {
                            return Ext.Date.format(new Date(+value), 'Y-m-d');
                        }
                    },
                    {
                        text: i18n.getKey('configurableProductId'),
                        dataIndex: 'configurableProductId',
                        minWidth: 150,
                        flex: 1,
                    },
                ]
            },
            filterCfg: {
                items: [
                    {
                        id: 'idSearcher',
                        name: 'id',
                        xtype: 'numberfield',
                        hideTrigger: true,
                        fieldLabel: i18n.getKey('id'),
                        itemId: 'id'
                    },
                    {
                        xtype: 'combo',
                        id: 'typeSearcher',
                        name: 'type',
                        fieldLabel: i18n.getKey('config') + i18n.getKey('type'),
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
                        id: 'skuConfigurableProductId',
                        name: 'configurableProduct.id',
                        xtype: 'numberfield',
                        itemId: 'configurableProductId',
                        fieldLabel: i18n.getKey('configurableProductId')
                    }
                ]
            }
        }
        me.callParent();
    },
    constructor: function (config) {
        var me = this;
        me.initConfig(config);
        me.callParent([config]);
    },
})