/**
 * @author xiu
 * @date 2023/9/1
 */
Ext.Loader.syncRequire([
    'CGP.orderstatusmodify.view.SplitBarTitle',
])
Ext.define('CGP.orderstatusmodify.view.SanctionInfo', {
    extend: 'Ext.Viewport',
    alias: 'widget.sanctionInfo',
    layout: 'fit',
    initComponent: function () {
        const me = this,
            userName = JSGetQueryString('userName'),
            addressFlag = JSGetQueryString('addressFlag'),
            isSuspectedSanctionV1 = JSGetQueryString('isSuspectedSanctionV1'),
            flagTitle = addressFlag == 0 ? '账单用户' : '收件人',
            controller = Ext.create('CGP.orderstatusmodify.controller.Controller'),
            data = controller.getAddressDeliveryDetail();

        var theData = {};

        data.forEach(item => {
            (item.addressFlag == addressFlag) && (theData = item);
        })

        const {sanctionCheckResult} = theData,
            {hits, sanctionUrl} = sanctionCheckResult,
            storeData = hits?.length && hits[0]['doc']['fields'];

        me.items = [
            {
                xtype: 'panel',
                title: flagTitle + '制裁详细',
                autoScroll: true,
                items: [
                    {
                        xtype: 'splitBarTitle',
                        margin: '30 5 0 5',
                        width: '90%',
                        title: '收件人: ',
                        text: userName,
                    },
                    {
                        xtype: 'container',
                        width: '90%',
                        margin: '5 0 5 20',
                        itemId: 'container',
                        layout: 'vbox',
                        defaults: {
                            margin: '5 0 5 20',
                        },
                        items: [
                            {
                                xtype: 'displayfield',
                                fieldLabel: '匹配信息',
                                value: '<a href="#">查看详细</a>',
                                labelWidth: 60,
                                hidden: !sanctionUrl,
                                listeners: {
                                    render: function (display) {
                                        var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                        var ela = Ext.fly(a); //获取到a元素的element封装对象
                                        ela.on("click", function () {
                                            window.open(sanctionUrl)
                                        });
                                    }
                                }
                            },
                            {
                                xtype: 'grid',
                                store: {
                                    fields: ['name', 'value', 'source'],
                                    data: storeData
                                },
                                width: '60%',
                                maxHeight: 500,
                                autoScroll: true,
                                diySetConfig: Ext.emptyFn,//自定义对已有配置的修改
                                columns: {
                                    items: [
                                        {
                                            xtype: 'rownumberer',
                                            text: i18n.getKey('序号'),
                                            width: 50
                                        },
                                        {
                                            text: i18n.getKey('名称'),
                                            dataIndex: 'name',
                                            width: 150,
                                            renderer: function (value, metadata, record) {
                                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                                return　JSAutoWordWrapStr(value);
                                            }
                                        },
                                        {
                                            text: i18n.getKey('值'),
                                            dataIndex: 'value',
                                            flex: 1,
                                            renderer: function (value, metadata, record) {
                                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                                return　JSAutoWordWrapStr(value);
                                            }
                                        },
                                        {
                                            text: i18n.getKey('来源'),
                                            dataIndex: 'source',
                                            flex: 1,
                                            renderer: function (value, metadata, record) {
                                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                                return　JSAutoWordWrapStr(value);
                                            }
                                        },
                                    ],
                                    defaults: {
                                        tdCls: 'vertical-middle',
                                        sortable: false,
                                        menuDisabled: true
                                    }
                                }
                            },
                        ]
                    },
                ]
            }
        ]
        me.callParent();
    }
})