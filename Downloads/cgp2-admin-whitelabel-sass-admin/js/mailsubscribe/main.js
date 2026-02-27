Ext.Loader.syncRequire([
    'CGP.common.field.WebsiteCombo'
])
Ext.onReady(function () {


    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('mailSubscribe'),
        block: 'mailsubscribe',
        //权限控制
        accessControl: false,
        gridCfg: {
            editAction: false,
            deleteAction: false,
            store: Ext.create('CGP.mailsubscribe.store.MailSubscribe'),
            columns: [
                {
                    text: i18n.getKey('email'),
                    dataIndex: 'email',
                    width: 170
                }, {
                    sortable: false,
                    text: i18n.getKey('operation'),
                    width: 100,
                    autoSizeColumn: false,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record) {
                        return {
                            xtype: 'toolbar',
                            layout: 'column',
                            style: 'padding:0',
                            default: {
                                width: 100
                            },
                            items: [
                                {
                                    text: i18n.getKey('options'),
                                    width: '100%',
                                    flex: 1,
                                    menu: {
                                        xtype: 'menu',
                                        items: [
                                            {
                                                text: i18n.getKey('test') + i18n.getKey('pcspreprocess'),
                                                disabledCls: 'menu-item-display-none',
                                                handler: function () {
                                                    JSOpen({
                                                        id: 'orderpage1111',
                                                        url: path + "partials/test/testPCSProcess/pcsPpreprocess.html",
                                                        title: 'test pcspreprocess',
                                                        refresh: true
                                                    });
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                },
                {
                    text: i18n.getKey('subscribeDate'),
                    xtype: 'datecolumn',
                    dataIndex: 'subscribeDate',
                    renderer: function (value, metadata) {
                        value = Ext.Date.format(value, 'Y/m/d H:i');
                        metadata.style = 'color:gray';
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return '<div style="white-space:normal;">' + value + '</div>'
                    },
                    width: 160
                }, {
                    text: i18n.getKey('category'),
                    dataIndex: 'category'
                },
                {
                    text: i18n.getKey('website'),
                    dataIndex: 'website',
                    sortable: false,
                    width: 200
                }
            ]
        },
        tbarCfg: {
            btnCreate: {
                text: i18n.getKey('sendMail'),
                width: 100,
                handler: function () {
                    Ext.create('CGP.mailsubscribe.view.MailSender').show();
                }
            },
            btnDelete: {
                text: i18n.getKey('mailHistory'),
                width: 100,
                handler: function () {
                    Ext.create('CGP.mailsubscribe.view.MailHistory').show();
                }
            }
        },
        // 搜索框
        filterCfg: {
            items: [
                {
                    name: 'email',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('email'),
                    itemId: 'email'
                },
                {
                    style: 'margin-right:50px; margin-top : 0px;',
                    name: 'subscribeDate',
                    xtype: 'daterange',
                    itemId: 'fromDate',
                    fieldLabel: i18n.getKey('subscribeDate'),
                    width: 360
                },
                {
                    name: 'website.id',
                    itemId: 'websiteId',
                    xtype: 'websitecombo',
                    value: 11,
                    hidden: true,
                }
            ]
        }

    });
});