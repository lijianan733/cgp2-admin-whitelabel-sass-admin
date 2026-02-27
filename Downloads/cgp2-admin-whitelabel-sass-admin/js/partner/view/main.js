Ext.Loader.setConfig({
    enabled: true,
    paths: {
        'Ext.ux': path + 'ClientLibs/extjs/ux'
    }
});
Ext.Loader.syncRequire([
    'CGP.common.field.WebsiteCombo',
    'CGP.partner.view.CreateFilterUserAuthInfoComp'
])
Ext.onReady(function () {
    var controller = Ext.create('CGP.partner.controller.Controller');
    var orderStatuses = Ext.create('CGP.common.store.OrderStatuses', {
        autoLoad: true,
    });
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('partner'),
        block: 'partner',
        editPage: 'edit.html',
        tbarCfg: {
            hiddenButtons: ['config', 'help', 'export', 'import'],
        },
        gridCfg: {
            store: Ext.create('CGP.partner.store.PartnerStore'),
            frame: false,
            viewConfig: {
                enableTextSelection: true
            },
            columnDefaults: {
                tdCls: 'vertical-middle'
            },
            columns: [
                {
                    sortable: false,
                    text: i18n.getKey('operation'),
                    width: 100,
                    autoSizeColumn: false,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record) {
                        var id = record.get('id');
                        var code = record.get('code');
                        var partnerName = record.get('name');
                        var email = record.get('email');
                        var websiteId = 11;
                        /*var cooperationBusinessRole = [];
                        if (record.get('cooperationBusinesses')) {
                            for (var i = 0; i < record.get('cooperationBusinesses').length; i++) {
                                cooperationBusinessRole.push(record.get('cooperationBusinesses')[i]['businessName'])
                            }
                        }*/
                        return {
                            xtype: 'button',
                            ui: 'default-toolbar-small',
                            height: 26,
                            text: i18n.getKey('options'),
                            width: '100%',
                            flex: 1,
                            menu: [
                                {
                                    text: i18n.getKey('ecommerce') + i18n.getKey('config'),
                                    /*                                                disabled: !Ext.Array.contains(cooperationBusinessRole, 'seller'),
                                     */
                                    menu: {
                                        items: [
                                            {
                                                text: i18n.getKey('cooperationUsers'),
                                                disabledCls: 'menu-item-display-none',
                                                handler: function () {
                                                    controller.showCooperationUsersWin(id, websiteId);
                                                }
                                            },
                                            {
                                                text: i18n.getKey('enabelProductManage'),
                                                disabledCls: 'menu-item-display-none',
                                                handler: function () {
                                                    controller.showEnabelProductManageWin(id, websiteId);
                                                }
                                            },
                                            {
                                                text: i18n.getKey('base') + i18n.getKey('config'),
                                                disabledCls: 'menu-item-display-none',
                                                handler: function () {
                                                    var partnerId = record.getId();
                                                    Ext.create('CGP.partner.view.config.baseconfig.BaseConfigWin', {
                                                        partnerId: partnerId
                                                    })
                                                }
                                            },
                                            {
                                                text: i18n.getKey('order') + i18n.getKey('config'),
                                                /*                                                disabled: !Ext.Array.contains(cooperationBusinessRole, 'seller'),
                                                 */
                                                menu: {
                                                    items: [{
                                                        text: i18n.getKey('orderPortParams'),
                                                        disabledCls: 'menu-item-display-none',
                                                        itemId: 'orderPortParams',
                                                        handler: function () {

                                                            return controller.orderPortParams(id, websiteId);

                                                        }
                                                    }, {
                                                        text: i18n.getKey('customerEmailSendMail'),
                                                        disabledCls: 'menu-item-display-none',
                                                        handler: function () {
                                                            controller.customerEmailSendMail(id, websiteId);

                                                        }
                                                    },
                                                        {
                                                            text: i18n.getKey('managerEmailSendMail'),
                                                            disabledCls: 'menu-item-display-none',
                                                            handler: function () {
                                                                controller.managerEmailSendMail(id, websiteId);

                                                            }
                                                        },
                                                        {
                                                            text: i18n.getKey('orderMailTemplate'),
                                                            disabledCls: 'menu-item-display-none',
                                                            handler: function () {
                                                                JSOpen({
                                                                    id: 'mailTemplateTabs',
                                                                    url: path + "partials/partner/managermailtemplatetab.html?partnerId=" + id + '&websiteId=' + websiteId,
                                                                    title: i18n.getKey('orderMailTemplate'),
                                                                    refresh: true
                                                                });
                                                            }
                                                        },
                                                        {
                                                            text: i18n.getKey('defaultAddressConfig'),
                                                            disabledCls: 'menu-item-display-none',
                                                            handler: function () {
                                                                controller.defaultAddressWin(id, websiteId);
                                                            }
                                                        }, ,
                                                        {
                                                            text: i18n.getKey('orderNotify') + i18n.getKey('config'),
                                                            disabledCls: 'menu-item-display-none',
                                                            handler: function () {
                                                                controller.orderNotifyConfig(id, websiteId);
                                                            }
                                                        },
                                                        {
                                                            text: i18n.getKey('partnerOrderReportConfigManage'),
                                                            disabledCls: 'menu-item-display-none',
                                                            handler: function () {
                                                                controller.partnerOrderReportConfigManage(id, websiteId);
                                                            }
                                                        },
                                                        {
                                                            text: i18n.getKey('viewConfig'),
                                                            handler: function (view) {
                                                                controller.editViewConfigWindow(id, websiteId);
                                                            }
                                                        },
                                                        {//订单邮件提醒配置
                                                            text: i18n.getKey('orderStatusChangeEmailNotifyConfig'),
                                                            handler: function (view) {
                                                                controller.orderstatuschangenotifyconfig(id, websiteId, 'saler');
                                                            }
                                                        }]
                                                }
                                            },
                                            /*  {
                                                  text: i18n.getKey('enabelProductManage') + 'V2',
                                                  disabledCls: 'menu-item-display-none',
                                                  handler: function () {
                                                      controller.showEcommerceEnabelProductManageWin(id, websiteId);
                                                  }
                                              },*/

                                            {
                                                text: i18n.getKey('basicParamCfg'),
                                                disabledCls: 'menu-item-display-none',
                                                handler: function () {
                                                    controller.basicParamCfg(id, websiteId);
                                                }
                                            },

                                            /*{
                                             text: i18n.getKey('extraParams')+i18n.getKey('config'),
                                             disabledCls: 'menu-item-display-none',
                                             handler: function(){
                                             controller.extraParemsWin(id,websiteId);
                                             }
                                             },*/
                                            {
                                                text: i18n.getKey('default') + i18n.getKey('config'),
                                                disabledCls: 'menu-item-display-none',
                                                handler: function () {
                                                    controller.defaultConfigWin(id, websiteId);
                                                }
                                            },
                                            {
                                                text: i18n.getKey('customsDeclaration') + i18n.getKey('currency') + i18n.getKey('manager'),
                                                disabledCls: 'menu-item-display-none',
                                                handler: function () {
                                                    Ext.create('CGP.partner.view.config.customcurrency.CustomCurrencyConfig', {
                                                        partnerId: id
                                                    });
                                                }
                                            },
                                        ]
                                    }
                                },
                                //供应商的配置
                                {
                                    text: i18n.getKey('supplier') + i18n.getKey('config'),
                                    // disabled: !Ext.Array.contains(cooperationBusinessRole, 'producer'),
                                    menu: [
                                        /*{
                                            text: i18n.getKey('manager') + i18n.getKey('supportableProduct'),
                                            handler: function (view) {
                                                controller.checkSupportableProduct(id, websiteId);
                                            }
                                        },
                                        {
                                            text: i18n.getKey('manager') + i18n.getKey('supportableProduct') + 'V2',
                                            handler: function (view) {
                                                controller.checkSupportableProductV2(id, websiteId);
                                            }
                                        },
                                        {
                                            text: i18n.getKey('orderMailTemplate'),
                                            handler: function (view) {
                                                controller.supplierOrderStatusChangeEmailNotifyConfig(id, websiteId);
                                            }
                                        },
                                        {//下单配置
                                            text: i18n.getKey('order') + i18n.getKey('mail') + i18n.getKey('config'),
                                            handler: function (view) {
                                                controller.orderstatuschangenotifyconfig(id, websiteId, 'producer');
                                            }
                                        },
                                        {//订单配置
                                            text: i18n.getKey('order') + i18n.getKey('config'),
                                            handler: function (view) {
                                                controller.supplierOrderConfig(id, websiteId, 'customer');
                                            }
                                        }*/
                                        {
                                            text: i18n.getKey('供应商配置管理'),
                                            handler: function (view) {
                                                JSOpen({
                                                    id: 'productSupplier',
                                                    url: path + "partials/partner/productsupplier/productsupplier.html?partnerId=" + id + '&websiteId=' + websiteId + '&code=' + code,
                                                    title: i18n.getKey('供应商配置管理'),
                                                    refresh: true
                                                });
                                            }
                                        }
                                    ]
                                },
                                //共有配置
                                {
                                    text: i18n.getKey('commonConfig'),
                                    menu: {
                                        items: [
                                            {
                                                text: i18n.getKey('sendMailCfg'),
                                                handler: function (view) {
                                                    controller.manageSendMailConfig(id, websiteId);
                                                }
                                            }
                                        ]
                                    }
                                },
                                //修改Pop-up Store限制
                                {
                                    text: i18n.getKey('修改Pop-up Store限制'),
                                    handler: function (view) {
                                        JSOpen({
                                            id: 'pop_store_restrict',
                                            url: path + "partials/partner/popStoreRestrict.html?partnerId=" + id
                                                + '&partnerEmail=' + email
                                                + '&websiteId=' + websiteId,
                                            title: i18n.getKey('修改Pop-up Store限制 (' + id + ')'),
                                            refresh: true
                                        });
                                    }
                                },
                                //partner Store
                                {
                                    text: i18n.getKey('PartnerStore'),
                                    handler: function (view) {
                                        JSOpen({
                                            id: 'partner_store',
                                            url: path + "partials/partner/partnerstorecheck/main.html" +
                                                "?partnerId=" + id +
                                                '&partnerEmail=' + email +
                                                '&websiteId=' + websiteId,
                                            title: i18n.getKey('partner Store(' + id + ')'),
                                            refresh: true
                                        });
                                    }
                                },
                                {
                                    text: i18n.getKey('Partner盈余总览'),
                                    handler: function (view) {
                                        JSOpen({
                                            id: 'partner_profit_checkpage',
                                            title: i18n.getKey('Partner盈余总览'),
                                            url: path + 'partials/profitmanagement/partner_profit_check.html' +
                                                '?partnerId=' + id +
                                                '&partnerEmail=' + email,
                                            refresh: true
                                        })
                                    }
                                },
                                {
                                    text: i18n.getKey('partner信贷管理'),
                                    disabledCls: 'menu-item-display-none',
                                    handler: function () {
                                        var partner_create_controller = Ext.create('CGP.partner_credit.controller.Controller');
                                        var configs = partner_create_controller.getPartnerCredit(id);
                                        var isValid = true;
                                        var config = null;
                                        var configId = null;
                                        configs.map(function (item) {
                                            //如果有启用和，待审核，则不能再新建
                                            if (Ext.Array.contains(['Pending', 'Valid'], item.status)) {
                                                isValid = false;
                                                config = item;
                                                configId = config._id;
                                            }
                                        });
                                        if (Ext.isEmpty(configId)) {
                                            Ext.Msg.confirm('提示', '当前Partner无信贷配置,是否新建？', function (selector) {
                                                if (selector == 'yes') {
                                                    JSOpen({
                                                        id: 'partner_credit_edit',
                                                        url: path + 'partials/partner_credit/edit.html' +
                                                            '?partnerId=' + id +
                                                            '&action=' + 'create' +
                                                            '&partnerName=' + partnerName +
                                                            '&status=Pending',
                                                        title: i18n.getKey('create') + '_' + 'partner信贷配置',
                                                        refresh: true
                                                    });
                                                }
                                            });
                                        } else {
                                            JSOpen({
                                                id: 'partner_credit_edit',
                                                url: path + `partials/partner_credit/edit.html?partnerId=${id}&id=${configId}&action=edit&status=${config.status}`,
                                                title: i18n.getKey('修改') + '_' + `partner信贷配置(${configId})`,
                                                refresh: true
                                            });
                                        }
                                    }
                                }
                            ]
                        }
                    }
                },
                {
                    text: i18n.getKey('id'),
                    dataIndex: 'id',
                    width: 120
                },
                {
                    text: i18n.getKey('code'),
                    dataIndex: 'code',
                    sortable: false,
                    width: 150
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    sortable: false,
                    width: 150,
                },
                {
                    text: i18n.getKey('partner') + i18n.getKey('type'),
                    sortable: false,
                    dataIndex: 'partnerType',
                    renderer: function (value) {
                        var map = {
                            'INTERNAL': i18n.getKey('inner'),
                            'EXTERNAL': i18n.getKey('outside')
                        }
                        return map[value];
                    }
                },
                {
                    text: i18n.getKey('注册日期'),
                    sortable: true,
                    xtype: 'datecolumn',
                    dataIndex: 'createdDate',
                    width: 150,
                    renderer: function (value, metadata, record) {
                        metadata.style = "color: gray";
                        value = Ext.Date.format(value, 'Y/m/d H:i');
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return '<div style="white-space:normal;">' + value + '</div>';
                    }
                },
                {

                    text: i18n.getKey('来源网站'),
                    sortable: false,
                    dataIndex: 'platform',
                },
                {
                    text: i18n.getKey('checkout') + i18n.getKey('type'),
                    sortable: false,
                    dataIndex: 'settlementType',
                    width: 180,
                    renderer: function (value) {
                        return i18n.getKey(value);
                    }
                },
                {
                    text: i18n.getKey('email'),
                    dataIndex: 'email',
                    width: 180,
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    xtype: 'atagcolumn',
                    text: i18n.getKey('第三方用户授权信息'),
                    dataIndex: 'id',
                    width: 200,
                    getDisplayName: function (value, metaData, record) {
                        return JSCreateHyperLink('查看');
                    },
                    clickHandler: function (value, metaData, record) {
                        var url = adminPath + `api/partners/${value}/users/authInfo`,
                            queryData = JSGetQuery(url),
                            store = Ext.create('Ext.data.Store', {
                                fields: [
                                    'userId',
                                    'gmail',
                                    'phone',
                                    'email',
                                    'nickName',
                                    'authType',
                                    {
                                        name: 'authTypeValue',
                                        type: 'string',
                                        convert: function (value, record) {
                                            //陈宝石没对清类图 故authType的 邮箱字段为 password 谷歌字段为 google
                                            var authType = record.get('authType'),
                                                includesArray = ['google', 'phone', 'password', 'wechat'],
                                                typeGather = {
                                                    google: '谷歌',
                                                    phone: '手机号',
                                                    password: '邮箱',
                                                    wechat: '微信'
                                                },
                                                title = includesArray.includes(authType) ? typeGather[authType] : value;

                                            return title;
                                        }
                                    },
                                    {
                                        name: 'partner',
                                        type: 'object',
                                    },
                                    {
                                        name: 'displayValue',
                                        type: 'string',
                                        convert: function (value, record) {
                                            var authType = record.get('authType'),
                                                includesArray = ['google', 'phone', 'password', 'wechat'],
                                                typeGather = {
                                                    google: record.get('gmail'),
                                                    phone: record.get('phone'),
                                                    password: record.get('email'),
                                                    wechat: record.get('nickName')
                                                },
                                                newValue = includesArray.includes(authType) ? typeGather[authType] : value;

                                            return newValue;
                                        }
                                    },
                                ],
                                pageSize: 1000,
                                proxy: {
                                    type: 'pagingmemory'
                                },
                                data: queryData || []
                            });

                        controller.createCheckUserAuthInfoGridWindow(store);
                    },
                },
                {
                    text: i18n.getKey('audit') + i18n.getKey('status'),
                    dataIndex: 'partnerStatus',
                    sortable: false,
                    width: 120,
                    renderer: function (value, metadata, record) {
                        var newValue = null;
                        if (value == 'APPROVED') {
                            newValue = '<a style="color:green">已审核</a>';
                        } else if (value == 'LOGOFF') {
                            newValue = '<a style="color:red">已注销</a>';
                        }
                        return newValue;
                    }
                },
                {
                    text: i18n.getKey('初始订单状态'),
                    dataIndex: 'orderInitStatusId',
                    minWidth: 150,
                    renderer: function (value, metadata, record) {
                        var record = orderStatuses.findRecord('id', value);
                        return record ? record.get('name') : null;
                    }
                },
                {
                    text: i18n.getKey('contactor'),
                    sortable: false,
                    dataIndex: 'contactor'
                },
                {
                    text: i18n.getKey('telephone'),
                    sortable: false,
                    flex: 1,
                    minWidth: 180,
                    dataIndex: 'telephone'
                },
            ]
        },
        // 搜索框
        filterCfg: {
            layout: {
                type: 'table',
                columns: 4
            },
            items: [
                {
                    name: 'id',
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('id'),
                    allowDecimals: false,
                    hideTrigger: true,
                    itemId: 'id'
                },
                {
                    name: 'code',
                    xtype: 'textfield',
                    itemId: 'code',
                    fieldLabel: i18n.getKey('code')
                },
                {
                    name: 'name',
                    xtype: 'textfield',
                    itemId: 'name',
                    fieldLabel: i18n.getKey('name')
                },
                {
                    xtype: 'textfield',
                    name: 'email',
                    itemId: 'email',
                    fieldLabel: i18n.getKey('email')
                },
                {
                    xtype: 'textfield',
                    name: 'userName',
                    itemId: 'userName',
                    fieldLabel: i18n.getKey('userAccount'),
                    listeners: {
                        afterrender: function (comp) {
                            var userName = JSGetQueryString('userName');

                            userName && comp.setValue(userName);
                        }
                    }
                },
                {
                    xtype: 'combo',
                    name: 'cooperationType',
                    itemId: 'cooperationType',
                    editable: false,
                    haveReset: true,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['type', "value"],
                        data: [
                            {
                                type: i18n.getKey('nest'), value: 'nest'
                            },
                            {
                                type: i18n.getKey('api'), value: 'api'
                            }
                        ]
                    }),
                    fieldLabel: i18n.getKey('cooperationType'),
                    displayField: 'type',
                    valueField: 'value',
                    queryMode: 'local'
                },
                {
                    name: 'contactor',
                    itemId: 'contactor',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('contactor')
                },
                {
                    name: 'businessName',
                    itemId: 'businessName',
                    xtype: 'combo',
                    isLike: false,
                    haveReset: true,
                    fieldLabel: i18n.getKey('cooperationBusinessRole'),
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            {name: 'name', type: 'string'},
                            {name: 'value', type: 'string'}
                        ],
                        data: [
                            {
                                name: i18n.getKey('ecommerce'),
                                value: 'seller'
                            },
                            {
                                name: i18n.getKey('supplier'),
                                value: 'producer'
                            },
                            {
                                name: i18n.getKey('undistributed'),
                                value: 'none'
                            }
                        ]
                    }),
                    displayField: 'name',
                    valueField: 'value',
                    editable: false
                },
                {
                    name: 'partnerStatus',
                    xtype: 'combo',
                    itemId: 'partnerStatus',
                    fieldLabel: i18n.getKey('audit') + i18n.getKey('status'),
                    displayField: 'value',
                    valueField: 'key',
                    editable: false,
                    haveReset: true,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['value', 'key'],
                        data: [
                            {
                                value: '已审核', key: 'APPROVED'
                            },
                            {
                                value: '已注销', key: 'LOGOFF'
                            }
                        ]
                    }),
                },
                {
                    xtype: 'textfield',
                    name: 'platform',
                    itemId: 'platform',
                    fieldLabel: i18n.getKey('来源网站')
                },
               /* {
                    xtype: 'combo',
                    name: 'platform',
                    itemId: 'platform',
                    fieldLabel: i18n.getKey('来源网站'),
                    valueField: 'value',
                    displayField: 'display',
                    store: {
                        fields: ['display', 'value'],
                        data: [
                            {
                                display: 'QPMN',
                                value: 'QPMN'
                            },
                            {
                                display: 'QPSON',
                                value: 'QPSON'
                            }
                        ]
                    }
                },*/
                {
                    xtype: 'daterange',
                    name: 'createdDate',
                    itemId: 'createdDate',
                    fieldLabel: i18n.getKey('注册日期'),
                    width: 350,
                },
                {
                    xtype: 'user_auth_info',
                    isFilterComp: true,
                    layout: 'hbox',
                    itemId: 'userAuthInfos',
                    width: 450,
                },
            ]
        },
        listeners: {
            afterrender: function (panel) {
                var grid = panel.grid;
                var toolbar = grid.getDockedItems('toolbar[dock="top"]')[0];
                toolbar.add({
                    xtype: 'button',
                    width: 120,
                    iconCls: 'icon_refresh',
                    text: i18n.getKey('sync') + i18n.getKey('partner'),
                    handler: function () {
                        var selections = grid.getSelectionModel().getSelection();
                        if (selections.length == 0) {
                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('未选择partner'));
                            return;
                        }
                        if (selections.length > 0) {
                            var partnerList = [];
                            Ext.each(selections, function (partner) {
                                partnerList.push(partner.data);
                            })
                            Ext.create('CGP.partner.view.syncpartner.InputFormWin', {
                                partnerList: partnerList,
                                page: page
                            })
                        }
                    }
                });
            }
        }
    })
})
