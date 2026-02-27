/**
 * @author xiu
 * @date 2024/12/31
 */
Ext.Loader.syncRequire([
    'CGP.currencyconfig.view.CreateEffectDateComp',
    'CGP.currencyconfig.view.CreateExchangeRateListComp'
]);
Ext.define('CGP.currencyconfig.view.CreateEditPage', {
    extend: 'Ext.ux.ui.EditPage',
    alias: 'widget.createEditPage',
    block: 'currencyconfig',
    gridPage: 'main.html',
    autoScroll: true,
    setEditData: function () {
        var me = this,
            controller = Ext.create('CGP.currencyconfig.controller.Controller'),
            id = JSGetQueryString('_id') || '',
            form = me.getComponent('form'),
            url = adminPath + `api/platformCurrencySettings/${id}`,
            queryData = controller.getQuery(url);

        queryData && form.diySetValue(queryData);
    },
    initComponent: function () {
        var me = this,
            id = JSGetQueryString('_id') || '',
            type = JSGetQueryString('type'),
            readOnly = JSGetQueryString('readOnly'),
            websiteId = JSGetQueryString('websiteId'),
            websiteMode = JSGetQueryString('websiteMode'),
            controller = Ext.create('CGP.currencyconfig.controller.Controller'),
            isEdit = type === 'edit',
            noCreate = type !== 'create',
            isCopy = type === 'copy';

        me.config = {
            block: me.block,
            tbarCfg: {
                hiddenButtons: ['config', 'help', 'create', 'copy'],
                btnSave: {
                    disabled: readOnly,
                    handler: function (btn) {
                        var me = this,
                            tools = me.ownerCt,
                            form = tools.ownerCt,
                            getValue = form.diyGetValue(),
                            url = adminPath + (isEdit ? `api/platformCurrencySettings/${id}` : 'api/platformCurrencySettings');

                        console.log(getValue);
                        if (form.isValid()){
                            controller.asyncEditQuery(url, getValue, isEdit, function (require, success, response) {
                                if (success) {
                                    var responseText = Ext.JSON.decode(response.responseText);
                                    if (responseText.success) {
                                        var data = responseText.data,
                                            dataId = data['_id'];
                                        console.log(responseText.data);
                                        Ext.Msg.alert('提示', '保存成功!', function () {
                                            if (!isEdit) {
                                                JSOpen({
                                                    id: 'edit_currencyconfig',
                                                    url: path + `partials/currencyconfig/edit.html` +
                                                        `?_id=${dataId}&type=edit&websiteId=${websiteId}&websiteMode=${websiteMode}`,
                                                    refresh: true,
                                                    title: i18n.getKey('编辑_货币配置<' + dataId + '>')
                                                });
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    }
                },
                btnReset: {
                    disabled: readOnly,
                    handler: function (btn) {
                        var me = this,
                            tools = me.ownerCt,
                            form = tools.ownerCt;

                        form.getForm().reset();
                    }
                },
                btnGrid: {
                    handler: function (btn) {
                        JSOpen({
                            id: 'currencyconfig',
                            url: path + `partials/currencyconfig/main.html` +
                                `?websiteId=${websiteId}&websiteMode=${websiteMode}`,
                            refresh: true,
                            title: i18n.getKey('货币配置')
                        });
                    }
                }
            },
            formCfg: {
                model: 'CGP.currencyconfig.model.CurrencyconfigModel',
                remoteCfg: false,
                layout: 'vbox',
                defaults: {},
                diySetValue: function (data) {
                    var me = this,
                        {
                            currencyUsageScopes,
                            effectiveTime,
                            exchangeRateSet,
                            platform,
                            description,
                            effectiveMode
                        } = data,
                        descriptionComp = me.getComponent('description'),
                        createEffectDateComp = me.getComponent('createEffectDateComp'),
                        createExchangeRateListComp = me.getComponent('createExchangeRateListComp');

                    createEffectDateComp.diySetValue({
                        effectiveMode,
                        effectiveTime,
                        expiredTime: null,
                        nextEffectiveSettingId: null
                    });
                    createExchangeRateListComp.diySetValue({
                        exchangeRateSet,
                        currencyUsageScopes
                    });
                },
                diyGetValue: function () {
                    var me = this,
                        items = me.items.items,
                        result = {};
                    items.forEach(item => result[item.itemId] = item.diyGetValue ? item.diyGetValue() : item.getValue());

                    var {createEffectDateComp, createExchangeRateListComp} = result;

                    return Ext.Object.merge(result, createEffectDateComp, createExchangeRateListComp);
                },
                items: [
                    {
                        xtype: 'textfield',
                        name: 'id',
                        itemId: 'id',
                        hidden: true,
                        fieldLabel: i18n.getKey('id'),
                        diyGetValue: function () {
                            return id
                        }
                    },
                    {
                        xtype: 'numberfield',
                        name: 'platformId',
                        itemId: 'platformId',
                        hidden: true,
                        fieldLabel: i18n.getKey('platformId'),
                        value: websiteId
                    },
                    {
                        xtype: 'createEffectDateComp',
                        name: 'createEffectDateComp',
                        itemId: 'createEffectDateComp',
                        showCompName: 'three',
                        margin: '0 0 0 20',
                        readOnly: readOnly,
                        width: 800
                    },
                    {
                        xtype: 'createExchangeRateListComp',
                        name: 'createExchangeRateListComp',
                        itemId: 'createExchangeRateListComp',
                        margin: '20 0 0 20',
                        readOnly: readOnly,
                        width: '100%'
                    },
                ],
            },
        }
        me.callParent();
        me.on('afterrender', (comp) => {
            noCreate && comp.setEditData()
        })
    },
    constructor: function (config) {
        var me = this;
        me.initConfig(config);
        me.callParent([config]);
    },
})