/**
 * Created by nan on 2017/12/19.
 */
Ext.onReady(function () {
    var recordId = JSGetQueryString('id');
    var store = Ext.create('CGP.partner.view.partnerordernotifyhistory.store.PartnerOrderNotifyHistoryStore', {
        params: {
            filter: Ext.JSON.encode(
                [
                    {"name": "_id", "value": recordId+'', "type": "string"}
                ]
            )
        }
    });
    var record = {};
    var baseInfoItems = [];
    var configItems = [];
    var contextItems = [];
    var page = Ext.create('Ext.container.Viewport', {layout: 'fit'});
    store.on('load', function () {
        record = store.getAt(0);
        baseInfoItems = [
            {
                itemId: '_id',
                fieldLabel: i18n.getKey('id'),
                value: record.get('_id')
            },
            {
                itemId: 'partnerName',
                fieldLabel: i18n.getKey('partner') + i18n.getKey('name'),
                value: record.get('partnerName')
            },
            {
                itemId: 'success',
                fieldLabel: i18n.getKey('isSuccess'),
                value: record.get('success')
            },
            {
                itemId: 'message',
                fieldLabel: i18n.getKey('message'),
                xtype: 'displayfield',
                autoScroll: true,

                width: 600,
                readOnly: true,
                value: record.get('message')
            },
            {
                itemId: 'notifyDate',
                fieldLabel: i18n.getKey('notifyDate'),
                value: Ext.Date.format(record.get('notifyDate'), 'Y/m/d H:i')

            }
        ];
        for (var i in record.data.config) {
            if (i == 'clazz')
                continue;
            var item = {
                xtype: 'displayfield',
                readOnly: true,
                value: record.data.config[i],
                fieldLabel: i18n.getKey(i)
            };
            var subItems = [];
            if (i == 'headers' || i == 'queryParameters') {
                for (var j in record.data.config[i]) {
                    var item = {
                        xtype: 'displayfield',
                        readOnly: true,
                        labelWidth: 132,
                        margin: '0 0 0 20',
                        value: record.data.config[i][j],
                        fieldLabel: i18n.getKey(j)
                    };
                    subItems.push(item);
                }
                item = {
                    xtype: 'fieldset',
                    title: i18n.getKey(i),
                    border: false,
                    padding: 0,
                    hidden: subItems.length == 0,
                    margin: '0 0 0 2',
                    collapsible: false,
                    defaultType: 'textfield',
                    defaults: {
                        anchor: '100%',
                        width: 700
                    },
                    layout: 'anchor',
                    items: subItems
                }
            }
            configItems.push(item)
        }
        var store2 = Ext.create('Ext.data.TreeStore', {
            autoLoad: true,
            fields: [
                'text', 'value'
            ],
            proxy: {
                type: 'memory'
            },
            root: {
                expanded: true,
                children: [JSJsonToTree(record.data.context)]
            }
        });
        var form = Ext.create('Ext.form.Panel', {
            autoScroll: true,
            frame: false,
            border: false,
            padding: 10,
            layout: 'anchor',
            items: [
                {
                    xtype: 'toolbar',
                    color: 'black',
                    bodyStyle: 'border-color:white;',
                    border: '0 0 0 0',
                    items: [
                        {
                            xtype: 'displayfield',
                            fieldLabel: false,
                            value: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('baseInfo') + '</font>'
                        }
                    ]

                },
                {
                    xtype: 'fieldset',
                    collapsible: false,
                    border: '1 0 0 0 ',
                    defaultType: 'displayfield',
                    layout: 'anchor',
                    defaults: {
                        labelAlign: 'left',
                        labelWidth: 150,
                        margin: '0 0 3 6',
                        width: 600
                    },
                    items: baseInfoItems
                },
                {
                    xtype: 'toolbar',
                    color: 'black',
                    bodyStyle: 'border-color:white;',
                    border: '0 0 0 0',
                    items: [
                        {
                            xtype: 'displayfield',
                            fieldLabel: false,
                            value: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('网络请求配置') + '</font>'
                        },
                        {
                            xtype: 'button',
                            itemId: 'button',
                            text: i18n.getKey('测试网络请求'),
                            handler: function (view) {
                                myMask.show();
                                var networkRequestConfig = record.data.config;
                                var url = networkRequestConfig.url;
                                var method = networkRequestConfig.method.toUpperCase();
                                var headers = networkRequestConfig.headers || {};
                                var jsonData = Ext.JSON.decode(networkRequestConfig.body) || {};
                                /*                                Ext.Ajax.request({
                                 url: 'https://www.baidu.com/',
                                 method: 'GET',
                                 headers: {
                                 Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                 },
                                 success: function (response) {
                                 var responseMessage = Ext.JSON.decode(response.responseText);
                                 if (responseMessage.success) {
                                 Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('deleteSuccess'));

                                 } else {
                                 Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                 }
                                 },
                                 failure: function (response) {
                                 Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                 }
                                 })*/
                                ;
                                Ext.Ajax.request({
                                    url: url,
                                    method: method,
                                    headers: {
                                        'Access-Control-Allow-Origin': '*',
                                        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
                                        'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
                                        'Authorization': 'Basic Y2tfMTdmZmIxZWZmM2ZkZWE1MWFhZTEyMDQyZjcyNWJjYmVjOWNjODRjNzpjc184OGQ3NTgzNDMxNzNjOTQzYWExMzU2NzdiMDBkZDI5NzJkOGRjNDAy',
                                        'Content-Type': 'application/json'
                                    },
                                    jsonData: jsonData,
                                    success: function (response) {
                                        var responseMessage = Ext.JSON.decode(response.responseText) || {};
                                        if (responseMessage.success) {
                                            myMask.hide();
                                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey(responseMessage));

                                        } else {
                                            myMask.hide();
                                            Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                        }
                                    },
                                    failure: function (response) {
                                        myMask.hide();
                                        try {
                                            var responseMessage = Ext.JSON.decode(response.responseText) || {};
                                            Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                        } catch (e) {
                                            Ext.Msg.alert(i18n.getKey('requestFailed'), 'responseText无返回信息');
                                        }
                                    }
                                });
                            }
                        }
                    ]

                },
                {
                    xtype: 'fieldset',
                    collapsible: false,
                    border: '1 0 0 0 ',
                    defaultType: 'displayfield',
                    layout: 'anchor',
                    defaults: {
                        labelAlign: 'left',
                        labelWidth: 150,
                        margin: '0 0 3 6',
                        width: 600
                    },
                    items: configItems
                },
                {
                    xtype: 'fieldset',
                    title: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('context') + '</font>',
                    collapsible: false,
                    border: '1 0 0 0 ',
                    layout: 'fit',
                    defaultType: 'displayfield',
                    items: [
                        Ext.create('Ext.tree.Panel', {
                            rootVisible: false,
                            text: 'Simple Tree2',
                            store: store2,
                            useArrows: true,
                            height: 800,
                            lines: false,
                            selModel: Ext.create("Ext.selection.RowModel", {
                                mode: "multi",
                                allowDeselect: true,
                                enableKeyNav: true
                            }),
                            viewConfig: {
                                enableTextSelection: true
                            },
                            tbar: [
                                {
                                    xtype: 'button',
                                    text: '全部展开',
                                    handler: function (view) {
                                        view.ownerCt.ownerCt.expandAll();
                                    }
                                },
                                {
                                    xtype: 'button',
                                    text: '全部收缩',
                                    handler: function (view) {
                                        view.ownerCt.ownerCt.collapseAll();
                                    }
                                },
                                '->',
                                {
                                    xtype: 'textfield',
                                    itemId: 'research',
                                    handler: function (view) {
                                        view.ownerCt.ownerCt.collapseAll()
                                    }
                                },
                                {
                                    //该查找只能查找出第一个匹配数据
                                    xtype: 'button',
                                    text: '查找',
                                    handler: function (view) {
                                        var treePanel = view.ownerCt.ownerCt;
                                        var research = view.ownerCt.getComponent('research').getValue().trim();
                                        if (research) {
                                            var store = treePanel.store;
                                            var rootRecord = store.getRootNode();
                                            var selectRecordArray = [];
                                            var selectMode = treePanel.getSelectionModel();
                                            rootRecord.cascadeBy(function (node) {
                                                if (node.get('text').match(research)) {//模糊查找出所有匹配项
                                                    selectRecordArray.push((node))
                                                    treePanel.expandPath(node.getPath());
                                                }
                                            });
                                            selectMode.select(selectRecordArray);
                                        }
                                    }
                                }
                            ],
                            columns: [
                                {
                                    xtype: 'treecolumn',
                                    text: 'key',
                                    flex: 2,
                                    dataIndex: 'text',
                                    sortable: true
                                },
                                {
                                    text: 'value',
                                    flex: 5,
                                    dataIndex: 'value'
                                }
                            ]
                        })
                    ]
                }

            ]
        });
        page.add([form]);
        var myMask = new Ext.LoadMask(page, {msg: "Please wait..."});
    });
})
