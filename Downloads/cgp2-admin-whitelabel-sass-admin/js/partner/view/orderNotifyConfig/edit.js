/**
 * Created by nan on 2017/12/19.
 */
//edit:根据传入的record的id,查找到对应的记录，根据记录中的config，和context构建对应的store
//create:创建对应的空store,
//根据是否为新建，对表单项赋值
Ext.syncRequire(['CGP.partner.view.orderNotifyConfig.store.OrderNotifyConfigStore',
    'CGP.partner.view.orderNotifyConfig.model.HeadersItemsModel',
    'CGP.partner.view.orderNotifyConfig.model.RestHttpRequestConfigModel',
    'CGP.orderlineitem.store.OrderItemStatus']);
Ext.onReady(function () {
    Ext.tip.QuickTipManager.init();
    //选中的记录id
    var recordId = JSGetQueryString('recordId');
    //partner的id
    var partnerId = parseInt(JSGetQueryString('partnerId'));
    //对应partner的配置集合的store
    var createOrUpdate = Ext.isEmpty(recordId) ? 'create' : 'edit';
    var configRecode = '';
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        id: 'EditPage',
        itemId: 'EditPage'
    });
    var controller = Ext.create('CGP.partner.view.orderNotifyConfig.controller.Controller');
    var baseGrid = {
        viewConfig: {
            enableTextSelection: true//设置grid中的文本可以选择
        },
        selModel: new Ext.selection.RowModel({
            mode: 'MULTI'
        }),
        height: 250,
        width: 1000,
        columns: [
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
                            controller.editRestHttpRequestConfig(page, record, store, recordId, partnerId);
                        }
                    },
                    {
                        iconCls: 'icon_remove icon_margin',
                        itemId: 'actionremove',
                        tooltip: 'Remove',
                        handler: function (view, rowIndex, colIndex) {
                            var store = view.getStore();
                            var record = store.getAt(rowIndex);
                            store.remove(record);
                        }
                    }
                ]
            },
            {
                xtype: 'rownumberer',
                width: 50,
                sortable: true,
                tdCls: 'vertical-middle'

            },
            {
                text: i18n.getKey('method'),
                dataIndex: 'method',
                itemId: 'method',
                sortable: true,
                tdCls: 'vertical-middle'
            },
            {
                text: i18n.getKey('url'),
                dataIndex: 'url',
                itemId: 'url',
                sortable: true,
                tdCls: 'vertical-middle'
            },
            {
                text: i18n.getKey('headers'),
                dataIndex: 'headers',
                itemId: 'headers',
                tdCls: 'vertical-middle',
                renderer: function (value, mater) {
                    var str = ''
                    for (var i in value) {
                        str += i + ' : ' + value[i] + '<br>'
                    }
                    mater.tdAttr = 'data-qtip="' + str + '"';
                    return str;
                }
            },
            {
                text: i18n.getKey('body'),
                dataIndex: 'body',
                itemId: 'body',
                sortable: true,
                renderer: function (value, mater) {
                    mater.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                },
                tdCls: 'vertical-middle'
            },
            {
                text: i18n.getKey('queryParameters'),
                dataIndex: 'queryParameters',
                itemId: 'queryParameters',
                tdCls: 'vertical-middle',
                renderer: function (value, mater) {
                    var str = ''
                    for (var i in value) {
                        str += i + ' : ' + value[i] + '<br>'
                    }
                    mater.tdAttr = 'data-qtip="' + str + '"';
                    return str;
                }
            },
            {
                text: i18n.getKey('successPath'),
                dataIndex: 'successPath',
                itemId: 'successPath',
                width: 100,
                sortable: true,
                tdCls: 'vertical-middle'
            },
            {
                text: i18n.getKey('successKey'),
                dataIndex: 'successKey',
                itemId: 'successKey',
                sortable: true,
                tdCls: 'vertical-middle'
            },
            {
                text: i18n.getKey('errorMessagePath'),
                dataIndex: 'errorMessagePath',
                width: 150,
                itemId: 'errorMessagePath',
                sortable: true,
                tdCls: 'vertical-middle'
            }
        ],
        tbar: [
            {
                text: i18n.getKey('addOption'),
                iconCls: 'icon_create',
                handler: function () {
                    var store = this.ownerCt.ownerCt.store;
                    controller.editRestHttpRequestConfig(page, null, store, recordId, partnerId);
                }
            }
        ]
    };
    var configStore = Ext.create('CGP.partner.view.orderNotifyConfig.store.OrderNotifyConfigStore', {
        id: 'configStore',
        partnerId: partnerId,
        //通过用户id和记录的id查找出对应的记录
        params: {
            /*
             filter: [{name:"notifications._id",value:"' + recordId + '",type:"string"}]
             */
            filter: Ext.JSON.encode(
                [
                    {"name": "notifications._id", "value": recordId+'', "type": "string"}
                ]
            )
        }
    });
    configStore.on('load', function () {
        if (createOrUpdate == 'edit') {
            configRecode = configStore.getAt(0);//获取对应的记录
        } else {
            configRecode = Ext.create('CGP.partner.view.orderNotifyConfig.model.OrderNotifyConfigModel');
        }
        var data = configRecode.get('restHttpRequestConfigs');
        var restHttpRequestConfigStore = Ext.create('Ext.data.Store', {
            model: 'CGP.partner.view.orderNotifyConfig.model.RestHttpRequestConfigModel',
            autoSync: true,
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json'
                }
            },
            data: data,
            listeners: {
                'add': function (store) {
                    store.sort('clazz')

                },
                'remove': function (store) {
                    store.sort('clazz')
                }

            }

        });
        var restHttpRequestConfigGrid = Ext.Object.merge({id: 'restHttpRequestConfigGrid', store: restHttpRequestConfigStore, renderTo: 'grid1'}, baseGrid);
        var restHttpRequestConfigs = Ext.create("Ext.ux.form.GridField", {
            name: 'restHttpRequestConfigs',
            labelWidth: 150,
            padding: 10,
            msgTarget: 'under',
            labelAlign: 'left',
            gridConfig: restHttpRequestConfigGrid,
            fieldLabel: i18n.getKey('restHttpRequestConfigs'),
            itemId: 'restHttpRequestConfigs',
            id: 'restHttpRequestConfigs'
        });
        var form = Ext.create('Ext.form.Panel', {
            autoScroll: true,
            id: 'form',
            layout: {
                type: 'table',
                columns: 1
            },
            frame: false,
            msgTarget: 'under',
            defaults: {
                padding: 10,
                width: 600,
                allowBlank: false,
                msgTarget: 'under',
                labelWidth: 150
            },
            border: false,
            items: [
                {
                    xtype: 'textfield',
                    name: '_id',
                    id: '_id',
                    editable: false,
                    allowBlank: true,
                    fieldLabel: i18n.getKey('id'),
                    hidden: (createOrUpdate == 'create' ? true : false),
                    fieldStyle: 'background-color:silver',
                    value: configRecode.get('_id')
                },
                {
                    xtype: 'combo',
                    editable: false,
                    name: 'statusName',
                    id: 'statusName',
                    store: Ext.create('CGP.orderlineitem.store.OrderItemStatus'),
                    displayField: 'name',
                    valueField: 'name',
                    value: configRecode.get('statusName'),
                    fieldLabel: i18n.getKey('orderStatus'),
                    listeners: {
                        change: function (view, notify, old) {
                            Ext.getCmp('statusId').setValue(view.displayTplData[0]['id']);
                        }
                    }
                },
                {
                    xtype: 'hidden',
                    name: 'statusId',
                    id: 'statusId',
                    allowBlank: true,
                    value: configRecode.get('statusId')
                },
                {
                    xtype: 'combo',
                    editable: false,
                    fieldLabel: i18n.getKey('testOrNot'),
                    value: (createOrUpdate == 'create' ? null : configRecode.get('test')),
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            {name: 'name', type: 'string'},
                            {name: 'value', type: 'boolean'}
                        ],
                        data: [
                            {name: '否', value: false},
                            {name: '是', value: true}
                        ]
                    }),
                    displayField: 'name',
                    valueField: 'value',
                    name: 'test',
                    id: 'test'
                },
                restHttpRequestConfigs
            ],
            tbar: [
                {
                    xtype: 'button',
                    itemId: 'btnSave',
                    text: i18n.getKey('save'),
                    iconCls: 'icon_save',
                    handler: function () {
                        if (this.ownerCt.ownerCt.form.isValid()) {
                            controller.saveConfig(form, createOrUpdate, partnerId, recordId);
                        }
                    }
                },
                {
                    xtype: 'button',
                    itemId: 'btnGrid',
                    text: i18n.getKey('grid'),
                    iconCls: 'icon_grid',
                    handler: function () {
                        JSOpen({
                            id: 'orderNotifyConfig',
                            url: path + 'partials/partner/orderNotifyConfig.html?id=' + partnerId,
                            refresh: true
                        });
                    }
                }
            ]
        });
        page.add(form);
    });
    window.page = page;
});
