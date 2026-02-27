Ext.define('CGP.partner.view.syncpartner.InputFormWin', {
    extend: 'Ext.window.Window',
    title: i18n.getKey('syncpartner'),
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
    /* width: 800,
     height: 600,*/

    initComponent: function () {
        var me = this;
        me.store = Ext.create('CGP.partner.view.syncpartner.LocalPartnerStore', {
            data: me.partnerList
        });
        var user = Ext.util.Cookies.get("user");
        me.targetEnv = [
            {name: '开发测试', value: 'dev'},
            {name: '内部测试', value: 'test'},
            {name: '正式环境', value: 'prod'}
        ]
        me.callParent(arguments);
        me.filterTargetEnv();
        me.form = Ext.create('Ext.ux.form.ErrorStrickForm', {
            autoScroll: true,
            bodyPadding: 10,
            //region: "center",
            width: 850,
            height: 450,
            defaults: {
                width: 350,
                labelAlign: 'right',
            },
            //layout: 'vbox',
            items: [
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
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('description'),
                    allowBlank: true,
                    name: 'comment'
                },
                {
                    xtype: 'gridfield',
                    fieldLabel: i18n.getKey('partner'),
                    labelWidth: 100,
                    width: '98%',
                    allowBlank: false,
                    labelAlign: 'right',
                    id: 'gridfield',
                    gridConfig: {
                        simpleSelect: true,
                        menuDisabled: false,
                        store: me.store,
                        width: '100%',
                        region: "center",
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
                                dataIndex: 'code',
                                text: i18n.getKey('code'),
                                tdCls: 'vertical-middle',
                                align: 'center',
                                flex: 1,
                                menuDisabled: true
                            }
                        ]

                    },
                    name: 'partnerIds'
                }

            ],
            bbar: [
                '->',
                {
                    text: i18n.getKey('confirm'),
                    iconCls: 'icon_agree',
                    handler: function () {
                        if (me.form.isValid()) {
                            var data = me.getValue();
                            var pbar=me.createProgressBar(me.page.down('toolbar'));
                            me.syncpartners(data,pbar);
                            me.close();
                        }

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
        Ext.Array.each(me.form.items.items, function (item) {
            if (item.name == 'partnerIds') {
                result[item.name] = [];
                var partnerList = item.getSubmitValue();
                Ext.each(partnerList, function (partner) {
                    result[item.name].push(partner.id);
                })
            } else {
                if (item.diyGetValue) {
                    result[item.name] = item.diyGetValue();
                } else {
                    result[item.name] = item.getValue();
                }
            }
        });
        return result;
    },
    syncpartners: function (data,pbar) {
        var me = this;
        Ext.Ajax.request({
            url: adminPath + 'api/partnerSync',
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: data,
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    pbar.updateProgress(1, Math.round(100 * 1) + '% completed...');
                    var syncProgressId = responseMessage.data;
                    setTimeout(function(){pbar.hide();},5000);
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        })
    },
    showProgressBar: function (syncProgressId, data) {

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

    createProgressBar: function (toolbar) {
        var pbar = Ext.create('Ext.ProgressBar', {
            text: 'Ready',
            id: 'pbar2',
            width: 400,
            cls: 'left-align',
            animate:true
        });
        toolbar.add(pbar);
        return pbar;
    },
});
