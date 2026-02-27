/**
 * Created by nan on 2017/12/15.
 */
Ext.syncRequire([
    "CGP.currency.store.Currency",
    'CGP.configuration.shippingmethod.model',
    'CGP.common.model.RtType',
    'CGP.common.field.RtTypeSelectField'
])
Ext.define('CGP.partner.view.config.DefaultConfigWindow', {
    extend: 'Ext.window.Window',
    modal: true,
    bodyStyle: 'padding:10px',
    height: 400,
    width: 500,
    autoScroll: true,
    autoShow: true,

    initComponent: function () {
        var me = this;

        var fieldText = null;
        me.title = i18n.getKey('default') + i18n.getKey('config');
        var myMask = new Ext.LoadMask(me, {
            msg: "加载中..."
        });
        me.listeners = {
            show: function () {
                myMask.show();
            }
        };
        var currencyStore = Ext.create("CGP.currency.store.Currency", {
            proxy: {
                type: 'uxrest',
                extraParams: {filter: '[{"name":"website.id","value":' + me.websiteId + ',"type":"number"}]'},
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
        var paymentStore = Ext.create('Ext.data.Store', {
            model: 'CGP.model.ShippingModule',
            autoLoad: true,
            proxy: {
                type: 'uxrest',
                url: adminPath + 'api/shippingModules?websiteId=' + me.websiteId,
                reader: {
                    type: 'json',
                    root: 'data'
                }
            }
        });
        var store = Ext.create('CGP.partner.store.PartnerConfigStore', {
            partnerId: me.partnerId,
            groupId: me.groupId,
            websiteId: me.websiteId,
            listeners: {

                load: function () {
                    myMask.hide();
                }
            }
        });
        var rtTypeStore = Ext.create('Ext.ux.data.store.UxTreeStore', {
            model: 'CGP.common.model.RtType',
            nodeParam: '_id',
            pageSize: 25,
            root: {
                _id: 'root',
                name: ''
            },
            autoLoad: true,
            autoSync: false,
            proxy: {
                type: 'treerest',
                url: adminPath + 'api/rtTypes/{rtTypeId}/children',
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                reader: {
                    type: 'json',
                    root: 'data'
                }
            },
            params: null
        });
        var bbar = Ext.create('Ext.toolbar.Toolbar', {
            items: [
                '->', {
                    itemId: 'btnSave',
                    text: i18n.getKey('save'),
                    iconCls: 'icon_save',
                    handler: function () {
                        //保存修改的配置
                        me.controller.nanModify(page, store);
                        me.close();
                    }

                }, {
                    itemId: 'btnReset',
                    text: i18n.getKey('reset'),
                    iconCls: 'icon_reset',
                    handler: function () {
                        me.controller.addFieldText('', page, me, store);
                    }
                }

            ]
        });
        var itemsconfig = [
            {
                xtype: 'rttypeselectfield',
                fieldLabel: i18n.getKey('额外属性'),
                itemId: '0',
                name: 'RtType',
                key: 'PARTNER_' + me.partnerId + '_CONFIG_KEY_ORDER_EXTRA_PARAM_RT_TYPE',
                groupId: me.groupId,
                websiteId: me.websiteId,
                store: rtTypeStore,
                width: 450,
            },
            {
                xtype: 'combo',
                itemId: '1',
                trigger1Cls: 'x-form-clear-trigger',
                trigger2Cls: 'x-form-arrow-trigger',
                onTrigger1Click: function () {
                    this.setValue(null);
                },
                groupId: me.groupId,
                editable: false,
                websiteId: me.websiteId,
                key: 'PARTNER_' + me.partnerId + '_CONFIG_KEY_DEFAULT_CURRENCY',
                store: currencyStore,
                displayField: 'title',
                valueField: 'id',
                fieldLabel: i18n.getKey('partner') + i18n.getKey('default') + i18n.getKey('currency')
            },
            {
                xtype: 'combo',
                itemId: '2',
                trigger1Cls: 'x-form-clear-trigger',
                trigger2Cls: 'x-form-arrow-trigger',
                onTrigger1Click: function () {
                    this.setValue(null);
                },
                groupId: me.groupId,
                editable: false,
                websiteId: me.websiteId,
                key: 'PARTNER_' + me.partnerId + '_CONFIG_KEY_DEFAULT_SHIPPING_METHOD',
                store: paymentStore,
                displayField: 'title',
                valueField: 'code',
                fieldLabel: i18n.getKey('partner') + i18n.getKey('default') + i18n.getKey('shippingMethod')
            },
            {
                xtype: 'combo',
                itemId: '3',
                trigger1Cls: 'x-form-clear-trigger',
                trigger2Cls: 'x-form-arrow-trigger',
                onTrigger1Click: function () {
                    this.setValue(null);
                },
                groupId: me.groupId,
                editable: false,
                websiteId: me.websiteId,
                key: 'PARTNER_' + me.partnerId + '_CONFIG_KEY_BASE_CURRENCY',
                store: currencyStore,
                displayField: 'title',
                valueField: 'id',
                fieldLabel: i18n.getKey('partner') + i18n.getKey('base') + i18n.getKey('currency')
            },
            {
                xtype: 'textfield',
                itemId: '4',
                groupId: me.groupId,
                editable: false,
                websiteId: me.websiteId,
                key: 'PARTNER_' + me.partnerId + '_CONFIG_KEY_REPORT_ADDRESSLABEL',
                fieldLabel: i18n.getKey('partner') + i18n.getKey('defaultAddressLabel')
            }
        ];
        var page = Ext.create("Ext.form.Panel", {
            header: false,
            width: '100%',
            border: false,
            layout: {
                type: 'table',
                columns: 1
            },
            defaults: {
                width: 450
            },
            items: itemsconfig
        });

        store.load({
            callback: function (records, options, success) {
                me.controller.addFieldText(records, page, me, store);
            }
        })
        me.items = [page];
        me.bbar = bbar;
        me.callParent(arguments);
        me.form = me.down('form');
    }
});



