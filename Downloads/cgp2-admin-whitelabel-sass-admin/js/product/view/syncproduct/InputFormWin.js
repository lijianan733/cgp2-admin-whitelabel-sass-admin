Ext.define('CGP.product.view.syncproduct.InputFormWin', {
    extend: 'Ext.window.Window',
    title: i18n.getKey('syncProduct'),
    modal: true,
    border: false,
    autoScroll: true,
    autoShow: true,
    //layout: 'border',
    layout: 'fit',
    config: {
        orderId: null,
        controller: null
    },
    singleProduct: false,
    initComponent: function () {
        var me = this;
        me.store = Ext.create('CGP.product.view.syncproduct.LocalProductStore', {
            data: me.productList
        });
        var user = Ext.util.Cookies.get("user");
        me.targetEnv = [
            {name: '开发测试', value: 'dev'},
            {name: '内部测试', value: 'test'},
            {name: '正式环境', value: 'prod'},
            {name: '微软云', value: 'azure_prod'}
        ];
        me.callParent(arguments);
        me.filterTargetEnv();
        var userStore = Ext.create('CGP.customer.store.CustomerStore', {
            autoLoad: false
        });
        var user = Ext.util.Cookies.get("user");
        user = Ext.JSON.decode(user);
        me.form = Ext.create('Ext.ux.form.ErrorStrickForm', {
            autoScroll: true,
            bodyPadding: 10,
            //region: "center",
            width: 850,
            height: 450,
            defaults: {
                width: 400,
                labelWidth: 100,
                labelAlign: 'right',
            },
            items: [
                {
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('description'),
                    allowBlank: true,
                    name: 'comment'
                },
                {
                    xtype: 'radiogroup',
                    fieldLabel: i18n.getKey('是否只同步产品的排版配置'),
                    itemId: 'onlyComposingConfig',
                    name: 'onlyComposingConfig',
                    vertical: false,
                    defaults: {
                        width: 100
                    },
                    items: [
                        {
                            boxLabel: i18n.getKey('true'),
                            name: 'onlyComposingConfig',
                            inputValue: true,
                            itemId: 'true',
                        },
                        {
                            boxLabel: i18n.getKey('false'),
                            name: 'onlyComposingConfig',
                            inputValue: false,
                            checked: true,
                            itemId: 'false',
                        }
                    ],
                    listeners: {
                        change: function (field, newValue, oldValue) {
                            var withSku = field.ownerCt.getComponent('withSku');
                            withSku.setVisible(!newValue.onlyComposingConfig);
                        }
                    }
                },
                {
                    xtype: 'radiogroup',
                    fieldLabel: i18n.getKey('是否同时同步可配置产品下的SKU产品'),
                    itemId: 'withSku',
                    name: 'withSku',
                    vertical: false,
                    defaults: {
                        width: 100
                    },
                    items: [
                        {
                            boxLabel: i18n.getKey('true'),
                            name: 'withSku',
                            inputValue: true,
                            itemId: 'true',
                        },
                        {
                            boxLabel: i18n.getKey('false'),
                            name: 'withSku',
                            inputValue: false,
                            checked: true,
                            itemId: 'false',
                        }
                    ]
                },
                {
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('targetEnv'),
                    store: Ext.create('Ext.data.Store', {
                        fields: ['name', 'value'],
                        data: me.targetEnv
                    }),
                    editable: false,
                    allowBlank: false,
                    valueField: 'value',
                    queryMode: 'local',
                    displayField: 'name',
                    labelAlign: 'right',
                    name: 'targetEnv'
                },
                {
                    xtype: 'hiddenfield',
                    name: 'userId',
                    value: user.userId
                },
                {
                    xtype: 'checkboxfield',
                    name: 'configData',
                    fieldLabel: i18n.getKey('sync') + i18n.getKey('compose') + i18n.getKey('configValue'),
                    inputValue: true,
                },
                {
                    xtype: 'checkboxfield',
                    fieldLabel: i18n.getKey('sync') + i18n.getKey('compose') + i18n.getKey('template'),
                    name: 'template',
                    inputValue: true,
                },
                {
                    xtype: 'radiogroup',
                    fieldLabel: i18n.getKey('校验目标环境排版模板'),
                    itemId: 'isStrictValidate',
                    name: 'isStrictValidate',
                    vertical: false,
                    colspan: 2,
                    width: 400,
                    labelWidth: 100,
                    defaults: {
                        width: 100
                    },
                    items: [
                        {
                            boxLabel: i18n.getKey('true'),
                            name: 'value',
                            inputValue: true,
                            checked: true
                        },
                        {
                            boxLabel: i18n.getKey('false'),
                            name: 'value',
                            inputValue: false
                        }
                    ]
                },
                {
                    xtype: 'gridfield',
                    fieldLabel: i18n.getKey('product'),
                    labelWidth: 100,
                    width: '98%',
                    allowBlank: false,
                    hidden: me.singleProduct,
                    labelAlign: 'right',
                    id: 'gridfield',
                    gridConfig: {
                        simpleSelect: true,
                        menuDisabled: false,
                        store: me.store,
                        width: '100%',
                        region: "center",
                        selType: 'checkboxmodel',
                        columns: [
                            {
                                xtype: 'actioncolumn',
                                itemId: 'actioncolumn',
                                sortable: false,
                                resizable: false,
                                menuDisabled: true,
                                width: 45,
                                align: 'center',
                                tdCls: 'vertical-middle',
                                items: [
                                    {
                                        iconCls: 'icon_remove icon_margin',
                                        itemId: 'actionremove',
                                        tooltip: 'Remove',
                                        handler: function (view, rowIndex, colIndex) {
                                            var store = view.getStore();
                                            store.removeAt(rowIndex);
                                        }
                                    }
                                ]

                            },
                            {
                                text: i18n.getKey('id'),
                                dataIndex: 'id',
                                tdCls: 'vertical-middle',
                                align: 'center',
                                sortable: false,
                                menuDisabled: true,
                                width: 180

                            },
                            {
                                dataIndex: 'name',
                                text: i18n.getKey('name'),
                                tdCls: 'vertical-middle',
                                align: 'center',
                                width: 250,
                                menuDisabled: true
                            },
                            {
                                dataIndex: 'type',
                                text: i18n.getKey('type'),
                                tdCls: 'vertical-middle',
                                align: 'center',
                                flex: 1,
                                menuDisabled: true
                            }
                        ]

                    },
                    name: 'productIds',
                    listeners: {
                        afterrender: function (comp) {
                            comp.getGrid().getSelectionModel().selectAll();
                        }
                    }
                }
            ],
            bbar: [
                '->',
                {
                    text: i18n.getKey('confirm'),
                    iconCls: 'icon_agree',
                    handler: function () {
                        if (!me.form.isValid()) {
                            return false;
                        }
                        var selecteds = Ext.getCmp('gridfield').getGrid().getSelectionModel().getSelection();
                        if (selecteds.length < 1) {
                            Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('至少选中一个产品同步'));
                            return false;
                        }
                        var data = me.getValue();
                        me.syncProducts(data);
                        me.close();
                    }
                },
                {
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function () {
                        me.close();
                    }
                }
            ]
        });

        me.add(me.form);
        me.addListener('resize', function (window, width, height, eOpts) {
            var grid = Ext.getCmp('gridfield').getGrid();
            grid.doLayout();
        });
    },
    getValue: function () {
        var me = this;
        var result = {};
        var items = me.form.items.items;
        Ext.Array.each(items, function (item) {
            if (item.name == 'productIds') {
                result[item.name] = [];
                var productList = item.getGrid().getSelectionModel().getSelection();
                Ext.each(productList, function (record) {
                    result[item.name].push(record.get('id'));
                })
            } else if (item.diyGetValue) {
                result[item.name] = item.diyGetValue();
            } else {
                result[item.name] = item.getValue();
            }
        });
        result.comment = 'test';
        return result;
    },
    syncProducts: function (data) {
        var me = this;
        var failurefn = function (response) {
            var responseMessage = Ext.JSON.decode(response.responseText);
            Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
        };
        if (data.onlyComposingConfig.onlyComposingConfig == false) {
            JSAjaxRequest(
                adminPath + 'api/productSync?withSku=' + data.withSku.withSku,
                'POST',
                true,
                data,
                null,
                function (require, success, response) {
                    if (success) {
                        var responseMessage = Ext.JSON.decode(response.responseText);
                        if (responseMessage.success) {
                            var syncProgressId = responseMessage.data;
                            me.showProgressBar(syncProgressId, data);
                        }
                    }
                }
            )
        }
        var products = data.productIds;
        var succfn = function (response) {
            var responseMessage = Ext.JSON.decode(response.responseText);
            if (!responseMessage.success) {
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        };
        var targetEnv = data.targetEnv;
        if (data.configData && data.template) {//配置数据+模板同步
            Ext.Ajax.request({
                url: composingPath + 'api/composingInfos/sync?syncEnvironment=' + targetEnv + '&isStrictValidate=' + (data.isStrictValidate.value ? 'true' : 'false'),
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                jsonData: products,
                success: succfn,
                failure: failurefn
            })
        } else if (data.configData) {//配置数据同步
            Ext.Ajax.request({
                url: composingPath + 'api/composingInfos/sync/configs?syncEnvironment=' + targetEnv,
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                jsonData: products,
                success: succfn,
                failure: failurefn
            })
        } else if (data.template) {//模板同步
            Ext.Ajax.request({
                url: composingPath + 'api/composingInfos/sync/templates?syncEnvironment=' + targetEnv + '&isStrictValidate=' + (data.isStrictValidate.value ? 'true' : 'false'),
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                jsonData: products,
                success: succfn,
                failure: failurefn
            })
        }
    },


    showProgressBar: function (syncProgressId, data) {
        var me = this;
        var Runner = function () {
            var f = function (v, pbar, count, cb, syncProgressId) {
                return function () {
                    if (v > count) {
                        //btn.dom.disabled = false;
                        cb();
                    } else {
                        Ext.Ajax.request({
                            url: adminPath + 'api/productSyncProgresses/' + syncProgressId,
                            method: 'GET',
                            headers: {
                                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                            },
                            success: function (response) {
                                var responseMessage = Ext.JSON.decode(response.responseText);
                                if (responseMessage.success) {
                                    var completeItems = responseMessage.data.collectionNames.length;
                                    var allItems = responseMessage.data.totalCollectionNames.length;
                                    if (completeItems == allItems) {
                                        cb();
                                    } else {
                                        var i = completeItems / allItems;
                                        pbar.updateProgress(i, Math.round(100 * i) + '% completed...');
                                    }
                                } else {
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                }
                            },
                            failure: function (response) {
                                var responseMessage = Ext.JSON.decode(response.responseText);
                                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                            }
                        })

                        /*if(pbar.id=='pbar4'){
                            //give this one a different count style for fun
                            var i = v/count;
                            pbar.updateProgress(i, Math.round(100*i)+'% completed...');
                        }else{
                            pbar.updateProgress(v/count, 'Loading item ' + v + ' of '+count+'...');
                        }*/
                    }
                };
            };
            return {
                run: function (pbar, count, syncProgressId, cb) {
                    for (var i = 1; i < (count + 2); i++) {
                        setTimeout(f(i, pbar, count, cb, syncProgressId), 1500);
                    }
                }
            };
        }(syncProgressId);
        var pbar2 = Ext.create('Ext.ProgressBar', {
            text: 'Ready',
            id: 'pbar2',
            width: 450,
            cls: 'left-align'
        });
        /*pbar2.wait({
            interval: 2000,
            /!*duration: 5000,
            increment: 15,*!/
            fn: function () {
                pbar2.reset();
                pbar2.updateText('Done.');
            }
        });*/
        me.progressContainer.add(pbar2);
        me.runProgress(syncProgressId, pbar2, data)
        /*Runner.run(pbar2, 10, syncProgressId, function () {
            pbar2.reset();
            pbar2.updateText('Done.');
        });*/
    },
    filterTargetEnv: function () {
        var me = this;
        Ext.Array.each(me.targetEnv, function (item, index) {
            if (item.value == window.env) {
                me.targetEnv.splice(index, 1);
                return false;
            }
        })
    },
    runProgress: function (syncProgressId, pbar, data) {
        var me = this;

        function complete(tips) {
            pbar.reset();
            pbar.updateText(tips);
        }

        function updateProgress() {
            Ext.Ajax.request({
                url: adminPath + 'api/productSyncProgresses/' + syncProgressId,
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                success: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    if (responseMessage.success) {

                        if (responseMessage.data.status == 'success') {
                            complete('success');
                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('sync') + i18n.getKey('success') + '！');
                            var task = new Ext.util.DelayedTask(function () {
                                pbar.hide();
                            });
                            task.delay(5000);
                        } else if (responseMessage.data.status == 'waiting' || responseMessage.data.status == 'verifying') {
                            pbar.updateProgress(0, responseMessage.data.status);
                            setTimeout(updateProgress, 1500);
                        } else if (responseMessage.data.status == 'syncing') {
                            var completeItems = responseMessage.data.collectionNames.length;
                            var allItems = responseMessage.data.totalCollectionNames.length;
                            var i = completeItems / allItems;
                            pbar.updateProgress(i, Math.round(100 * i) + '% completed...');
                            setTimeout(updateProgress, 1500);
                        } else {
                            complete('failure');
                            pbar.hide();
                            //me.page.
                            Ext.Msg.alert(i18n.getKey('prompt'), responseMessage.data?.failureDesc);
                            var retryBtn = me.progressContainer.getComponent('retryBtn');
                            if (retryBtn) {
                                me.progressContainer.remove(retryBtn);
                            }
                            me.progressContainer.add({
                                text: i18n.getKey('retry'),
                                itemId: 'retryBtn',
                                handler: function () {
                                    me.syncProducts(data);
                                }
                            });
                        }
                    } else {
                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                    }
                },
                failure: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            })

            /*if(pbar.id=='pbar4'){
                //give this one a different count style for fun
                var i = v/count;
                pbar.updateProgress(i, Math.round(100*i)+'% completed...');
            }else{
                pbar.updateProgress(v/count, 'Loading item ' + v + ' of '+count+'...');
            }*/

        };
        setTimeout(updateProgress, 1500);
    }

});
