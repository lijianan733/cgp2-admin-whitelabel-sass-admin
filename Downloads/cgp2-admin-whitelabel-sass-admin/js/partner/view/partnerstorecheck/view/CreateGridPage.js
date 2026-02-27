/**
 * @author xiu
 * @date 2025/5/15
 */
Ext.define('CGP.partner.view.partnerstorecheck.view.CreateGridPage', {
    extend: 'Ext.ux.ui.GridPage',
    alias: 'widget.createGridPage',
    store: null,
    block: 'partnerstorecheck',
    editPage: 'edit.html',
    i18nblock: i18n.getKey('partnerStore'),
    getCreateFont: function (color, isBold, text, fontSize, backgroundColor) {
        var bold = isBold ? 'bold' : 'none',
            font = fontSize || 12;

        return "<font " +
            "style= 'font-size:" + font + "px;" +
            "color:" + color + ";" +
            "font-weight:" + bold + ";" +
            "background-color:" + backgroundColor + ";" +
            "border-radius:" + "20px" + ";" + /* 设置圆角 */
            "'" + ">" + text + '</font>'
    },
    getStoresUrlCheckCode: function (storesUrlCheck, platformName) {
        var result = '012';

        if (storesUrlCheck) {
            var {connectErrorCode, authSuccess, expireTime} = storesUrlCheck;

            /*if (expireTime) {
                result = '012';
            }*/

            if (authSuccess) {
                result = '000';
            } else {
                result = connectErrorCode;
            }

            if (platformName === 'ManualOrderPlatform') {
                result = '012';
            }
        }

        return result;
    },
    initComponent: function () {
        var me = this,
            id = JSGetQueryString('id'),
            partnerId = JSGetQueryString('partnerId'),
            partnerStore = Ext.create('CGP.order.store.PartnerStore', {
                autoLoad: false
            }),
            controller = Ext.create('CGP.partner.view.partnerstorecheck.controller.Controller')

        me.config = {
            block: me.block,
            tbarCfg: {
                hiddenButtons: ['config', 'help', 'export', 'import', 'delete'],
                btnCreate: {
                    text: i18n.getKey('店铺信息报表'),
                    width: 120,
                    iconCls: 'icon_import',
                    handler: function () {
                        var filterComp = me.getComponent('filter'),
                            createdDateComp = filterComp.getComponent('createdDate'),
                            createdDateCompItems = createdDateComp.items.items,
                            effectiveTimeArr = createdDateCompItems.map(item => {
                                var itemValue = item.getValue()
                                return itemValue ? Ext.Date.format(new Date(itemValue), "Y-m-d") : '';
                            }),
                            postData = {
                                effectiveTime: {
                                    'effectiveTime@from': effectiveTimeArr[0],
                                    'effectiveTime@to': effectiveTimeArr[1]
                                }
                            };

                        controller.createExportStoreInfoFormWindow(postData, null, function (win, formData) {
                            var url = adminPath + 'api/partner/stores/export/excel',
                                result = formData['effectiveTime'];

                            controller.downLoadExcelFn(url, '店铺信息报表', result, null, function (require, success, response) {
                                if (success) {
                                    var responseText = Ext.JSON.decode(response.responseText);
                                    if (responseText.success) {
                                        win.close();
                                        JSShowNotification({
                                            type: 'success',
                                            title: '导出成功!',
                                        });
                                    }
                                }
                            })
                        });
                    }
                },
            },
            gridCfg: {
                store: me.store,
                // showRowNum:false,
                editAction: false,
                deleteAction: false,
                selModel: {
                    selType: 'rowmodel',
                },
                columnDefaults: {
                    align: 'center',
                },
                columns: [
                    {
                        text: i18n.getKey('store编号'),
                        width: 150,
                        dataIndex: '_id',
                        sortable: true
                    },
                    {
                        xtype: 'componentcolumn',
                        text: i18n.getKey('store名称'),
                        width: 400,
                        dataIndex: 'name',
                        sortable: true,
                        renderer: function (value, metadata, record) {
                            metadata.tdAttr = 'data-qtip ="' + value + '"';

                            var id = record.get('_id'),
                                platform = record.get('platform'),
                                url = record.get('url'),
                                {icon, code, name} = platform,
                                iconText = imageServer + icon + '/17/17';

                            return {
                                xtype: 'fieldcontainer',
                                layout: {
                                    type: 'hbox',
                                    align: 'middle' // 垂直居中
                                },
                                width: '100%',
                                items: [
                                    {
                                        xtype: 'button',
                                        icon: iconText,
                                        tooltip: name,
                                        width: 'auto',
                                        componentCls: "btnOnlyIcon",
                                    },
                                    {
                                        xtype: 'displayfield',
                                        value: JSCreateFont('#000', true, value),
                                    },
                                    {
                                        xtype: 'button',
                                        width: 'auto',
                                        hidden: true,
                                        componentCls: "btnOnlyIcon",
                                        tooltip: 'errorInfo',
                                        text: 'typeText',
                                        listeners: {
                                            afterrender: function (comp) {
                                                var storesUrlCheckUrl = adminPath + `api/v2/stores/checkV2?storeIds=${id}`;

                                                JSAjaxRequest(storesUrlCheckUrl, 'GET', true, null, null, function (require, success, response) {
                                                    if (success) {
                                                        var responseText = Ext.JSON.decode(response.responseText);
                                                        if (responseText.success) {
                                                            var storesUrlCheck = responseText.data[0],
                                                                connectErrorCode = me.getStoresUrlCheckCode(storesUrlCheck, name),
                                                                urlStatusType = {
                                                                    '000': {
                                                                        backgroundColor: 'green',
                                                                        errorInfo: '连接成功',
                                                                        text: 'Connected'
                                                                    },
                                                                    '001': {
                                                                        backgroundColor: 'red',
                                                                        errorInfo: '系统错误，已知错误之外的错误',
                                                                        text: 'unexpected error'
                                                                    },
                                                                    '002': {
                                                                        backgroundColor: 'red',
                                                                        errorInfo: '网络问题，连接无法访问',
                                                                        text: 'connect failed'
                                                                    },
                                                                    '003': {
                                                                        backgroundColor: 'red',
                                                                        errorInfo: '权限授权(未授权)',
                                                                        text: 'authorization failed'
                                                                    },
                                                                    '004': {
                                                                        backgroundColor: 'red',
                                                                        errorInfo: '店铺url无效',
                                                                        text: 'invalid url'
                                                                    },
                                                                    '005': {
                                                                        backgroundColor: 'red',
                                                                        errorInfo: '店铺配置错误',
                                                                        text: 'missing authorization'
                                                                    },
                                                                    '006': {
                                                                        backgroundColor: 'red',
                                                                        errorInfo: 'token推送失败,网站basic token推送给第三方插件失败',
                                                                        text: 'connect failed'
                                                                    },
                                                                    '007': {
                                                                        backgroundColor: 'red',
                                                                        errorInfo: 'webhook推送失败,第三方插件系统问题',
                                                                        text: 'connect failed'
                                                                    },
                                                                    '008': {
                                                                        backgroundColor: 'red',
                                                                        errorInfo: '店铺url不存在',
                                                                        text: 'invalid shop'
                                                                    },
                                                                    '009': {
                                                                        backgroundColor: 'red',
                                                                        errorInfo: '插件无效(shopify)',
                                                                        text: 'invalid plugin'
                                                                    },
                                                                    '010': {
                                                                        backgroundColor: 'red',
                                                                        errorInfo: '插件无效(shopify)',
                                                                        text: 'invalid plugin'
                                                                    },
                                                                    '011': {
                                                                        backgroundColor: 'red',
                                                                        errorInfo: '授权过期(etsy)',
                                                                        text: 'auth expired'
                                                                    },
                                                                    '012': {
                                                                        backgroundColor: '',
                                                                        errorInfo: '',
                                                                        text: ''
                                                                    },
                                                                    '013': {
                                                                        backgroundColor: '',
                                                                        errorInfo: '',
                                                                        text: ''
                                                                    },
                                                                },
                                                                {
                                                                    backgroundColor,
                                                                    errorInfo,
                                                                    text
                                                                } = urlStatusType[connectErrorCode],
                                                                typeText = url ? me.getCreateFont('white', true, `&nbsp&nbsp${text}&nbsp&nbsp`, 12, backgroundColor) : '';

                                                            comp.setTooltip(errorInfo);
                                                            comp.setText(typeText);
                                                            comp.setVisible(true);
                                                        }
                                                    }
                                                }, false);
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    },
                    {
                        text: i18n.getKey('partner名称'),
                        width: 220,
                        dataIndex: 'partnerName',
                        renderer: function (value, metadata, record) {
                            metadata.tdAttr = 'data-qtip ="' + value + '"';

                            return value;
                        }
                    },
                    {
                        xtype: 'componentcolumn',
                        text: i18n.getKey('currency'),
                        width: 160,
                        dataIndex: 'currencyCode',
                        sortable: true,
                        renderer: function (value, metadata, record) {
                            var currencyExceptionInfoList = record.get('currencyExceptionInfoList'),
                                messageList = currencyExceptionInfoList.map(item => {
                                    return item['message'];
                                }),
                                result = messageList.join(',')

                            return {
                                xtype: 'fieldcontainer',
                                layout: {
                                    type: 'hbox',
                                    pack: 'center', // 水平居中
                                    align: 'middle' // 垂直居中
                                },
                                width: '100%',
                                items: [
                                    {
                                        xtype: 'displayfield',
                                        value: JSCreateFont('#000', true, value || 'USD')
                                    },
                                    {
                                        xtype: 'button',
                                        tooltip: result,
                                        iconCls: 'icon_errorInfo',
                                        hidden: !result,
                                        componentCls: "btnOnlyIcon",
                                    },
                                ]
                            };
                        }
                    },
                    {
                        text: i18n.getKey('status'),
                        width: 200,
                        dataIndex: 'status',
                        sortable: true,
                        renderer: function (value, metadata, record) {
                            var isInRange = ['draft', 'close', 'active'].includes(value),
                                defaultValue = isInRange ? value : 'close',
                                statusGather = {
                                    draft: {
                                        color: 'orange',
                                        text: 'Draft'
                                    },
                                    close: {
                                        color: 'red',
                                        text: 'Inactive'
                                    },
                                    active: {
                                        color: 'green',
                                        text: 'Active'
                                    }
                                },
                                {color, text} = statusGather[defaultValue];

                            return JSCreateFont(color, true, text);
                        }
                    },
                    //创建时间
                    {
                        text: i18n.getKey('createdDate'),
                        dataIndex: 'createdDate',
                        sortable: false,
                        itemId: 'createdDate',
                        xtype: 'datecolumn',
                        align: 'center',
                        renderer: function (value, metadata) {
                            if (Ext.isEmpty(value)) {
                                return
                            }
                            value = Ext.Date.format(value, 'Y/m/d H:i');
                            metadata.style = 'color:gray';
                            metadata.tdAttr = 'data-qtip="' + value + '"';
                            return '<div style="white-space:normal;">' + value + '</div>'
                        }
                    },
                    {
                        xtype: 'atagcolumn',
                        minWidth: 100,
                        width: 250,
                        dataIndex: 'url',
                        text: i18n.getKey('url'),
                        getDisplayName: function (value, metaData, record) {
                            metaData.tdAttr = 'data-qtip ="' + value + '"';
                            return JSCreateHyperLink(value);
                        },
                        clickHandler: function (value, metaData, record) {
                            window.open(value);
                        }
                    },
                    {
                        text: i18n.getKey('账单地址'),
                        width: 250,
                        dataIndex: 'billAddress',
                        sortable: true,
                        renderer: function (value, metadata, record) {
                            if (value) {
                                var str = JSBuildAddressInfo(value);
                                metadata.tdAttr = 'data-qtip="' + str + '"';
                                return str;
                            }
                        }
                    },
                    {
                        text: i18n.getKey('收件人地址'),
                        minWidth: 250,
                        flex: 1,
                        dataIndex: 'deliveryAddress',
                        sortable: true,
                        renderer: function (value, metadata, record) {
                            if (value) {
                                var str = JSBuildAddressInfo(value);
                                metadata.tdAttr = 'data-qtip="' + str + '"';
                                return str;
                            }
                        }
                    },
                ]
            },
            filterCfg: {
                items: [
                    {
                        xtype: 'textfield',
                        name: '_id',
                        itemId: '_id',
                        isLike: false,
                        fieldLabel: i18n.getKey('store编号'),
                        listeners: {
                            afterrender: function (comp) {
                                id && comp.setValue(id);
                            }
                        }
                    },
                    {
                        xtype: 'textfield',
                        name: 'name',
                        itemId: 'name',
                        isLike: true,
                        fieldLabel: i18n.getKey('store名称'),
                    },
                    {
                        xtype: 'textfield',
                        name: 'url',
                        itemId: 'url',
                        isLike: true,
                        fieldLabel: i18n.getKey('网址'),
                    },
                    /*{
                        xtype: 'numberfield',
                        name: 'partnerId',
                        itemId: 'partnerId',
                        isLike: false,
                        fieldLabel: i18n.getKey('partner编号'),
                        hidden: !!partnerId,
                        listeners: {
                            afterrender: function (comp) {
                                if (partnerId) {
                                    comp.setValue(partnerId);
                                }
                            }
                        }
                    },*/
                    {
                        xtype: 'gridcombo',
                        name: 'partnerId',
                        itemId: 'partnerId',
                        pageSize: 25,
                        editable: false,
                        haveReset: true,
                        store: partnerStore,
                        displayField: 'name',
                        valueField: 'id',
                        matchFieldWidth: false,
                        fieldLabel: i18n.getKey('partner'),
                        filterCfg: {
                            layout: {
                                type: 'column',
                                columns: 2
                            },
                            fieldDefaults: {
                                labelAlign: 'right',
                                layout: 'anchor',
                                style: 'margin-right:20px; margin : 5px;',
                                labelWidth: 50,
                                width: 250,
                            },
                            items: [
                                {
                                    name: 'id',
                                    xtype: 'numberfield',
                                    fieldLabel: i18n.getKey('id'),
                                    allowDecimals: false,
                                    hideTrigger: true,
                                    itemId: 'id'
                                }, {
                                    name: 'name',
                                    xtype: 'textfield',
                                    itemId: 'name',
                                    fieldLabel: i18n.getKey('name')
                                },
                                {
                                    name: 'email',
                                    xtype: 'textfield',
                                    itemId: 'email',
                                    fieldLabel: i18n.getKey('email')
                                },
                            ]
                        },
                        gridCfg: {
                            store: partnerStore,
                            height: 300,
                            width: 550,
                            columns: [
                                {
                                    text: i18n.getKey('id'),
                                    width: 80,
                                    dataIndex: 'id'
                                },
                                {
                                    text: i18n.getKey('name'),
                                    width: 200,
                                    dataIndex: 'name'
                                },
                                {
                                    text: i18n.getKey('email'),
                                    flex: 1,
                                    dataIndex: 'email'
                                }
                            ],
                            bbar: {
                                xtype: 'pagingtoolbar',
                                store: partnerStore,
                            }
                        },
                        readOnly: !!partnerId,
                        listeners: {
                            afterrender: function (comp) {
                                var filterComp = comp.ownerCt;

                                if (partnerId) {
                                    comp.setInitialKeyValues('id', [+partnerId]);
                                    setTimeout(item => {
                                        filterComp.searchActionHandler(filterComp);
                                        comp.setVisible(false);
                                    }, 1000)
                                }
                            }
                        }
                    },
                    {
                        xtype: 'combo',
                        name: 'platform.code',
                        itemId: 'platform.code',
                        isLike: false,
                        editable: false,
                        haveReset: true,
                        fieldLabel: i18n.getKey('店铺类型'),
                        store: {
                            fields: [
                                {
                                    name: 'key',
                                    type: 'string'
                                },
                                {
                                    name: 'value',
                                    type: 'string'
                                }
                            ],
                            data: [
                                {
                                    key: 'Manual',
                                    value: 'ManualOrderPlatform',
                                },
                                {
                                    key: 'WooCommerce',
                                    value: 'WooCommerce',
                                },
                                {
                                    key: 'ManualStore',
                                    value: 'ManualStorePlatform',
                                },
                                {
                                    key: 'Etsy',
                                    value: 'Etsy',
                                },
                                {
                                    key: 'PopUp',
                                    value: 'PopUp',
                                },
                                {
                                    key: 'Shopify',
                                    value: 'Shopify',
                                }
                            ]
                        },
                        displayField: 'value',
                        valueField: 'key',
                    },
                    {
                        xtype: 'combo',
                        itemId: 'status',
                        name: 'status',
                        isLike: false,
                        editable: false,
                        haveReset: true,
                        fieldLabel: i18n.getKey('status'),
                        store: {
                            fields: [
                                {
                                    name: 'key',
                                    type: 'string'
                                },
                                {
                                    name: 'value',
                                    type: 'string'
                                }
                            ],
                            data: [
                                {
                                    key: 'active',
                                    value: 'Active',
                                },
                                {
                                    key: 'draft',
                                    value: 'Draft',
                                },
                                {
                                    key: 'close',
                                    value: 'Inactive',
                                },
                            ]
                        },
                        displayField: 'value',
                        valueField: 'key',
                    },
                    {
                        xtype: 'combo',
                        itemId: 'currencyCode',
                        name: 'currencyCode',
                        isLike: false,
                        editable: false,
                        haveReset: true,
                        fieldLabel: i18n.getKey('currency'),
                        store: Ext.create('CGP.currency.store.Currency', {
                            pageSize: 1000,
                            params: {
                                filter: Ext.JSON.encode([{
                                    name: 'website.id',
                                    type: 'number',
                                    value: 11
                                }])
                            }
                        }),
                        displayField: 'code',
                        valueField: 'code',
                    },
                    {
                        xtype: 'datefield',
                        style: 'margin-right:50px; margin-top : 0px;',
                        name: 'createdDate',
                        id: 'createdDate',
                        itemId: 'createdDate',
                        scope: true,
                        fieldLabel: i18n.getKey('创建日期'),
                        width: 360,
                        format: 'Y/m/d',
                    },
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
