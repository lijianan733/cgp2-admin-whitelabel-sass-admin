/**
 * Created by nan on 2018/6/13.
 */
Ext.define('CGP.partner.view.placeorderconfig.view.BaseConfigForm', {
    extend: 'Ext.ux.form.Panel',
    title: i18n.getKey('baseInfo'),
    partnerId: null,//传入的参数
    websiteId: null,// 传入的参数
    record: null,//当前记录
    tbar: Ext.create('Ext.ux.toolbar.Edit', {
        btnCreate: {
            hidden: true,
            handler: function () {
            }
        },
        btnCopy: {
            hidden: true,
            handler: function () {
            }
        },
        btnReset: {
            handler: function (view) {
                var form = view.ownerCt.ownerCt;
                var controller = Ext.create('CGP.partner.view.placeorderconfig.controller.Controller');
                controller.loadRecord(form);
            }
        },
        btnSave: {
            handler: function (view) {
                var form = view.ownerCt.ownerCt;
                var controller = Ext.create('CGP.partner.view.placeorderconfig.controller.Controller');
                var form1Valid = form.isValid();
                var form2Valid = form.deliveryAddressPanel.isValid();
                if (form1Valid && form2Valid) {
                    controller.saveDeliveryAddressFormValue(form.deliveryAddressPanel);
                    controller.saveFormValue(form);
                } else {
                    if (!form1Valid) {
                        form.isValid();
                    }
                    else {
                        form.outTab.setActiveTab(form.deliveryAddressPanel);
                        form.msgPanel.hide()
                        form.deliveryAddressPanel.isValid();
                    }
                }
            }
        },
        btnGrid: {
            hidden: true,
            handler: function () {
            }
        },
        btnConfig: {
            disabled: true,
            handler: function () {
            }
        },
        btnHelp: {
            handler: function () {
            }
        }
    }),
    defaults: {
        allowBlank: false,
        margin: '10 10 0 10',
        width: 350
    },
    constructor: function (config) {
        var me = this;
        var currencyStore = Ext.create("CGP.currency.store.Currency", {
            proxy: {
                type: 'uxrest',
                extraParams: {filter: '[{"name":"website.id","value":' + config.websiteId + ',"type":"number"}]'},
                isRepeat: true,
                url: adminPath + 'api/currencies',
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                reader: {
                    type: 'json',
                    root: 'data.content'
                }
            }
        });

        var shippingStore = Ext.create('Ext.data.Store', {
            model: 'CGP.model.ShippingModule',
            autoLoad: true,
            proxy: {
                type: 'uxrest',
                url: adminPath + 'api/shippingModules?websiteId=' + config.websiteId,
                reader: {
                    type: 'json',
                    root: 'data'
                }
            }
        });
        var applyConfig = Ext.merge({
            items: [
                {
                    xtype: 'combo',
                    itemId: 'defaultCurrency',
                    name: 'defaultCurrency',
                    labelSeparator: ':<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>',
                    editable: false,
                    store: currencyStore,
                    displayField: 'title',
                    valueField: 'id',
                    fieldLabel: i18n.getKey('default') + i18n.getKey('currency')
                },
                {
                    name: 'extraParam',
                    xtype: 'treecombo',
                    trigger1Cls: 'x-form-clear-trigger',
                    trigger2Cls: 'x-form-arrow-trigger',
                    onTrigger1Click: function () {
                        this.setValue(null);
                    },
                    editable: false,
                    matchFieldWidth: true,
                    fieldLabel: i18n.getKey('额外属性'),
                    itemId: 'extraParam',
                    key: 'PARTNER_' + me.partnerId + '_CONFIG_KEY_ORDER_EXTRA_PARAM_RT_TYPE',
                    groupId: 24,//不知为啥
                    websiteId: me.websiteId,
                    store: Ext.create('CGP.common.store.RtType'),
                    displayField: 'name',
                    valueField: '_id',
                    rootvisible: false,
                    selectChildren: false,
                    canSelectFolders: true,
                    multiselect: false,
                    listeners: {
                        //展开时显示选中状态
                        expand: function (field) {
                            var recursiveRecords = [];

                            function recursivePush(node, setIds) {
                                addRecRecord(node);
                                node.eachChild(function (nodesingle) {
                                    if (nodesingle.hasChildNodes() == true) {
                                        recursivePush(nodesingle, setIds);
                                    } else {
                                        addRecRecord(nodesingle);
                                    }
                                });
                            };
                            function addRecRecord(record) {
                                for (var i = 0, j = recursiveRecords.length; i < j; i++) {
                                    var item = recursiveRecords[i];
                                    if (item) {
                                        if (item.getId() == record.getId()) return;
                                    }
                                }
                                if (record.getId() <= 0) return;
                                recursiveRecords.push(record);
                            };
                            var node = field.tree.getRootNode();
                            recursivePush(node, false);
                            Ext.each(recursiveRecords, function (record) {
                                var id = record.get(field.valueField);
                                if (field.getValue() == id && !Ext.isEmpty(field.getValue())) {
                                    field.tree.getSelectionModel().select(record);
                                }
                            });
                        },
                        afterrender: function (comp) {
                            comp.tree.expandAll();
                        }
                    }
                },
                {
                    xtype: 'combo',
                    itemId: 'shippingMethod',
                    name: 'shippingMethod',
                    trigger1Cls: 'x-form-clear-trigger',
                    trigger2Cls: 'x-form-arrow-trigger',
                    onTrigger1Click: function () {
                        this.setValue(null);
                    },
                    editable: false,
                    allowBlank: false,
                    store: shippingStore,
                    displayField: 'title',
                    valueField: 'id',
                    fieldLabel: i18n.getKey('default') + i18n.getKey('shippingMethod')
                }
            ],
            listeners: {
                'afterrender': function (view) {
                    var controller = Ext.create('CGP.partner.view.placeorderconfig.controller.Controller');
                    controller.loadRecord(view);
                }
            }
        }, config);
        me.callParent([applyConfig]);
    }

})