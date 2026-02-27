/**
 * Created by nan on 2018/6/15.
 */
Ext.define('CGP.partner.view.orderstatuschangenotifyconfig.view.BaseInfoConfig', {
    extend: 'Ext.ux.form.Panel',
    autoScroll: true,
    frame: false,
    border: false,
    layout: 'vbox',
    createForm: function () {
        var me = this,
            cfg = {},
            props = me.basicFormConfigs,
            len = props.length,
            i = 0,
            prop;
        for (; i < len; ++i) {
            prop = props[i];
            cfg[prop] = me[prop];
        }
        var model = [];
        if (Ext.isString(me.model))
            model.push(me.model);
        else if (Ext.isArray(me.model))
            model = me.model;
        cfg.model = model;
        cfg.isValid = function () {
            this.owner.msgPanel.hide();
            var isValid = true;
            var errors = {};
            var postStatusId = this.owner.getComponent('postStatusId');
            isValid = Ext.isEmpty(postStatusId.getValue()) ? false : true;
            errors[postStatusId.getFieldLabel()] = '必须为某一已确定状态';
            if (isValid == false) {
                this.owner.outTab.setActiveTab(this.owner);
                this.showErrors(errors);
            }
            return isValid;
        }
        return new Ext.ux.form.Basic(me, cfg);
    },
    defaults: {
        margin: '10 0 0 20'
    },
    constructor: function (config) {
        var me = this;
        var controller = config.controller;
        var orderStatusStore = Ext.create('CGP.common.store.OrderStatuses', {
            postStatusId: null,
            preStatusId: null,
            allowNull:false,
        });
        orderStatusStore.on('load', function () {
            this.insert(0, {
                id: null,
                name: i18n.getKey('defaultStatus')
            });
        });
        var applyConfig = Ext.merge({
            tbar: [
                {
                    xtype: 'button',
                    iconCls: 'icon_save',
                    text: i18n.getKey('save'),
                    handler: function (view) {
                        var form = view.ownerCt.ownerCt;
                        controller.saveFormValue(view.ownerCt.ownerCt, form.partnerId, form.createOrEdit, form.recordId, form.recordData);
                    }
                }
            ],
            items: [
                {
                    name: 'preStatusId',
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('fromStatus'),
                    itemId: 'preStatusId',
                    editable: false,
                    colspan: 2,
                    multiSelect: false,
                    displayField: 'name',
                    valueField: 'id',
                    labelWidth: 100,
                    forceSelection: true,
                    labelAlign: 'left',
                    store: orderStatusStore,
                    queryMode: 'remote',
                    matchFieldWidth: true,
                    listeners: {
                        afterrender: function (combo) {
                            var store = combo.getStore();
                            store.on('load', function () {
                                if (!store.preStatusId) {
                                    combo.select(store.getAt(0));
                                } else {
                                    combo.setValue(store.preStatusId)
                                }
                            })
                        }
                    }
                },
                {
                    name: 'postStatusId',
                    xtype: 'combo',
                    allowBlank: false,
                    fieldLabel: i18n.getKey('toStatus'),
                    itemId: 'postStatusId',
                    editable: false,
                    colspan: 2,
                    forceSelection: true,
                    multiSelect: false,
                    displayField: 'name',
                    pickerAlign: 'tl-bl',
                    valueField: 'id',
                    labelWidth: 100,
                    labelAlign: 'left',
                    store: orderStatusStore,
                    queryMode: 'remote',
                    matchFieldWidth: true,
                    listeners: {
                        afterrender: function (combo) {
                            var store = combo.getStore();
                            store.on('load', function () {
                                if (!store.postStatusId) {
                                    combo.select(store.getAt(0));
                                } else {
                                    combo.setValue(store.postStatusId)
                                }
                            });
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    name: 'serviceType',
                    value: config.type,
                    hidden: true,
                    itemId: 'serviceType',
                    allowBlank: true

                },
                {
                    xtype: 'textfield',
                    name: 'clazz',
                    value: 'com.qpp.cgp.domain.partner.order.config.OrderStatusChangeNotifyConfig',
                    hidden: true,
                    itemId: 'clazz',
                    allowBlank: true
                }
            ],
            listeners: {
                'afterrender': function (view) {
                    var me = this;
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
                                var preStatusId = view.getComponent('preStatusId');
                                var postStatusId = view.getComponent('postStatusId');
                                var serviceType = view.getComponent('serviceType');
                                preStatusId.getStore().preStatusId = record.get('preStatusId')
                                record.get('preStatusId') ? preStatusId.setValue(record.get('preStatusId')) : '';
                                record.get('postStatusId') ? postStatusId.setValue(record.get('postStatusId')) : '';
                                postStatusId.getStore().postStatusId = record.get('postStatusId')
                                serviceType.setValue(record.get('serviceType'));
                            },
                            callback: function (record, operation) {
                            }
                        })
                    }
                }
            }

        }, config);
        me.callParent([applyConfig])
    }
})