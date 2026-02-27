/**
 * Created by nan on 2018/6/15.
 */
Ext.define('CGP.partner.view.supplierorderconfig.view.RestRequestConfig', {
    extend: 'Ext.grid.Panel',
    viewConfig: {
        enableTextSelection: true
    },
    recordId: null,
    initComponent: function () {
        var me = this;
        var controller = me.controller;
        var restHttpRequestConfigStore = me.store = Ext.create('Ext.data.Store', {
            model: 'CGP.partner.view.supplierorderconfig.model.RestHttpRequestConfigModel',
            autoSync: true,
            autoLoad: true,
            proxy: {
                type: 'memory',
                reader: {
                    type: 'array'
                }
            },
            data: []
        });
        me.tbar = [
            {
                xtype: 'button',
                iconCls: 'icon_save',
                text: i18n.getKey('save'),
                handler: function (view) {
                    controller.saveFormValue(view.ownerCt.ownerCt, me.partnerId, me.createOrEdit, me.recordId, me.recordData);
                }
            },
            {
                text: i18n.getKey('add') + i18n.getKey('config'),
                iconCls: 'icon_create',
                handler: function (view) {
                    var store = this.ownerCt.ownerCt.store;
                    var controller = Ext.create('CGP.partner.view.supplierorderconfig.controller.Controller');
                    controller.editRestHttpRequestConfig('create', store, me.outTab, null);
                }
            }
        ];
        me.columns = [
            {
                xtype: 'rownumberer',
                width: 50,
                sortable: true,
                tdCls: 'vertical-middle'

            },
            {
                xtype: 'actioncolumn',
                itemId: 'actioncolumn',
                width: 50,
                sortable: false,
                resizable: false,
                menuDisabled: true,
                tdCls: 'vertical-middle',
                items: [
                    {
                        iconCls: 'icon_edit icon_margin',
                        itemId: 'actionedit',
                        tooltip: 'Edit',
                        handler: function (view, rowIndex, colIndex) {
                            var store = view.getStore();
                            var record = store.getAt(rowIndex);
                            controller.editRestHttpRequestConfig('edit', store, me.outTab, record);
                        }
                    },
                    {
                        iconCls: 'icon_remove icon_margin',
                        itemId: 'actionremove',
                        tooltip: 'Remove',
                        handler: function (view, rowIndex, colIndex) {
                            var store = view.getStore();
                            var record = store.getAt(rowIndex);
                            Ext.Msg.confirm(i18n.getKey('prompt'), '是否确定删除？', function (id) {
                                if (id == 'yes') {
                                    store.remove(record);
                                }
                            })
                        }
                    }
                ]
            },
            {
                dataIndex: 'enable',
                itemId: 'enable',
                width: 80,
                tdCls: 'vertical-middle',
                xtype: 'componentcolumn',
                renderer: function (value, meta, record) {
                    return {
                        xtype: 'button',
                        itemId: JSGetUUID(),
                        text: value ? '禁用' : '启用',
                        handler: function (view) {
                            Ext.Msg.confirm(i18n.getKey('prompt'), '是否' + (value ? '禁用?' : '启用?'), function (select) {
                                if (select == 'yes') {
                                    record.set('enable', value ? false : true);
                                    view.setText(record.get('enable') ? '禁用' : '启用');
                                }
                            })
                        }
                    }
                }
            },
            {
                text: i18n.getKey('testOrNot'),
                dataIndex: 'isTest',
                itemId: 'isTest',
                sortable: true,
                width: 150,
                tdCls: 'vertical-middle',
                renderer: function (value, meta, record) {
                    return i18n.getKey(value)
                }
            },

            {
                text: i18n.getKey('name'),
                dataIndex: 'name',
                itemId: 'name',
                sortable: true,
                width: 150,
                tdCls: 'vertical-middle'
            },
            {
                text: i18n.getKey('notify') + i18n.getKey('type'),
                dataIndex: 'type',
                itemId: 'type',
                sortable: true,
                width: 150,
                tdCls: 'vertical-middle',
                renderer: function (value, meta, record) {
                    if (value == 'customer') {
                        return i18n.getKey('customer');
                    } else {
                        return i18n.getKey('admin');
                    }
                }
            },
            {
                text: i18n.getKey('description'),
                dataIndex: 'description',
                itemId: 'description',
                sortable: true,
                width: 150,
                tdCls: 'vertical-middle'
            },

            {
                text: i18n.getKey('url'),
                dataIndex: 'url',
                itemId: 'url',
                sortable: true,
                width: 150,
                tdCls: 'vertical-middle'
            },
            {
                text: i18n.getKey('method'),
                dataIndex: 'method',
                itemId: 'method',
                sortable: true,
                width: 150,
                tdCls: 'vertical-middle'
            },
            {
                text: i18n.getKey('headers'),
                dataIndex: 'headers',
                itemId: 'headers',
                width: 150,
                tdCls: 'vertical-middle',
                renderer: function (value, mater) {
                    var str = ''
                    for (var i in value) {
                        str += i + ' : ' + value[i] + '<br>'
                    }
                    mater.tdAttr = 'data-qtip="' + str + '"';
                    return str;
                }
            },
            {
                text: i18n.getKey('body'),
                dataIndex: 'body',
                itemId: 'body',
                sortable: true,
                width: 150,
                renderer: function (value, mater) {
                    mater.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                },
                tdCls: 'vertical-middle'
            },
            {
                text: i18n.getKey('queryParameters'),
                dataIndex: 'queryParameters',
                itemId: 'queryParameters',
                tdCls: 'vertical-middle',
                width: 150,
                renderer: function (value, mater) {
                    var str = ''
                    for (var i in value) {
                        str += i + ' : ' + value[i] + '<br>'
                    }
                    mater.tdAttr = 'data-qtip="' + str + '"';
                    return str;
                }
            },
            {
                text: i18n.getKey('successPath'),
                dataIndex: 'successPath',
                itemId: 'successPath',
                width: 150,
                sortable: true,
                renderer: function (value, mater) {
                    mater.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                },
                tdCls: 'vertical-middle'
            },
            {
                text: i18n.getKey('successKey'),
                dataIndex: 'successKey',
                itemId: 'successKey',
                sortable: true,
                width: 150,
                renderer: function (value, mater) {
                    mater.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                },
                tdCls: 'vertical-middle'
            },
            {
                text: i18n.getKey('errorMessagePath'),
                dataIndex: 'errorMessagePath',
                width: 150,
                itemId: 'errorMessagePath',
                sortable: true,
                renderer: function (value, mater) {
                    mater.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                },
                tdCls: 'vertical-middle'
            }
        ];
        me.listeners = {
            'afterrender': function (view) {
                var me = this;
                if (me.createOrEdit == 'edit') {
                    CGP.partner.view.supplierorderconfig.model.OrderStatusChangeNotifyConfigModel.getProxy();
                    CGP.partner.view.supplierorderconfig.model.OrderStatusChangeNotifyConfigModel.proxy.url = adminPath + 'api/producers/' + me.partnerId + '/allotOrderNotifyConfigs';
                    CGP.partner.view.supplierorderconfig.model.OrderStatusChangeNotifyConfigModel.load(me.recordId, {
                        scope: this,
                        failure: function (record, operation) {
                        },
                        success: function (record, operation) {
                            me.record = record;
                            if (Ext.isEmpty(record.getId())) {
                                //默认进入的是编辑状态，如果获取到的记录没有id,说明不存在该记录，故为新建
                                me.createOrEdit = 'create';
                            } else {
                                me.recordId = record.getId();
                            }
                            me.recordData = record.getData();
                            var restHttpRequestConfigsArray = me.restHttpRequestConfigsArray = [];
                            var notifyTemplates = record.get('notifyTemplates');
                            for (var i = 0; i < notifyTemplates.length; i++) {//在配置数组中抽出邮件配置和rest请求配置
                                if (notifyTemplates[i].clazz == 'com.qpp.cgp.domain.partner.order.config.ApiNotifyTemplate') {
                                    notifyTemplates[i].apiNotifyTemplateConfig.restHttpRequestConfig.enable = notifyTemplates[i].enable;
                                    notifyTemplates[i].apiNotifyTemplateConfig.restHttpRequestConfig.isTest = notifyTemplates[i].apiNotifyTemplateConfig.isTest;
                                    notifyTemplates[i].apiNotifyTemplateConfig.restHttpRequestConfig.name = notifyTemplates[i].name;
                                    notifyTemplates[i].apiNotifyTemplateConfig.restHttpRequestConfig.type = notifyTemplates[i].type;
                                    notifyTemplates[i].apiNotifyTemplateConfig.restHttpRequestConfig.description = notifyTemplates[i].description;
                                    restHttpRequestConfigsArray.push(notifyTemplates[i].apiNotifyTemplateConfig.restHttpRequestConfig);
                                }
                            }
                            me.store.loadData(restHttpRequestConfigsArray);
                        },
                        callback: function (record, operation) {
                        }
                    })
                }
            }
        };
        me.callParent(arguments);
    }
})
