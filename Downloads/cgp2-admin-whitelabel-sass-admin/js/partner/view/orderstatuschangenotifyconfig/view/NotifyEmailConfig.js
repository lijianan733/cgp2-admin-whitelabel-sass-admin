/**
 * Created by nan on 2018/6/15.
 */
Ext.define('CGP.partner.view.orderstatuschangenotifyconfig.view.NotifyEmailConfig', {
    extend: 'Ext.grid.Panel',
    viewConfig: {
        enableTextSelection: true
    },
    initComponent: function () {
        var me = this;
        var controller = me.controller;
        me.store = Ext.create('Ext.data.Store', {
            model: 'CGP.partner.view.orderstatuschangenotifyconfig.model.NotifyEmailConfigModel',
            autoSync: true,
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
                    var controller = Ext.create('CGP.partner.view.orderstatuschangenotifyconfig.controller.Controller');
                    controller.editNotifyEmailConfig('create', store, me.outTab, null, 'manager');
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
                            var type = record.get('type');
                            controller.editNotifyEmailConfig('edit', store, me.outTab, record, type);
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
                text: i18n.getKey('notifyEmailConfig'),
                dataIndex: 'notifyTemplates',
                width: 250,
                itemId: 'notifyEmailConfig',
                xtype: "componentcolumn",
                renderer: function (value, metadata, record) {
                    return {
                        xtype: 'displayfield',
                        value: '<a href="#")>' + i18n.getKey('check') + i18n.getKey('notifyEmailConfig') + '</a>',
                        listeners: {
                            render: function (display) {
                                var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                var ela = Ext.fly(a); //获取到a元素的element封装对象
                                var type = record.get('type');
                                ela.on("click", function () {
                                    var controller = Ext.create('CGP.partner.view.orderstatuschangenotifyconfig.controller.Controller');
                                    if (type == 'manager') {
                                        controller.showServerMailTemplateConfigDetail(record.getData());
                                    } else {
                                        controller.showCustomerMailTemplateConfigDetail(record.getData());
                                    }
                                });
                            }
                        }
                    }

                }
            }
        ];
        me.listeners = {
            'afterrender': function (view) {
                var me = this;
                var restHttpRequestConfigs = view.getComponent('restHttpRequestConfigs');
                var record = null;
                if (me.createOrEdit == 'edit') {
                    CGP.partner.view.orderstatuschangenotifyconfig.model.OrderStatusChangeNotifyConfigModel.getProxy();
                    CGP.partner.view.orderstatuschangenotifyconfig.model.OrderStatusChangeNotifyConfigModel.proxy.url = adminPath + 'api/partners/' + me.partnerId + '/orderStatusChangeNotifyConfigs/';
                    CGP.partner.view.orderstatuschangenotifyconfig.model.OrderStatusChangeNotifyConfigModel.load(me.recordId, {
                        scope: this,
                        failure: function (record, operation) {
                        },
                        success: function (record, operation) {
                            me.record = record;
                            me.recordData = record.getData();
                            var emailConfigsArray = me.emailConfigsArray = [];
                            var notifyTemplates = record.get('notifyTemplates');
                            for (var i = 0; i < notifyTemplates.length; i++) {//在配置数组中抽出邮件配置和rest请求配置
                                if (notifyTemplates[i].clazz == 'com.qpp.cgp.domain.partner.order.config.EmailNotifyTemplate') {
                                    notifyTemplates[i].mailTemplateConfig.enable = notifyTemplates[i].enable;
                                    notifyTemplates[i].mailTemplateConfig.name = notifyTemplates[i].name;
                                    notifyTemplates[i].mailTemplateConfig.type = notifyTemplates[i].type;
                                    notifyTemplates[i].mailTemplateConfig.description = notifyTemplates[i].description;
                                    emailConfigsArray.push(notifyTemplates[i].mailTemplateConfig);
                                }
                            }
                            me.store.loadData(emailConfigsArray);
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
